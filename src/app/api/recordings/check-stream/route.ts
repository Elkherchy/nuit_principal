import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pige.siraj-ai.com";

/**
 * Route API pour vérifier la disponibilité d'un stream audio
 * Fait office de proxy vers le backend de pige
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validation
    if (!url) {
      return NextResponse.json(
        {
          success: false,
          message: "❌ Le paramètre 'url' est requis",
        },
        { status: 400 }
      );
    }

    console.log(`🔍 Vérification du stream: ${url}`);

    // Appeler le backend
    const backendResponse = await fetch(
      `${API_BASE}/api/recordings/check-stream/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(
        `❌ Erreur backend (${backendResponse.status}):`,
        errorText
      );

      return NextResponse.json(
        {
          url,
          available: false,
          error: errorText,
        },
        { status: backendResponse.status }
      );
    }

    // Succès
    const data = await backendResponse.json();
    console.log(`✅ Stream vérifié:`, data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Erreur lors de la vérification du stream:", error);

    return NextResponse.json(
      {
        url: request.url,
        available: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur de connexion au backend",
      },
      { status: 503 }
    );
  }
}

