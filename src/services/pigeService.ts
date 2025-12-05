/**
 * Service API pour le système de pige radio
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pige.siraj-ai.com";

/**
 * Gère les erreurs de réponse HTTP
 */
const handleResponse = async (response: Response, endpoint: string) => {
  if (!response.ok) {
    let errorMessage = `Erreur ${response.status} sur ${endpoint}`;

    if (response.status === 404) {
      errorMessage = `⚠️ Endpoint introuvable (404): ${endpoint}\nVérifiez que le serveur API est démarré et accessible.`;
    } else if (response.status === 500) {
      errorMessage = `⚠️ Erreur serveur (500) sur ${endpoint}`;
    } else if (response.status === 0 || response.status >= 502) {
      errorMessage = `⚠️ Serveur inaccessible: ${API_BASE}\nVérifiez votre connexion et que le serveur est en ligne.`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

export interface StartRecordingParams {
  source: string | File;
  title: string;
  format: string;
  duration: number;
}

export interface StartRecordingResponse {
  success: boolean;
  job_id?: number;
  recording_id?: number;
  process_id?: number;
  output_path?: string;
  message?: string;
  warning?: string;
}

export interface ActiveJob {
  id: number;
  source: string;
  output: string;
  format: string;
  process_id: number;
  started_at?: string;
}

export interface Recording {
  id: number;
  title: string;
  duration_formatted: string;
  status: string;
  flagged_blank: boolean;
  blank_alerts_count: number;
  created_at: string;
  filename?: string;
  format?: string;
  has_summary?: boolean; // Indique si un résumé IA est disponible
  has_transcript?: boolean; // Indique si une transcription est disponible
}

export interface BlankAlert {
  start_time: number;
  end_time: number;
  duration: number;
  severity: string;
  is_natural?: boolean;
  ai_explanation?: string;
}

export interface RecordingDetails extends Recording {
  filepath?: string;
  bitrate?: string;
  sample_rate?: number;
  channels?: number;
  file_size?: number;
  blank_analysis?: {
    count: number;
    silences: Array<unknown>;
  };
  transcript?: string;
  summary?: string;
  keywords?: string[]; // Mots-clés extraits par l'IA
  ai_metadata?: unknown;
  owner?: unknown;
  updated_at?: string;
  expires_at?: string;
  is_expired?: boolean;
  tags?: string[];
  notes?: string;
  blank_alerts?: BlankAlert[];
}

export interface Statistics {
  total_recordings: number;
  by_status: {
    completed?: number;
    processing?: number;
    recording?: number;
    error?: number;
  };
  flagged_blanks: number;
  total_duration: number;
  avg_duration?: number;
  total_size: number;
}

/**
 * Démarre un nouvel enregistrement depuis une URL de stream
 * SANS upload de fichier - utilise uniquement des URLs
 */
export const startRecording = async (
  params: StartRecordingParams
): Promise<StartRecordingResponse> => {
  // Utiliser la route API locale Next.js (qui proxy vers le backend Django)
  const endpoint = "/api/recordings/upload";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: params.source, // URL du stream
      title: params.title,
      format: params.format,
      duration: params.duration,
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Erreur inconnue" }));
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }

  return response.json();
};

/**
 * Récupère la liste des jobs actifs
 */
export const fetchActiveJobs = async (): Promise<{
  count: number;
  jobs: ActiveJob[];
}> => {
  const endpoint = `${API_BASE}/api/recordings/jobs/active/`;

  try {
    console.log(`🔍 Récupération des jobs actifs depuis: ${endpoint}`);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Timeout de 10 secondes pour éviter les blocages
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(
        `❌ Erreur HTTP ${response.status}:`,
        text.substring(0, 200)
      );
      throw new Error(
        `Erreur HTTP ${response.status}: ${text.substring(0, 100)}`
      );
    }

    const data = await response.json();

    // Validation de la réponse
    if (!data || typeof data !== "object") {
      throw new Error("Réponse invalide du serveur");
    }

    console.log(`✅ Jobs actifs récupérés: ${data.count || 0}`, data.jobs);

    return {
      count: data.count || 0,
      jobs: Array.isArray(data.jobs) ? data.jobs : [],
    };
  } catch (error) {
    // Gérer les erreurs de timeout
    if (error instanceof Error && error.name === "TimeoutError") {
      console.error("⏱️ Timeout lors de la récupération des jobs actifs");
      throw new Error("Le serveur met trop de temps à répondre");
    }

    // Gérer les erreurs réseau
    if (error instanceof TypeError) {
      console.error("🌐 Erreur réseau:", error.message);
      throw new Error("Impossible de contacter le serveur");
    }

    // Autres erreurs
    console.error("❌ Erreur inattendue:", error);
    throw error;
  }
};

/**
 * Arrête un job en cours
 */
export const stopJob = async (
  jobId: number
): Promise<{ success: boolean; message?: string }> => {
  const response = await fetch(
    `${API_BASE}/api/recordings/jobs/${jobId}/stop/`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Erreur HTTP ${response.status}: ${text.substring(0, 100)}`
    );
  }

  return response.json();
};

/**
 * Supprime un job
 */
export const deleteJob = async (
  jobId: number
): Promise<{ success: boolean; message?: string }> => {
  const response = await fetch(`${API_BASE}/api/recordings/jobs/${jobId}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Erreur HTTP ${response.status}: ${text.substring(0, 100)}`
    );
  }

  return response.json();
};

/**
 * Nettoie tous les jobs obsolètes (processus terminés)
 */
export const cleanupJobs = async (): Promise<{
  success: boolean;
  updated_count?: number;
  message?: string;
}> => {
  const response = await fetch(`${API_BASE}/api/recordings/jobs/cleanup/`, {
    method: "POST",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Erreur HTTP ${response.status}: ${text.substring(0, 100)}`
    );
  }

  return response.json();
};

/**
 * Récupère la liste des enregistrements
 */
export const fetchRecordings = async (): Promise<{
  count: number;
  results: Recording[];
}> => {
  const response = await fetch(`${API_BASE}/api/archive/recordings/`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Erreur HTTP ${response.status}: ${text.substring(0, 100)}`
    );
  }

  return response.json();
};

/**
 * Récupère les détails d'un enregistrement
 */
export const fetchRecordingDetails = async (
  id: number
): Promise<RecordingDetails> => {
  const response = await fetch(`${API_BASE}/api/archive/recordings/${id}/`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Erreur HTTP ${response.status}: ${text.substring(0, 100)}`
    );
  }

  return response.json();
};

/**
 * Génère un résumé IA pour un enregistrement
 */
export const generateSummary = async (
  recordingId: number,
  maxSentences = 5
): Promise<{ success: boolean; summary?: string; message?: string }> => {
  // Utiliser la route API locale Next.js qui sert de proxy
  const endpoint = "/api/ai/summarize";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recording_id: recordingId,
      max_sentences: maxSentences,
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Erreur inconnue" }));
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }

  return response.json();
};

/**
 * Récupère les statistiques globales
 */
export const fetchStatistics = async (): Promise<Statistics> => {
  const response = await fetch(
    `${API_BASE}/api/archive/recordings/statistics/`
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Erreur HTTP ${response.status}: ${text.substring(0, 100)}`
    );
  }

  return response.json();
};

/**
 * Génère l'URL de téléchargement d'un enregistrement
 */
export const getDownloadUrl = (recordingId: number): string => {
  return `${API_BASE}/api/archive/recordings/${recordingId}/download/`;
};

/**
 * Transcrit un enregistrement audio en texte
 */
export const transcribeRecording = async (
  recordingId: number,
  language = "fr"
): Promise<{ success: boolean; transcript?: string; language?: string; message?: string }> => {
  const endpoint = "/api/ai/transcribe";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recording_id: recordingId,
      language,
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Erreur inconnue" }));
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }

  return response.json();
};

/**
 * Extrait les mots-clés d'un enregistrement
 */
export const extractKeywords = async (
  recordingId: number,
  maxKeywords = 10
): Promise<{ success: boolean; keywords?: string[]; message?: string }> => {
  const endpoint = "/api/ai/extract-keywords";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recording_id: recordingId,
      max_keywords: maxKeywords,
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Erreur inconnue" }));
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }

  return response.json();
};

/**
 * Récupère les informations sur les modèles IA disponibles
 */
export const getModelsInfo = async (): Promise<{
  success: boolean;
  whisper?: { available: boolean; message: string };
  mistral?: {
    model?: string;
    provider?: string;
    api_key_configured?: boolean;
    available?: boolean;
    message?: string;
  };
  message?: string;
}> => {
  const endpoint = "/api/ai/models-info";
  const response = await fetch(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Erreur inconnue" }));
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }

  return response.json();
};

/**
 * Traite complètement un enregistrement (transcription + résumé)
 */
export const processRecording = async (
  recordingId: number
): Promise<{
  success: boolean;
  transcript?: string;
  summary?: string;
  message?: string;
}> => {
  // D'abord transcrire
  const transcriptResult = await transcribeRecording(recordingId);
  
  if (!transcriptResult.success) {
    return {
      success: false,
      message: "❌ Échec de la transcription",
    };
  }

  // Puis générer le résumé
  const summaryResult = await generateSummary(recordingId);

  return {
    success: transcriptResult.success && summaryResult.success,
    transcript: transcriptResult.transcript,
    summary: summaryResult.summary,
    message: "✅ Enregistrement traité avec succès (transcription + résumé)",
  };
};

/**
 * Supprime un enregistrement
 */
export const deleteRecording = async (
  recordingId: number
): Promise<{ success: boolean; message?: string }> => {
  const endpoint = "/api/archive/delete";
  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recording_id: recordingId,
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Erreur inconnue" }));
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }

  return response.json();
};
