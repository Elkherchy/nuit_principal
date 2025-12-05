import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://91.98.158.148";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio_file") as File;
    const title = formData.get("title") as string;
    const format = formData.get("format") as string;
    const duration = formData.get("duration") as string;

    if (!audioFile) {
      return NextResponse.json(
        { success: false, message: "Aucun fichier audio fourni" },
        { status: 400 }
      );
    }

    // Créer un répertoire temporaire pour les uploads si nécessaire
    const uploadDir = path.join(process.cwd(), "public", "uploads", "audio");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileName = `${timestamp}-${audioFile.name}`;
    const filePath = path.join(uploadDir, fileName);

    // Convertir le fichier en buffer et le sauvegarder
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Construire l'URL publique du fichier
    const publicUrl = `/uploads/audio/${fileName}`;

    // Envoyer le fichier au backend de pige
    const backendFormData = new FormData();
    backendFormData.append("audio_file", audioFile);
    backendFormData.append("title", title);
    backendFormData.append("format", format);
    backendFormData.append("duration", duration);
    backendFormData.append("local_path", publicUrl);

    // Appeler l'API backend pour traiter l'enregistrement
    const backendResponse = await fetch(`${API_BASE}/api/recordings/upload/`, {
      method: "POST",
      body: backendFormData,
    });

    const backendData = await backendResponse.json();

    return NextResponse.json({
      success: true,
      ...backendData,
      local_url: publicUrl,
      message: `✅ Fichier "${audioFile.name}" uploadé avec succès`,
    });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      {
        success: false,
        message: `❌ Erreur lors de l'upload: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
      },
      { status: 500 }
    );
  }
}

