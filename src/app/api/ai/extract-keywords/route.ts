import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pige.siraj-ai.com";

/**
 * Route API pour extraire les mots-clés d'un enregistrement
 * Fait office de proxy vers le backend de pige
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recording_id, max_keywords = 10 } = body;

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

    console.log(`🔑 Extraction de ${max_keywords} mots-clés pour l'enregistrement ${recording_id}...`);

    // Appeler le backend pour extraire les mots-clés
    const backendResponse = await fetch(`${API_BASE}/api/ai/extract-keywords/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recording_id,
        max_keywords,
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
          message: `❌ Erreur lors de l'extraction des mots-clés (${backendResponse.status})`,
          error: errorText,
        },
        { status: backendResponse.status }
      );
    }

    // Succès - retourner les mots-clés
    const data = await backendResponse.json();
    console.log(`✅ ${data.keywords?.length || 0} mots-clés extraits`);
    
    return NextResponse.json({
      success: true,
      keywords: data.keywords || [],
      message: data.message || "✅ Mots-clés extraits avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'extraction des mots-clés:", error);

    // Gérer les erreurs de connexion
    if (
      error instanceof TypeError &&
      error.message.includes("fetch failed")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "⚠️ Impossible de contacter le serveur d'extraction de mots-clés.",
          error: "Service backend inaccessible",
        },
        { status: 503 }
      );
    }

    // Erreur générique
    return NextResponse.json(
      {
        success: false,
        message: "❌ Erreur interne lors de l'extraction des mots-clés",
        error:
          error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

