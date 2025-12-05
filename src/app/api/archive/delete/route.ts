import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pige.siraj-ai.com";

/**
 * Route API pour supprimer un enregistrement
 */
export async function DELETE(request: NextRequest) {
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

    console.log(`🗑️ Suppression de l'enregistrement ${recording_id}...`);

    // Appeler le backend pour supprimer
    const backendResponse = await fetch(
      `${API_BASE}/api/archive/recordings/${recording_id}/`,
      {
        method: "DELETE",
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
          message: `❌ Erreur lors de la suppression (${backendResponse.status})`,
          error: errorText,
        },
        { status: backendResponse.status }
      );
    }

    console.log(`✅ Enregistrement ${recording_id} supprimé`);
    
    return NextResponse.json({
      success: true,
      message: "✅ Enregistrement supprimé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression:", error);

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

