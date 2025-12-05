/**
 * Hook pour gérer les enregistrements de pige
 */

import { useState } from "react";
import {
  startRecording as startRecordingService,
  fetchActiveJobs as fetchActiveJobsService,
  fetchRecordings as fetchRecordingsService,
  fetchRecordingDetails as fetchRecordingDetailsService,
  generateSummary as generateSummaryService,
  type StartRecordingParams,
  type ActiveJob,
  type Recording,
  type RecordingDetails,
} from "@/services/pigeService";

export const usePigeRecordings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedRecording, setSelectedRecording] =
    useState<RecordingDetails | null>(null);

  /**
   * Démarre un nouvel enregistrement
   */
  const startRecording = async (params: StartRecordingParams) => {
    if (!params.title.trim()) {
      setMessage("⚠️ Veuillez entrer un titre pour l'enregistrement");
      return { success: false };
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await startRecordingService(params);

      if (data.success) {
        setMessage(`✅ Enregistrement démarré ! Job ID: ${data.job_id}`);
        // Actualiser les jobs et enregistrements
        setTimeout(() => {
          fetchActiveJobs();
          fetchRecordings();
        }, 1000);
      } else {
        setMessage(`❌ Erreur: ${data.message || "Échec du démarrage"}`);
      }

      return data;
    } catch (error) {
      const errorMessage = `❌ Erreur de connexion: ${error}`;
      setMessage(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère les jobs actifs
   */
  const fetchActiveJobs = async () => {
    try {
      const data = await fetchActiveJobsService();
      setActiveJobs(data.jobs || []);
      return data;
    } catch (error) {
      console.error("Erreur fetch jobs:", error);
      return { count: 0, jobs: [] };
    }
  };

  /**
   * Récupère la liste des enregistrements
   */
  const fetchRecordings = async () => {
    try {
      const data = await fetchRecordingsService();
      setRecordings(data.results || []);
      return data;
    } catch (error) {
      console.error("Erreur fetch recordings:", error);
      return { count: 0, results: [] };
    }
  };

  /**
   * Récupère les détails d'un enregistrement
   */
  const fetchRecordingDetails = async (id: number) => {
    try {
      const data = await fetchRecordingDetailsService(id);
      setSelectedRecording(data);
      return data;
    } catch (error) {
      console.error("Erreur fetch details:", error);
      return null;
    }
  };

  /**
   * Génère un résumé IA
   */
  const generateSummary = async (recordingId: number) => {
    try {
      const data = await generateSummaryService(recordingId);
      if (data.success) {
        setMessage("✅ Résumé généré avec succès !");
        await fetchRecordingDetails(recordingId);
      } else {
        setMessage(`❌ Erreur: ${data.message || "Échec de la génération"}`);
      }
      return data;
    } catch (error) {
      const errorMessage = `❌ Erreur génération résumé: ${error}`;
      setMessage(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Réinitialise le message
   */
  const clearMessage = () => setMessage("");

  return {
    // État
    loading,
    message,
    activeJobs,
    recordings,
    selectedRecording,

    // Actions
    startRecording,
    fetchActiveJobs,
    fetchRecordings,
    fetchRecordingDetails,
    generateSummary,
    clearMessage,
    setSelectedRecording,
  };
};

