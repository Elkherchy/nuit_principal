/**
 * Détails d'un enregistrement
 */

"use client";

import { AlertCircle } from "lucide-react";
import type { RecordingDetails as RecordingDetailsType } from "@/services/pigeService";
import { formatBytes } from "@/lib/pigeFormatters";

interface RecordingDetailsProps {
  recording: RecordingDetailsType;
  onGenerateSummary: (id: number) => void;
}

export const RecordingDetails = ({
  recording,
  onGenerateSummary,
}: RecordingDetailsProps) => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-emerald-300 mb-4">
        Détails: {recording.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded">
          <p className="text-sm text-slate-400">Durée</p>
          <p className="text-xl font-semibold text-white">
            {recording.duration_formatted}
          </p>
        </div>
        <div className="bg-slate-800 p-4 rounded">
          <p className="text-sm text-slate-400">Format</p>
          <p className="text-xl font-semibold text-white">
            {recording.format?.toUpperCase()}
          </p>
        </div>
        <div className="bg-slate-800 p-4 rounded">
          <p className="text-sm text-slate-400">Taille</p>
          <p className="text-xl font-semibold text-white">
            {recording.file_size ? formatBytes(recording.file_size) : "N/A"}
          </p>
        </div>
      </div>

      {recording.transcript && (
        <div className="bg-slate-800 p-4 rounded mb-4">
          <h3 className="font-semibold text-emerald-300 mb-2">Transcription</h3>
          <p className="text-sm text-slate-300 whitespace-pre-wrap">
            {recording.transcript}
          </p>
        </div>
      )}

      {recording.summary && (
        <div className="bg-slate-800 p-4 rounded mb-4">
          <h3 className="font-semibold text-emerald-300 mb-2">Résumé IA</h3>
          <p className="text-sm text-slate-300 whitespace-pre-wrap">
            {recording.summary}
          </p>
        </div>
      )}

      {!recording.summary && recording.status === "completed" && (
        <button
          onClick={() => onGenerateSummary(recording.id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded mb-4"
        >
          Générer un résumé IA
        </button>
      )}

      {recording.blank_alerts && recording.blank_alerts.length > 0 && (
        <div className="bg-red-900/20 border border-red-700 p-4 rounded">
          <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Alertes de blancs ({recording.blank_alerts.length})
          </h3>
          <div className="space-y-2">
            {recording.blank_alerts.map((alert, idx) => (
              <div key={idx} className="bg-slate-800 p-3 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-white">
                      {alert.start_time.toFixed(1)}s → {alert.end_time.toFixed(1)}s
                      <span className="ml-2 text-yellow-400">
                        ({alert.duration.toFixed(1)}s)
                      </span>
                    </p>
                    {alert.ai_explanation && (
                      <p className="text-xs text-slate-400 mt-1">
                        {alert.ai_explanation}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      alert.severity === "critical" ? "bg-red-600" : "bg-yellow-600"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

