"use client";

import { useState } from "react";
import { LIBRE_QUIZ } from "../data/quiz";
import { evaluateQuiz, MIN_BADGE_SCORE } from "../lib/quizEngine";
import { markModuleCompletion, unlockBadge } from "../lib/localStorageUtils";

export function QuizLibre() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    const evaluation = evaluateQuiz(answers);
    setResult({ score: evaluation.score, total: evaluation.total });
    if (evaluation.score >= MIN_BADGE_SCORE) {
      unlockBadge("libre");
      markModuleCompletion("libre");
    }
  };

  return (
    <section className="rounded-3xl border border-amber-200/40 bg-slate-900/80 p-6 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Quiz Bibliothèque Libre</p>
      <h2 className="mt-2 text-3xl font-semibold">6 questions pour valider tes réflexes libres</h2>
      <div className="mt-6 space-y-5">
        {LIBRE_QUIZ.map((question) => (
          <div key={question.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-lg font-semibold">{question.title}</p>
            <p className="text-sm text-white/70">{question.description}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(question.id, option.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    answers[question.id] === option.id
                      ? "border-amber-300 bg-amber-200/30 text-amber-50"
                      : "border-white/20"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 w-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500 px-6 py-3 text-center text-sm font-semibold text-slate-900"
      >
        Valider mes réponses
      </button>
      {result && (
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/10 p-4 text-center text-sm">
          <p>
            Score : {result.score} / {result.total}
          </p>
          <p className="text-xs text-white/70">
            {result.score >= MIN_BADGE_SCORE
              ? "Badge \"Sage du Libre\" débloqué !"
              : "Tu peux retenter après avoir relu les fiches pédagogiques."}
          </p>
        </div>
      )}
    </section>
  );
}
