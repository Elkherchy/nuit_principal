import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pige.siraj-ai.com";

/**
 * Route API pour obtenir les informations sur les modèles IA disponibles
 * Fait office de proxy vers le backend de pige
 */
export async function GET(request: NextRequest) {
  try {
    console.log(`ℹ️ Récupération des informations sur les modèles IA...`);

    // Appeler le backend pour obtenir les infos
    const backendResponse = await fetch(`${API_BASE}/api/ai/models-info/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Gérer la réponse du backend
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(
        `❌ Erreur backend (${backendResponse.status}):`,
        errorText
      );

      return NextResponse.json(
        {
          success: false,
          message: `❌ Erreur lors de la récupération des infos modèles (${backendResponse.status})`,
          error: errorText,
        },
        { status: backendResponse.status }
      );
    }

    // Succès - retourner les informations
    const data = await backendResponse.json();
    console.log(`✅ Informations sur les modèles récupérées`);
    
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des infos modèles:", error);

    // Gérer les erreurs de connexion
    if (
      error instanceof TypeError &&
      error.message.includes("fetch failed")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "⚠️ Impossible de contacter le serveur. Les informations sur les modèles ne sont pas disponibles.",
          error: "Service backend inaccessible",
          whisper: {
            available: false,
            message: "Backend inaccessible",
          },
          mistral: {
            available: false,
            message: "Backend inaccessible",
          },
        },
        { status: 503 }
      );
    }

    // Erreur générique
    return NextResponse.json(
      {
        success: false,
        message: "❌ Erreur interne lors de la récupération des infos",
        error:
          error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

