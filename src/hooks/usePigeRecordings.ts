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
        // Différencier le message selon la réponse du backend
        if (data.job_id) {
          setMessage(`✅ Enregistrement démarré ! Job ID: ${data.job_id}`);
        } else if (data.recording_id) {
          setMessage(`✅ Enregistrement créé ! ID: ${data.recording_id}`);
        } else {
          setMessage(`✅ Enregistrement démarré avec succès !`);
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

        // 🔄 Rafraîchissement automatique agressif après upload
        // Essayer de récupérer le nouvel enregistrement plusieurs fois
        let attemptCount = 0;
        const maxAttempts = 10; // Essayer pendant 30 secondes
        const attemptInterval = 3000; // Toutes les 3 secondes
        
        const refreshAndSelect = async () => {
          attemptCount++;
          console.log(`🔍 Tentative ${attemptCount}/${maxAttempts} de récupération de l'enregistrement...`);
          
          const recordingsData = await fetchRecordings();
          
          // Si on a un recording_id du backend, le sélectionner
          if (data.recording_id) {
            console.log(`✅ Recording ID trouvé: ${data.recording_id}`);
            await fetchRecordingDetails(data.recording_id);
            return true; // Succès
          }
          
          // Sinon, chercher le dernier enregistrement qui correspond au titre
          if (recordingsData && recordingsData.results && recordingsData.results.length > 0) {
            // Chercher un enregistrement avec le même titre créé récemment
            const recentRecording = recordingsData.results.find(
              (rec) => rec.title === params.title
            ) || recordingsData.results[0]; // Fallback au plus récent
            
            if (recentRecording) {
              console.log(`✅ Enregistrement trouvé: ${recentRecording.title} (ID: ${recentRecording.id})`);
              await fetchRecordingDetails(recentRecording.id);
              return true; // Succès
            }
          }
          
          return false; // Pas encore trouvé
        };
        
        // Première tentative immédiate
        setTimeout(async () => {
          const found = await refreshAndSelect();
          
          // Si pas trouvé, continuer à essayer
          if (!found && attemptCount < maxAttempts) {
            const retryInterval = setInterval(async () => {
              const success = await refreshAndSelect();
              
              // Arrêter si trouvé ou si max tentatives atteint
              if (success || attemptCount >= maxAttempts) {
                clearInterval(retryInterval);
                if (!success) {
                  console.warn(`⚠️ Impossible de trouver l'enregistrement après ${maxAttempts} tentatives`);
                  setMessage(`⚠️ Enregistrement sauvegardé mais non visible. Rafraîchissez la page.`);
                }
              }
            }, attemptInterval);
          }
        }, 2000); // Première tentative après 2 secondes
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
   * Avec génération automatique du résumé IA si nécessaire
   */
  const fetchRecordingDetails = async (id: number, autoGenerateSummary = true) => {
    try {
      const data = await fetchRecordingDetailsService(id);
      setSelectedRecording(data);
      
      // ✨ GÉNÉRATION AUTOMATIQUE DU RÉSUMÉ
      // Si l'enregistrement a une transcription mais pas de résumé, générer automatiquement
      if (autoGenerateSummary && data.status === "completed" && data.transcript && !data.summary) {
        console.log(`✨ Génération automatique du résumé pour l'enregistrement ${id}...`);
        
        // Générer le résumé automatiquement
        setTimeout(async () => {
          try {
            const summaryResult = await generateSummaryService(id, 5); // 5 phrases max
            
            if (summaryResult.success) {
              console.log(`✅ Résumé généré automatiquement !`);
              setMessage("✅ Résumé IA généré automatiquement !");
              
              // Rafraîchir les détails pour afficher le résumé
              const updatedData = await fetchRecordingDetailsService(id);
              setSelectedRecording(updatedData);
            } else {
              console.warn(`⚠️ Échec de la génération automatique:`, summaryResult.message);
            }
          } catch (error) {
            console.error("❌ Erreur génération automatique:", error);
          }
        }, 1000); // Attendre 1 seconde avant de générer
      }
      
      // 🔄 Si l'enregistrement n'a ni transcription ni résumé
      // Rafraîchir automatiquement pour attendre le traitement backend
      if (autoGenerateSummary && data.status === "completed") {
        const needsProcessing = !data.transcript && !data.summary;
        
        if (needsProcessing) {
          console.log(`🔄 Enregistrement ${id} en attente de traitement backend...`);
          
          let refreshAttempts = 0;
          const maxRefreshAttempts = 6; // 6 * 5s = 30 secondes
          
          const refreshInterval = setInterval(async () => {
            refreshAttempts++;
            console.log(`🔄 Tentative ${refreshAttempts}/${maxRefreshAttempts} de rafraîchissement...`);
            
            try {
              const updatedData = await fetchRecordingDetailsService(id);
              setSelectedRecording(updatedData);
              
              // Si on a maintenant la transcription, arrêter et générer le résumé
              if (updatedData.transcript) {
                console.log(`✅ Transcription récupérée ! Génération du résumé...`);
                clearInterval(refreshInterval);
                
                // Générer le résumé automatiquement
                try {
                  const summaryResult = await generateSummaryService(id, 5);
                  if (summaryResult.success) {
                    const finalData = await fetchRecordingDetailsService(id);
                    setSelectedRecording(finalData);
                    setMessage("✅ Analyse IA complète générée automatiquement !");
                  }
                } catch (error) {
                  console.error("Erreur génération résumé:", error);
                }
              }
              
              // Arrêter après max tentatives
              if (refreshAttempts >= maxRefreshAttempts) {
                console.log(`⏸️ Arrêt du rafraîchissement après ${maxRefreshAttempts} tentatives`);
                clearInterval(refreshInterval);
              }
            } catch (error) {
              console.error("Erreur lors du rafraîchissement:", error);
              clearInterval(refreshInterval);
            }
          }, 5000); // Toutes les 5 secondes
        }
      }
      
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
   * Supprime un enregistrement
   */
  const deleteRecording = async (recordingId: number) => {
    setLoading(true);
    try {
      const { deleteRecording: deleteRecordingService } = await import("@/services/pigeService");
      const data = await deleteRecordingService(recordingId);
      
      if (data.success) {
        setMessage(`✅ Enregistrement #${recordingId} supprimé avec succès !`);
        // Rafraîchir la liste et effacer la sélection si c'est l'enregistrement actuel
        if (selectedRecording?.id === recordingId) {
          setSelectedRecording(null);
        }
        await fetchRecordings();
      } else {
        setMessage(`❌ Erreur: ${data.message || "Échec de la suppression"}`);
      }
      return data;
    } catch (error) {
      const errorMessage = `❌ Erreur suppression: ${error}`;
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
    deleteRecording,
    stopJob,
    deleteJob,
    cleanupJobs,
    clearMessage,
    setSelectedRecording,
    toggleAutoRefresh,
  };
};
