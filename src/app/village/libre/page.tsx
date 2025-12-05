import { QuizLibre } from "../../../components/QuizLibre";

export default function BibliothequePage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        <h1 className="text-3xl font-semibold">Bibliothèque Libre</h1>
        <p className="mt-2 text-sm text-white/80">
          Réponds à 6 questions express pour prouver que tu maîtrises les logiciels libres incontournables en classe.
        </p>
      </header>
      <QuizLibre />
    </div>
  );
}
