/**
 * Service API pour le système de pige radio
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1";

export interface StartRecordingParams {
  source: string;
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
 * Démarre un nouvel enregistrement
 */
export const startRecording = async (
  params: StartRecordingParams
): Promise<StartRecordingResponse> => {
  const response = await fetch(`${API_BASE}/api/recordings/jobs/start/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  return response.json();
};

/**
 * Récupère la liste des jobs actifs
 */
export const fetchActiveJobs = async (): Promise<{
  count: number;
  jobs: ActiveJob[];
}> => {
  const response = await fetch(`${API_BASE}/api/recordings/jobs/active/`);
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
  return response.json();
};

/**
 * Récupère les détails d'un enregistrement
 */
export const fetchRecordingDetails = async (
  id: number
): Promise<RecordingDetails> => {
  const response = await fetch(`${API_BASE}/api/archive/recordings/${id}/`);
  return response.json();
};

/**
 * Génère un résumé IA pour un enregistrement
 */
export const generateSummary = async (
  recordingId: number,
  maxSentences = 5
): Promise<{ success: boolean; summary?: string; message?: string }> => {
  const response = await fetch(`${API_BASE}/api/ai/summarize/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recording_id: recordingId, max_sentences: maxSentences }),
  });

  return response.json();
};

/**
 * Récupère les statistiques globales
 */
export const fetchStatistics = async (): Promise<Statistics> => {
  const response = await fetch(`${API_BASE}/api/archive/recordings/statistics/`);
  return response.json();
};

/**
 * Génère l'URL de téléchargement d'un enregistrement
 */
export const getDownloadUrl = (recordingId: number): string => {
  return `${API_BASE}/api/archive/recordings/${recordingId}/download/`;
};

