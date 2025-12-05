import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pige.siraj-ai.com";

/**
 * Route API pour traiter complètement un enregistrement
 * (transcription + résumé en une seule requête)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recording_id } = body;

    // Validation
    if (!recording_id) {
      return NextResponse.json(
        {
          success: false,
          message: "❌ Le paramètre 'recording_id' est requis",
        },
        { status: 400 }
      );
    }

    console.log(`⚙️ Traitement complet de l'enregistrement ${recording_id}...`);

    // Appeler le backend pour traiter
    const backendResponse = await fetch(
      `${API_BASE}/api/archive/recordings/${recording_id}/process/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          success: false,
          message: `❌ Erreur lors du traitement (${backendResponse.status})`,
          error: errorText,
        },
        { status: backendResponse.status }
      );
    }

    // Succès
    const data = await backendResponse.json();
    console.log(`✅ Enregistrement traité avec succès`);
    
    return NextResponse.json({
      success: true,
      ...data,
      message: "✅ Enregistrement traité (transcription + résumé)",
    });
  } catch (error) {
    console.error("❌ Erreur lors du traitement:", error);

    return NextResponse.json(
      {
        success: false,
        message: "❌ Erreur de connexion au backend",
        error:
          error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 503 }
    );
  }
}

