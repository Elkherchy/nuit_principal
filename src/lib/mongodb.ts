import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cache la connexion pour éviter les reconnexions multiples
declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Vérifier MONGODB_URI seulement au moment de l'utilisation (runtime)
  if (!MONGODB_URI) {
    throw new Error(
      "⚠️ Veuillez définir la variable d'environnement MONGODB_URI dans .env.local"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      console.log("✅ MongoDB connecté avec succès");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function getGridFSBucket(): Promise<mongoose.mongo.GridFSBucket> {
  const mongooseInstance = await connectToDatabase();
  
  const db = mongooseInstance.connection.db;
  if (!db) {
    throw new Error("❌ Base de données MongoDB non disponible");
  }

  return new mongoose.mongo.GridFSBucket(db, {
    bucketName: "audio_files", // Nom du bucket pour les fichiers audio
  });
}

