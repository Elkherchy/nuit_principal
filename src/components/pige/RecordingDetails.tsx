/**
 * Détails d'un enregistrement
 */

"use client";

import { useState } from "react";
import { AlertCircle, Sparkles, Loader2, RefreshCw } from "lucide-react";
import type { RecordingDetails as RecordingDetailsType } from "@/services/pigeService";
import { formatBytes } from "@/lib/pigeFormatters";

interface RecordingDetailsProps {
  recording: RecordingDetailsType;
  onGenerateSummary: (id: number) => Promise<{ success: boolean; summary?: string; message?: string }>;
}

export const RecordingDetails = ({
  recording,
  onGenerateSummary,
}: RecordingDetailsProps) => {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      await onGenerateSummary(recording.id);
    } finally {
      // Attendre un peu avant de désactiver le loader pour un meilleur feedback
      setTimeout(() => setIsGeneratingSummary(false), 500);
    }
  };

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

      {/* Section Transcription */}
      {recording.transcript && (
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-emerald-300 text-lg">📝 Transcription complète</h3>
            {recording.transcript.length > 500 && (
              <span className="text-xs text-slate-500 px-2 py-1 bg-slate-700 rounded">
                {recording.transcript.length} caractères
              </span>
            )}
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg max-h-96 overflow-y-auto custom-scrollbar">
            <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {recording.transcript}
            </p>
          </div>
          {recording.transcript.length > 1000 && (
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Texte long - utilisez la molette pour faire défiler
            </p>
          )}
        </div>
      )}

      {/* Section Résumé IA */}
      {recording.summary && (
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/50 p-6 rounded-lg mb-4 relative overflow-hidden">
          {/* Badge AI */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-blue-600/80 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            <span>AI</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <h3 className="font-semibold text-blue-300 text-lg">Résumé IA</h3>
          </div>

          {/* Afficher le résumé ou la transcription si trop court */}
          <div className="bg-slate-900/50 p-4 rounded-lg mb-3 backdrop-blur-sm max-h-96 overflow-y-auto custom-scrollbar">
            {recording.summary.toLowerCase().includes("trop court") || 
             recording.summary.toLowerCase().includes("insufficient") ? (
              /* Si trop court, afficher la transcription comme résumé */
              recording.transcript ? (
                <div>
                  <p className="text-slate-200 leading-relaxed italic">
                    &quot;{recording.transcript}&quot;
                  </p>
                  <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-700">
                    📝 Texte court ({recording.transcript.length} caractères)
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 italic text-sm">
                  Aucun contenu disponible pour générer un résumé.
                </p>
              )
            ) : (
              /* Résumé normal */
              <div>
                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {recording.summary}
                </p>
                {recording.summary.length > 500 && (
                  <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-700">
                    📊 Longueur: {recording.summary.length} caractères
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bouton de régénération */}
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingSummary ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Régénération en cours...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Régénérer le résumé</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Bouton pour générer le résumé initial */}
      {!recording.summary && recording.transcript && recording.status === "completed" && (
        <button
          type="button"
          onClick={handleGenerateSummary}
          disabled={isGeneratingSummary}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-lg mb-4 flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-blue-500/50"
        >
          {isGeneratingSummary ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Génération du résumé IA en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Générer un résumé IA</span>
            </>
          )}
        </button>
      )}

      {/* Message si pas de transcription disponible */}
      {!recording.summary && !recording.transcript && recording.status === "completed" && (
        <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg mb-4">
          <p className="text-yellow-400 text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Aucune transcription disponible. Le résumé IA nécessite d'abord une transcription de l'enregistrement.</span>
          </p>
        </div>
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

