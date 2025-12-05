/**
 * Hook pour gérer les enregistrements de pige
 */

import { useState, useRef, useEffect } from "react";
import {
  startRecording as startRecordingService,
  fetchActiveJobs as fetchActiveJobsService,
  fetchRecordings as fetchRecordingsService,
  fetchRecordingDetails as fetchRecordingDetailsService,
  generateSummary as generateSummaryService,
  stopJob as stopJobService,
  deleteJob as deleteJobService,
  cleanupJobs as cleanupJobsService,
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
  const [backendError, setBackendError] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false); // Désactivé par défaut pour ne pas surcharger
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
        // Différencier le message selon si le backend a répondu ou non
        if (data.job_id) {
          setMessage(`✅ Enregistrement démarré ! Job ID: ${data.job_id}`);
        } else if (data.mongo_file_id) {
          setMessage(
            `✅ Fichier sauvegardé dans MongoDB ! ID: ${data.mongo_file_id}`
          );
        } else {
          setMessage(`✅ Fichier uploadé avec succès !`);
        }

        // ✨ IMPORTANT: Rafraîchir immédiatement les jobs actifs
        // Si un job_id est retourné, c'est un job backend qu'on doit tracker
        if (data.job_id) {
          // Rafraîchir immédiatement
          await fetchActiveJobs();
          
          // Puis rafraîchir périodiquement pendant 10 secondes pour être sûr de voir le job
          let refreshCount = 0;
          const maxRefresh = 5;
          const refreshInterval = setInterval(async () => {
            refreshCount++;
            await fetchActiveJobs();
            if (refreshCount >= maxRefresh) {
              clearInterval(refreshInterval);
            }
          }, 2000); // Toutes les 2 secondes pendant 10 secondes
        }

        // Rafraîchir la liste des enregistrements après un délai
        setTimeout(() => {
          fetchRecordings();
        }, 2000);
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
      
      // Vérifier que la réponse est valide
      if (!data || typeof data !== 'object') {
        throw new Error("Réponse invalide du serveur");
      }

      setActiveJobs(data.jobs || []);
      setBackendError(false);
      
      // Effacer le message d'erreur si la requête réussit
      if (message.includes("Backend inaccessible") || message.includes("Jobs actifs ne peuvent pas")) {
        setMessage("");
      }
      
      // Log pour debug
      console.log(`✅ Jobs actifs récupérés: ${data.count || 0} job(s)`, data.jobs);
      
      return data;
    } catch (error) {
      console.error("❌ Erreur fetch jobs:", error);
      
      // Ne vider les jobs que si on a vraiment une erreur réseau
      // Cela évite de perdre l'affichage en cas d'erreur temporaire
      const isNetworkError = error instanceof TypeError && 
                            (error.message.includes("fetch") || error.message.includes("network"));
      
      if (isNetworkError) {
        setActiveJobs([]);
        setBackendError(true);
        
        // N'afficher le message que si on n'en a pas déjà un
        if (!message || message.includes("✅")) {
          setMessage(
            "⚠️ Impossible de contacter le serveur backend. Les jobs actifs ne peuvent pas être récupérés."
          );
        }
      }
      
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
   * Arrête un job en cours
   */
  const stopJob = async (jobId: number) => {
    try {
      const data = await stopJobService(jobId);
      if (data.success) {
        setMessage(`✅ Job #${jobId} arrêté avec succès !`);
        // Rafraîchir la liste des jobs
        await fetchActiveJobs();
      } else {
        setMessage(`❌ Erreur: ${data.message || "Échec de l'arrêt"}`);
      }
      return data;
    } catch (error) {
      const errorMessage = `❌ Erreur arrêt du job: ${error}`;
      setMessage(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Supprime un job
   */
  const deleteJob = async (jobId: number) => {
    try {
      const data = await deleteJobService(jobId);
      if (data.success) {
        setMessage(`✅ Job #${jobId} supprimé avec succès !`);
        // Rafraîchir la liste des jobs
        await fetchActiveJobs();
      } else {
        setMessage(`❌ Erreur: ${data.message || "Échec de la suppression"}`);
      }
      return data;
    } catch (error) {
      const errorMessage = `❌ Erreur suppression du job: ${error}`;
      setMessage(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Nettoie tous les jobs obsolètes
   */
  const cleanupJobs = async () => {
    setLoading(true);
    try {
      const data = await cleanupJobsService();
      if (data.success) {
        setMessage(`✅ ${data.updated_count || 0} job(s) nettoyé(s) avec succès !`);
        // Rafraîchir la liste des jobs
        await fetchActiveJobs();
        await fetchRecordings();
      } else {
        setMessage(`❌ Erreur: ${data.message || "Échec du nettoyage"}`);
      }
      return data;
    } catch (error) {
      const errorMessage = `❌ Erreur nettoyage des jobs: ${error}`;
      setMessage(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Réinitialise le message
   */
  const clearMessage = () => setMessage("");

  /**
   * Active/désactive le rafraîchissement automatique
   */
  const toggleAutoRefresh = () => setAutoRefresh((prev) => !prev);

  /**
   * Rafraîchissement automatique des jobs et enregistrements
   * Polling toutes les 15 secondes si autoRefresh est activé
   */
  useEffect(() => {
    if (!autoRefresh) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Faire un premier fetch immédiatement
    fetchActiveJobs();
    fetchRecordings();

    // Puis configurer le polling (5 secondes pour détecter rapidement les jobs terminés)
    pollingIntervalRef.current = setInterval(() => {
      fetchActiveJobs(); // Mise à jour automatique des jobs (le backend vérifie les PIDs)
      fetchRecordings(); // Rafraîchir les enregistrements pour voir les nouveaux
    }, 5000); // Toutes les 5 secondes

    // Cleanup
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh]); // Relancer si autoRefresh change

  return {
    // État
    loading,
    message,
    activeJobs,
    recordings,
    selectedRecording,
    backendError,
    autoRefresh,

    // Actions
    startRecording,
    fetchActiveJobs,
    fetchRecordings,
    fetchRecordingDetails,
    generateSummary,
    stopJob,
    deleteJob,
    cleanupJobs,
    clearMessage,
    setSelectedRecording,
    toggleAutoRefresh,
  };
};
