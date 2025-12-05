import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { getGridFSBucket } from "@/lib/mongodb";
import { createFileStorage } from "@/lib/fileStorage";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pige.siraj-ai.com";

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

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileName = `${timestamp}-${audioFile.name}`;

    // Sauvegarder le fichier dans MongoDB GridFS
    let fileId: string | null = null;
    let mongoUrl: string | null = null;

    try {
      const bucket = await getGridFSBucket();
      const storage = createFileStorage(bucket);

      // Convertir le File en Stream
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const readableStream = Readable.from(buffer);

      // Sauvegarder dans GridFS avec métadonnées
      fileId = await storage.saveFile(readableStream, fileName, {
        contentType: audioFile.type || "audio/mpeg",
        originalName: audioFile.name,
        title: title,
        format: format,
        duration: duration,
        uploadDate: new Date(),
      });

      mongoUrl = `/api/recordings/stream?fileId=${fileId}`;
      console.log(`✅ Fichier sauvegardé dans MongoDB GridFS: ${fileId}`);
    } catch (mongoError) {
      console.error(
        "❌ Erreur lors de la sauvegarde dans MongoDB:",
        mongoError
      );
      // Continue quand même pour essayer d'envoyer au backend
    }

    // Envoyer le fichier au backend de pige
    const backendFormData = new FormData();
    backendFormData.append("audio_file", audioFile);
    backendFormData.append("title", title);
    backendFormData.append("format", format);
    backendFormData.append("duration", duration);
    backendFormData.append("file_name", fileName);

    if (fileId) {
      backendFormData.append("mongo_file_id", fileId);
      backendFormData.append("mongo_url", mongoUrl!);
    }

    // Appeler l'API backend pour traiter l'enregistrement
    try {
      const backendResponse = await fetch(
        `${API_BASE}/api/recordings/upload/`,
        {
          method: "POST",
          body: backendFormData,
        }
      );

      // Si le backend est accessible et répond
      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        return NextResponse.json({
          success: true,
          ...backendData,
          mongo_file_id: fileId,
          mongo_url: mongoUrl,
          message: `✅ Fichier "${audioFile.name}" uploadé avec succès`,
        });
      }

      // Si le backend retourne une erreur mais qu'on a sauvegardé dans MongoDB
      if (fileId) {
        console.warn(
          `Backend API erreur (${backendResponse.status}), mais fichier sauvegardé dans MongoDB`
        );
        return NextResponse.json({
          success: true,
          mongo_file_id: fileId,
          mongo_url: mongoUrl,
          message: `✅ Fichier "${audioFile.name}" sauvegardé dans MongoDB (backend indisponible)`,
          warning:
            "Le serveur de traitement audio n'a pas pu traiter le fichier, mais il est sauvegardé.",
        });
      }

      // Si ni le backend ni MongoDB n'ont fonctionné
      const errorText = await backendResponse.text();
      console.error(
        `Backend API erreur (${backendResponse.status}):`,
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
    } catch (backendError) {
      console.error("Backend API non accessible:", backendError);

      // Si le fichier est sauvegardé dans MongoDB, c'est un succès partiel
      if (fileId) {
        return NextResponse.json({
          success: true,
          mongo_file_id: fileId,
          mongo_url: mongoUrl,
          message: `✅ Fichier "${audioFile.name}" sauvegardé dans MongoDB`,
          warning:
            "Le serveur de traitement audio n'est pas accessible. Le fichier est sauvegardé dans la base de données.",
        });
      }

      // Échec complet
      return NextResponse.json(
        {
          success: false,
          message: "❌ Impossible de sauvegarder le fichier",
          error:
            backendError instanceof Error
              ? backendError.message
              : "Erreur inconnue",
        },
        { status: 503 }
      );
    }
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
