"use client";

import { useState } from "react";
import type { ExecutiveProjection, ExecutiveScenario } from "../types/executive";

type Props = {
  scenario: ExecutiveScenario | null;
  projection: ExecutiveProjection | null;
};

export function ExecutiveAiAdvisor({ scenario, projection }: Props) {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyse = async () => {
    if (!scenario || !projection || loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, projection }),
      });
      const data = (await response.json()) as { message?: string; error?: string; details?: string };
      if (!response.ok) {
        throw new Error(data.error ?? data.details ?? "Analyse indisponible");
      }
      setAnalysis(data.message ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'obtenir l'analyse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.4em] text-sky-300">Conseiller IA Groq</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">Demande un argumentaire budgétaire</h2>
      <p className="mt-2 text-sm text-white/70">
        L&rsquo;IA open-source (Llama 3.1 via Groq) transforme tes chiffres en note d&rsquo;intention pour convaincre une direction ou une collectivité.
      </p>
      <button
        onClick={handleAnalyse}
        disabled={!scenario || loading}
        className="mt-4 rounded-full bg-gradient-to-r from-sky-300 to-indigo-400 px-6 py-3 text-sm font-semibold text-slate-900 disabled:opacity-40"
      >
        {loading ? "Analyse en cours..." : "Générer le mémo stratégique"}
      </button>
      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
      {analysis && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80 whitespace-pre-line">
          {analysis}
        </div>
      )}
    </section>
  );
}

export default ExecutiveAiAdvisor;

