import { NextRequest, NextResponse } from "next/server";
import { getGridFSBucket } from "@/lib/mongodb";
import { createFileStorage } from "@/lib/fileStorage";

// Helper function to determine content disposition
function getContentDisposition(contentType: string, filename: string): string {
  // Show these types inline in the browser
  const inlineTypes = [
    "image/",
    "video/",
    "audio/",
    "application/pdf",
    "text/",
  ];

  const shouldDisplayInline = inlineTypes.some((type) =>
    contentType.startsWith(type)
  );

  const disposition = shouldDisplayInline ? "inline" : "attachment";
  return `${disposition}; filename="${encodeURIComponent(filename)}"`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileId = searchParams.get("fileId");
  const filename = searchParams.get("filename");
  const range = request.headers.get("range");

  if (!fileId && !filename) {
    return NextResponse.json(
      { error: "fileId ou filename requis" },
      { status: 400 }
    );
  }

  try {
    const bucket = await getGridFSBucket();
    const storage = createFileStorage(bucket);

    let metadata;

    // Si on a un fileId, on l'utilise directement
    if (fileId) {
      metadata = await storage.getFileMetadata(fileId);
    } else if (filename) {
      // Sinon on cherche par nom de fichier
      const cursor = bucket.find({ filename });
      const gridFile = await cursor.next();
      
      if (!gridFile) {
        return NextResponse.json(
          { error: "Fichier non trouvé" },
          { status: 404 }
        );
      }
      
      metadata = await storage.getFileMetadata(gridFile._id.toString());
    } else {
      return NextResponse.json(
        { error: "Paramètres invalides" },
        { status: 400 }
      );
    }

    const contentType = metadata.contentType || "application/octet-stream";

    // Parse range header pour le streaming
    if (range) {
      const bytesPrefix = "bytes=";
      if (range.startsWith(bytesPrefix)) {
        const bytesRange = range.substring(bytesPrefix.length);
        const parts = bytesRange.split("-");
        const start = parseInt(parts[0]);
        const end = parts[1] ? parseInt(parts[1]) : metadata.size - 1;

        if (start >= 0 && end < metadata.size && start <= end) {
          // Stream avec range (partial content)
          const fileStream = await storage.readFileRange(
            metadata.id,
            start,
            end
          );

          // Convertir le stream en Response
          const headers = new Headers({
            "Accept-Ranges": "bytes",
            "Content-Range": `bytes ${start}-${end}/${metadata.size}`,
            "Content-Length": (end - start + 1).toString(),
            "Content-Type": contentType,
            "Content-Disposition": getContentDisposition(
              contentType,
              metadata.filename
            ),
          });

          // Créer un ReadableStream à partir du stream Node.js
          const readableStream = new ReadableStream({
            async start(controller) {
              fileStream.on("data", (chunk: Buffer) => {
                controller.enqueue(new Uint8Array(chunk));
              });

              fileStream.on("end", () => {
                controller.close();
              });

              fileStream.on("error", (error: Error) => {
                console.error("Error streaming file:", error);
                controller.error(error);
              });
            },
          });

          return new NextResponse(readableStream, {
            status: 206,
            headers,
          });
        }
      }
    }

    // Si pas de range ou range invalide, envoyer le fichier entier
    const fileStream = await storage.readFileRange(
      metadata.id,
      0,
      metadata.size - 1
    );

    const headers = new Headers({
      "Accept-Ranges": "bytes",
      "Content-Length": metadata.size.toString(),
      "Content-Type": contentType,
      "Content-Disposition": getContentDisposition(
        contentType,
        metadata.filename
      ),
    });

    // Créer un ReadableStream à partir du stream Node.js
    const readableStream = new ReadableStream({
      async start(controller) {
        fileStream.on("data", (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });

        fileStream.on("end", () => {
          controller.close();
        });

        fileStream.on("error", (error: Error) => {
          console.error("Error streaming file:", error);
          controller.error(error);
        });
      },
    });

    return new NextResponse(readableStream, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error handling file request:", error);
    return NextResponse.json(
      { 
        error: "Erreur interne du serveur",
        message: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}

