"use client";

import { useEffect } from "react";
import { Radio, Square, FileAudio, TrendingUp, RefreshCw } from "lucide-react";
import { usePigeRecordings } from "@/hooks/usePigeRecordings";
import { usePigeStatistics } from "@/hooks/usePigeStatistics";
import { RecordingForm } from "@/components/pige/RecordingForm";
import { ActiveJobsList } from "@/components/pige/ActiveJobsList";
import { RecordingsList } from "@/components/pige/RecordingsList";
import { RecordingDetails } from "@/components/pige/RecordingDetails";
import { StatisticsPanel } from "@/components/pige/StatisticsPanel";

export default function PigePage() {
  const {
    loading,
    message,
    activeJobs,
    recordings,
    selectedRecording,
    backendError,
    autoRefresh,
    startRecording,
    fetchActiveJobs,
    fetchRecordings,
    fetchRecordingDetails,
    generateSummary,
    stopJob,
    deleteJob,
    cleanupJobs,
    toggleAutoRefresh,
  } = usePigeRecordings();

  const { statistics, fetchStatistics } = usePigeStatistics();

  // Charger les données au démarrage
  useEffect(() => {
    fetchActiveJobs();
    fetchRecordings();
    fetchStatistics();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Radio className="h-12 w-12 text-emerald-400" />
          <h1 className="text-4xl font-bold text-emerald-300">
            Système de Pige Radio
          </h1>
        </div>
        <p className="text-lg text-slate-300 max-w-3xl mx-auto">
          Enregistrement audio intelligent avec détection automatique de blancs et
          analyse IA
        </p>
      </div>

      {/* Indicateur de rafraîchissement automatique */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleAutoRefresh();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
            autoRefresh
              ? "bg-emerald-900 border-emerald-600 text-emerald-300 hover:bg-emerald-800"
              : "bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700"
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`} />
          {autoRefresh ? "Rafraîchissement auto activé (5s)" : "Rafraîchissement auto désactivé"}
        </button>
        <p className="text-slate-500 text-sm">
          💡 Désactivez le rafraîchissement si le backend est lent
        </p>
      </div>

      {/* Formulaire d'enregistrement */}
      <RecordingForm
        onSubmit={startRecording}
        loading={loading}
        message={message}
      />

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            fetchActiveJobs();
          }}
          className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-white font-semibold py-3 px-4 rounded flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105"
        >
          <Square className="h-5 w-5" />
          Jobs actifs
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            fetchRecordings();
          }}
          className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-white font-semibold py-3 px-4 rounded flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105"
        >
          <FileAudio className="h-5 w-5" />
          Enregistrements
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            fetchStatistics();
          }}
          className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-white font-semibold py-3 px-4 rounded flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105"
        >
          <TrendingUp className="h-5 w-5" />
          Statistiques
        </button>
      </div>

      {/* Jobs actifs */}
      <ActiveJobsList 
        jobs={activeJobs} 
        error={backendError}
        errorMessage={backendError ? "Le serveur backend n'est pas accessible. Les fichiers uploadés restent sauvegardés dans MongoDB." : undefined}
        onStopJob={stopJob}
        onDeleteJob={deleteJob}
        onCleanupJobs={cleanupJobs}
      />

      {/* Liste des enregistrements */}
      <RecordingsList
        recordings={recordings}
        onSelectRecording={fetchRecordingDetails}
      />

      {/* Détails de l'enregistrement sélectionné */}
      {selectedRecording && (
        <RecordingDetails
          recording={selectedRecording}
          onGenerateSummary={generateSummary}
        />
      )}

      {/* Statistiques */}
      <StatisticsPanel statistics={statistics} />
    </div>
  );
}
