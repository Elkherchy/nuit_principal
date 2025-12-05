/**
 * Formulaire pour démarrer un enregistrement depuis une URL de stream
 */

"use client";

import { useState } from "react";
import { Play, Radio } from "lucide-react";
import type { StartRecordingParams, StartRecordingResponse } from "@/services/pigeService";

interface RecordingFormProps {
  onSubmit: (params: StartRecordingParams) => Promise<StartRecordingResponse>;
  loading: boolean;
  message: string;
}

export const RecordingForm = ({ onSubmit, loading, message }: RecordingFormProps) => {
  const [streamUrl, setStreamUrl] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [format, setFormat] = useState("mp3");

  const handleSubmit = async () => {
    if (!streamUrl) {
      alert("Veuillez entrer une URL de stream radio");
      return;
    }

    if (!title) {
      alert("Veuillez entrer un titre pour l'enregistrement");
      return;
    }

    await onSubmit({
      source: streamUrl, // URL au lieu de File
      title,
      format,
      duration,
    });
    
    // Réinitialiser uniquement le titre et la durée
    setTitle("");
    setDuration(30);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-emerald-300 flex items-center gap-2">
        <Radio className="h-6 w-6" />
        Enregistrer un Stream Radio
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            URL du Stream Radio <span className="text-red-400">*</span>
          </label>
          <input
            type="url"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Ex: https://icecast.radiofrance.fr/franceinter-midfi.mp"
          />
          <p className="text-xs text-slate-500 mt-1">
            💡 Exemple: https://icecast.radiofrance.fr/franceinter-midfi.mp
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Titre de l&apos;émission <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Ex: Émission matinale"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Durée (secondes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:border-emerald-500 transition-colors"
            min="10"
            max="3600"
          />
          <p className="text-xs text-slate-500 mt-1">
            De 10 secondes à 1 heure (3600s)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Format Audio
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="flac">FLAC</option>
            <option value="aac">AAC</option>
            <option value="ogg">OGG</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !streamUrl || !title}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            Démarrage de l&apos;enregistrement...
          </>
        ) : (
          <>
            <Play className="h-5 w-5" />
            Démarrer l&apos;enregistrement
          </>
        )}
      </button>

      {message && (
        <div
          className={`p-3 rounded ${
            message.includes("✅")
              ? "bg-emerald-900/30 border border-emerald-700 text-emerald-300"
              : "bg-red-900/30 border border-red-700 text-red-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* Exemples d'URLs */}
      <details className="text-sm text-slate-400">
        <summary className="cursor-pointer hover:text-slate-300 transition-colors">
          📻 Exemples de streams radio français
        </summary>
        <ul className="mt-2 space-y-1 pl-4 text-xs">
          <li className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => setStreamUrl("https://icecast.radiofrance.fr/franceinter-midfi.mp")}>
            • France Inter: https://icecast.radiofrance.fr/franceinter-midfi.mp
          </li>
          <li className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => setStreamUrl("https://icecast.radiofrance.fr/franceinter-midfi.mp")}>
            • France Info: https://icecast.radiofrance.fr/franceinter-midfi.mp
          </li>
          <li className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => setStreamUrl("https://icecast.radiofrance.fr/franceinter-midfi.mp")}>
            • France Culture: https://icecast.radiofrance.fr/franceinter-midfi.mp
          </li>
        </ul>
      </details>
    </div>
  );
};
