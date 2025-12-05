"use client";

import { Radio, Square, FileAudio, TrendingUp } from "lucide-react";
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
    startRecording,
    fetchActiveJobs,
    fetchRecordings,
    fetchRecordingDetails,
    generateSummary,
  } = usePigeRecordings();

  const { statistics, fetchStatistics } = usePigeStatistics();

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

      {/* Formulaire d'enregistrement */}
      <RecordingForm
        onSubmit={startRecording}
        loading={loading}
        message={message}
      />

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={fetchActiveJobs}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold py-3 px-4 rounded flex items-center justify-center gap-2"
        >
          <Square className="h-5 w-5" />
          Jobs actifs
        </button>

        <button
          onClick={fetchRecordings}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold py-3 px-4 rounded flex items-center justify-center gap-2"
        >
          <FileAudio className="h-5 w-5" />
          Enregistrements
        </button>

        <button
          onClick={fetchStatistics}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold py-3 px-4 rounded flex items-center justify-center gap-2"
        >
          <TrendingUp className="h-5 w-5" />
          Statistiques
        </button>
      </div>

      {/* Jobs actifs */}
      <ActiveJobsList jobs={activeJobs} />

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
      {statistics && <StatisticsPanel statistics={statistics} />}
    </div>
  );
}
