import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pige.siraj-ai.com";

/**
 * Route API pour générer un résumé IA d'un enregistrement
 * Fait office de proxy vers le backend de pige
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recording_id, max_sentences = 5 } = body;

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

    // Appeler le backend pour générer le résumé
    const backendResponse = await fetch(`${API_BASE}/api/ai/summarize/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recording_id,
        max_sentences,
      }),
    });

    // Gérer la réponse du backend
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(
        `❌ Erreur backend (${backendResponse.status}):`,
        errorText
      );

      // Si le service AI n'est pas disponible
      if (backendResponse.status === 503) {
        return NextResponse.json(
          {
            success: false,
            message:
              "⚠️ Le service de résumé IA est temporairement indisponible",
            error: errorText,
          },
          { status: 503 }
        );
      }

      // Si l'enregistrement n'existe pas ou n'a pas de transcription
      if (backendResponse.status === 404) {
        return NextResponse.json(
          {
            success: false,
            message:
              "❌ Enregistrement introuvable ou aucune transcription disponible",
          },
          { status: 404 }
        );
      }

      // Autres erreurs
      return NextResponse.json(
        {
          success: false,
          message: `❌ Erreur lors de la génération du résumé (${backendResponse.status})`,
          error: errorText,
        },
        { status: backendResponse.status }
      );
    }

    // Succès - retourner le résumé
    const data = await backendResponse.json();
    return NextResponse.json({
      success: true,
      summary: data.summary,
      message: data.message || "✅ Résumé généré avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur lors de la génération du résumé:", error);

    // Gérer les erreurs de connexion
    if (
      error instanceof TypeError &&
      error.message.includes("fetch failed")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "⚠️ Impossible de contacter le serveur de résumé IA. Vérifiez votre connexion.",
          error: "Service backend inaccessible",
        },
        { status: 503 }
      );
    }

    // Erreur générique
    return NextResponse.json(
      {
        success: false,
        message: "❌ Erreur interne lors de la génération du résumé",
        error:
          error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

