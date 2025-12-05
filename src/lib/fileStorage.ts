import mongoose from "mongoose";
import { Readable } from "stream";

// Interface for file storage operations - makes it easy to swap implementations
export interface FileStorage {
  getFileMetadata(fileId: string): Promise<FileMetadata>;
  saveFile(
    fileStream: Readable,
    filename: string,
    metadata?: Record<string, any>
  ): Promise<string>;
  readFileRange(fileId: string, start: number, end: number): Promise<Readable>;
  fileExists(filename: string): Promise<boolean>;
}

// Common file metadata interface
export interface FileMetadata {
  id: string;
  filename: string;
  size: number;
  uploadDate: Date;
  contentType?: string;
  metadata?: Record<string, any>;
}

// Mongoose GridFS implementation
export class GridFSStorage implements FileStorage {
  private bucket: mongoose.mongo.GridFSBucket;

  constructor(bucket: mongoose.mongo.GridFSBucket) {
    this.bucket = bucket;
  }

  async fileExists(filename: string): Promise<boolean> {
    const file = await this.bucket.find({ filename }).next();
    return file !== null;
  }

  async getFileMetadata(fileId: string): Promise<FileMetadata> {
    const file = await this.bucket
      .find({ _id: new mongoose.Types.ObjectId(fileId) })
      .next();

    if (!file) {
      throw new Error("File not found");
    }

    return {
      id: file._id.toString(),
      filename: file.filename,
      size: file.length,
      uploadDate: file.uploadDate,
      contentType: file.metadata?.contentType || "application/octet-stream",
      metadata: file.metadata,
    };
  }

  async saveFile(
    fileStream: Readable,
    filename: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.bucket.openUploadStream(filename, {
        metadata,
      });

      fileStream
        .pipe(uploadStream)
        .on("error", (error: Error) => reject(error))
        .on("finish", () => resolve(uploadStream.id.toString()));
    });
  }

  async readFileRange(
    fileId: string,
    start: number,
    end: number
  ): Promise<Readable> {
    const downloadStream = this.bucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId),
      {
        start,
        end: end + 1, // GridFS end is exclusive
      }
    );

    return downloadStream;
  }
}

// Factory function to create the appropriate storage implementation
export function createFileStorage(
  bucket: mongoose.mongo.GridFSBucket
): FileStorage {
  return new GridFSStorage(bucket);
}

