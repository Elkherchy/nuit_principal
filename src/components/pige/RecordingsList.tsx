/**
 * Liste des enregistrements
 */

"use client";

import { FileAudio, CheckCircle, AlertCircle, Download } from "lucide-react";
import type { Recording } from "@/services/pigeService";
import { getDownloadUrl } from "@/services/pigeService";

interface RecordingsListProps {
  recordings: Recording[];
  onSelectRecording: (id: number) => void;
}

export const RecordingsList = ({
  recordings,
  onSelectRecording,
}: RecordingsListProps) => {
  if (recordings.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-emerald-300 mb-4 flex items-center gap-2">
        <FileAudio className="h-6 w-6" />
        Enregistrements ({recordings.length})
      </h2>
      <div className="space-y-3">
        {recordings.map((rec) => (
          <div
            key={rec.id}
            className="bg-slate-800 p-4 rounded border border-slate-600 cursor-pointer hover:bg-slate-750"
            onClick={() => onSelectRecording(rec.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{rec.title}</h3>
                  {rec.status === "completed" && (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  )}
                  {rec.flagged_blank && (
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
                <div className="flex gap-4 text-sm text-slate-400 mt-1">
                  <span>Durée: {rec.duration_formatted}</span>
                  <span>Status: {rec.status}</span>
                  {rec.blank_alerts_count > 0 && (
                    <span className="text-yellow-400">
                      {rec.blank_alerts_count} alerte(s) de blanc
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(rec.created_at).toLocaleString("fr-FR")}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={getDownloadUrl(rec.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

