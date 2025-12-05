/**
 * Formulaire pour démarrer un enregistrement
 */

"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { StartRecordingParams, StartRecordingResponse } from "@/services/pigeService";

interface RecordingFormProps {
  onSubmit: (params: StartRecordingParams) => Promise<StartRecordingResponse>;
  loading: boolean;
  message: string;
}

export const RecordingForm = ({ onSubmit, loading, message }: RecordingFormProps) => {
  const [streamUrl, setStreamUrl] = useState(
    "https://icecast.radiofrance.fr/franceinter-midfi.mp3"
  );
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [format, setFormat] = useState("mp3");

  const handleSubmit = async () => {
    await onSubmit({
      source: streamUrl,
      title,
      format,
      duration,
    });
    setTitle("");
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-emerald-300 flex items-center gap-2">
        <Play className="h-6 w-6" />
        Démarrer un enregistrement
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            URL du Stream Radio
          </label>
          <input
            type="text"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Titre de l&rsquo;émission
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white"
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
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white"
            min="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Format Audio
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white"
          >
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="flac">FLAC</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white font-semibold py-3 px-4 rounded flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            Démarrage en cours...
          </>
        ) : (
          <>
            <Play className="h-5 w-5" />
            Démarrer l&rsquo;enregistrement
          </>
        )}
      </button>

      {message && (
        <div
          className={`p-3 rounded ${
            message.includes("✅")
              ? "bg-emerald-900/30 border border-emerald-700"
              : "bg-red-900/30 border border-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

