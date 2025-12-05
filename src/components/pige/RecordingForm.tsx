/**
 * Formulaire pour démarrer un enregistrement
 */

"use client";

import { useState } from "react";
import { Play, Upload } from "lucide-react";
import type { StartRecordingParams, StartRecordingResponse } from "@/services/pigeService";

interface RecordingFormProps {
  onSubmit: (params: StartRecordingParams) => Promise<StartRecordingResponse>;
  loading: boolean;
  message: string;
}

export const RecordingForm = ({ onSubmit, loading, message }: RecordingFormProps) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [format, setFormat] = useState("mp3");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      // Extraire le nom du fichier sans extension comme titre par défaut
      if (!title) {
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        setTitle(fileName);
      }
    }
  };

  const handleSubmit = async () => {
    if (!audioFile) {
      alert("Veuillez sélectionner un fichier audio");
      return;
    }

    await onSubmit({
      source: audioFile,
      title,
      format,
      duration,
    });
    setTitle("");
    setAudioFile(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-emerald-300 flex items-center gap-2">
        <Play className="h-6 w-6" />
        Démarrer un enregistrement
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Fichier Audio
          </label>
          <div className="relative">
            <input
              type="file"
              accept="audio/*,.mp3,.wav,.flac,.m4a,.aac,.ogg"
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 file:cursor-pointer"
            />
            {audioFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-emerald-400">
                <Upload className="h-4 w-4" />
                <span>{audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>
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

