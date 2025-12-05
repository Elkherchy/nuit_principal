import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pige.siraj-ai.com";

/**
 * Route pour démarrer un enregistrement depuis une URL de stream
 * SANS upload de fichier - utilise uniquement des URLs
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, title, format, duration } = body;

    if (!source) {
      return NextResponse.json(
        { success: false, message: "❌ URL de stream requise" },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { success: false, message: "❌ Titre requis" },
        { status: 400 }
      );
    }

    console.log(
      `📡 Démarrage de l'enregistrement: "${title}" depuis ${source}`
    );

    // Envoyer directement au backend Django
    const backendResponse = await fetch(
      `${API_BASE}/api/recordings/jobs/start/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source,
          title,
          format: format || "mp3",
          duration: duration || 30,
        }),
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
          message: `❌ Erreur du serveur backend (${backendResponse.status})`,
          error: errorText,
        },
        { status: backendResponse.status }
      );
    }

    // Succès
    const backendData = await backendResponse.json();
    console.log(`✅ Enregistrement démarré:`, backendData);

    return NextResponse.json({
      success: true,
      ...backendData,
      message: `✅ Enregistrement de "${title}" démarré avec succès`,
    });
  } catch (error) {
    console.error("❌ Erreur lors du démarrage de l'enregistrement:", error);

    return NextResponse.json(
      {
        success: false,
        message: `❌ Erreur de connexion au backend: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
      },
      { status: 503 }
    );
  }
}
