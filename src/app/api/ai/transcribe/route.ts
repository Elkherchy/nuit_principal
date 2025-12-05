import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pige.siraj-ai.com";

/**
 * Route API pour transcrire un enregistrement audio
 * Fait office de proxy vers le backend de pige
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recording_id, language = "fr" } = body;

    // Validation des paramètres
    if (!recording_id) {
      return NextResponse.json(
        {
          success: false,
          message: "❌ Le paramètre 'recording_id' est requis",
        },
        { status: 400 }
      );
    }

    console.log(`🎤 Transcription de l'enregistrement ${recording_id} en ${language}...`);

    // Appeler le backend pour transcrire
    const backendResponse = await fetch(`${API_BASE}/api/ai/transcribe/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recording_id,
        language,
      }),
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
          message: `❌ Erreur lors de la transcription (${backendResponse.status})`,
          error: errorText,
        },
        { status: backendResponse.status }
      );
    }

    // Succès - retourner la transcription
    const data = await backendResponse.json();
    console.log(`✅ Transcription réussie pour l'enregistrement ${recording_id}`);
    
    return NextResponse.json({
      success: true,
      transcript: data.transcript,
      language: data.language,
      message: data.message || "✅ Transcription générée avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur lors de la transcription:", error);

    // Gérer les erreurs de connexion
    if (
      error instanceof TypeError &&
      error.message.includes("fetch failed")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "⚠️ Impossible de contacter le serveur de transcription. Vérifiez votre connexion.",
          error: "Service backend inaccessible",
        },
        { status: 503 }
      );
    }

    // Erreur générique
    return NextResponse.json(
      {
        success: false,
        message: "❌ Erreur interne lors de la transcription",
        error:
          error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

