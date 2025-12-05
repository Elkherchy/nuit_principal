/**
 * Liste des jobs actifs
 */

"use client";

import { useState } from "react";
import { TrendingUp, AlertCircle, X, StopCircle, Trash2, RefreshCw } from "lucide-react";
import type { ActiveJob } from "@/services/pigeService";

interface ActiveJobsListProps {
  jobs: ActiveJob[];
  error?: boolean;
  errorMessage?: string;
  onStopJob?: (jobId: number) => Promise<{ success: boolean; message?: string }>;
  onDeleteJob?: (jobId: number) => Promise<{ success: boolean; message?: string }>;
  onCleanupJobs?: () => Promise<{ success: boolean; updated_count?: number; message?: string }>;
}

export const ActiveJobsList = ({ 
  jobs, 
  error, 
  errorMessage,
  onStopJob,
  onDeleteJob,
  onCleanupJobs
}: ActiveJobsListProps) => {
  const [hiddenJobs, setHiddenJobs] = useState<number[]>([]);
  const [loadingJobs, setLoadingJobs] = useState<number[]>([]);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const hideJob = (jobId: number) => {
    setHiddenJobs((prev) => [...prev, jobId]);
  };

  const handleStopJob = async (jobId: number) => {
    if (!onStopJob) return;
    setLoadingJobs((prev) => [...prev, jobId]);
    try {
      await onStopJob(jobId);
    } finally {
      setLoadingJobs((prev) => prev.filter((id) => id !== jobId));
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!onDeleteJob) return;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le job #${jobId} ?`)) return;
    setLoadingJobs((prev) => [...prev, jobId]);
    try {
      await onDeleteJob(jobId);
    } finally {
      setLoadingJobs((prev) => prev.filter((id) => id !== jobId));
    }
  };

  const handleCleanupJobs = async () => {
    if (!onCleanupJobs) return;
    setIsCleaningUp(true);
    try {
      await onCleanupJobs();
    } finally {
      setIsCleaningUp(false);
    }
  };

  const visibleJobs = jobs.filter((job) => !hiddenJobs.includes(job.id));
  
  // Si erreur backend, afficher un message informatif
  if (error && visibleJobs.length === 0 && jobs.length === 0) {
    return (
      <div className="bg-slate-900 border border-orange-700 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-orange-300 mb-4 flex items-center gap-2">
          <AlertCircle className="h-6 w-6" />
          Jobs actifs - Backend inaccessible
        </h2>
        <p className="text-slate-400 text-sm">
          {errorMessage || "Impossible de récupérer les jobs actifs. Le serveur backend n'est pas accessible."}
        </p>
        <p className="text-slate-500 text-xs mt-2">
          💡 Vérifiez que le serveur backend Django est démarré et accessible.
        </p>
      </div>
    );
  }

  // Si pas de jobs visibles, ne rien afficher
  if (visibleJobs.length === 0 && hiddenJobs.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-emerald-300 flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Jobs actifs ({visibleJobs.length})
        </h2>
        <div className="flex items-center gap-2">
          {hiddenJobs.length > 0 && (
            <button
              onClick={() => setHiddenJobs([])}
              className="text-xs text-slate-400 hover:text-slate-300 underline"
            >
              Afficher {hiddenJobs.length} masqué(s)
            </button>
          )}
          {onCleanupJobs && visibleJobs.length > 0 && (
            <button
              onClick={handleCleanupJobs}
              disabled={isCleaningUp}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Nettoyer tous les jobs terminés"
            >
              <RefreshCw className={`h-4 w-4 ${isCleaningUp ? 'animate-spin' : ''}`} />
              {isCleaningUp ? 'Nettoyage...' : 'Nettoyer'}
            </button>
          )}
        </div>
      </div>

      {visibleJobs.length === 0 ? (
        <p className="text-slate-400 text-sm">
          Tous les jobs sont masqués. Cliquez sur "Afficher les jobs masqués" pour les voir à nouveau.
        </p>
      ) : (
        <div className="space-y-3">
          {visibleJobs.map((job) => {
            const isLoading = loadingJobs.includes(job.id);
            return (
              <div
                key={job.id}
                className="bg-slate-800 p-4 rounded border border-slate-600 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-white flex items-center gap-2">
                      Job #{job.id}
                      <span className="text-xs px-2 py-0.5 bg-emerald-600 rounded-full">
                        {job.format.toUpperCase()}
                      </span>
                    </p>
                    <p className="text-sm text-slate-400 mt-1">{job.output}</p>
                    <div className="flex gap-3 text-xs text-slate-500 mt-1">
                      <span>🔢 PID: {job.process_id}</span>
                      {job.started_at && (
                        <span>
                          🕐 Démarré: {new Date(job.started_at).toLocaleTimeString("fr-FR")}
                        </span>
                      )}
                    </div>
                    {job.source && (
                      <p className="text-xs text-slate-600 mt-1 truncate" title={job.source}>
                        📡 Source: {job.source}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse flex items-center gap-2 text-emerald-400">
                      <div className="h-3 w-3 bg-emerald-400 rounded-full"></div>
                      {isLoading ? "Traitement..." : "En cours..."}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {onStopJob && (
                        <button
                          onClick={() => handleStopJob(job.id)}
                          disabled={isLoading}
                          className="p-1 hover:bg-orange-900 rounded text-orange-400 hover:text-orange-300 disabled:opacity-50"
                          title="Arrêter ce job"
                        >
                          <StopCircle className="h-4 w-4" />
                        </button>
                      )}
                      {onDeleteJob && (
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          disabled={isLoading}
                          className="p-1 hover:bg-red-900 rounded text-red-400 hover:text-red-300 disabled:opacity-50"
                          title="Supprimer ce job"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => hideJob(job.id)}
                        disabled={isLoading}
                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-300 disabled:opacity-50"
                        title="Masquer ce job"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {visibleJobs.length > 0 && (
        <div className="text-xs text-slate-500 mt-3 space-y-1">
          <p>💡 Astuce: Survolez un job pour voir les actions disponibles</p>
          {(onStopJob || onDeleteJob || onCleanupJobs) && (
            <p className="flex items-center gap-2 flex-wrap">
              {onStopJob && <span>🟠 Arrêter</span>}
              {onDeleteJob && <span>🔴 Supprimer</span>}
              <span>⚪ Masquer</span>
              {onCleanupJobs && <span>🔵 Nettoyer les jobs terminés</span>}
            </p>
          )}
          {onCleanupJobs && (
            <p className="text-blue-400">
              ℹ️ Le nettoyage automatique vérifie l&apos;état réel des processus (PIDs) et met à jour les jobs terminés.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

