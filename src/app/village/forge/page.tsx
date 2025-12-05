import { ForgeCommunity } from "../../../components/ForgeCommunity";

export default function ForgePage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        <h1 className="text-3xl font-semibold">Forge de la Communauté</h1>
        <p className="mt-2 text-sm text-white/80">
          Liste des chantiers ouverts, dépôt d&rsquo;idées locales et suivi des contributions des élèves, enseignants et collectivités.
        </p>
      </header>
      <ForgeCommunity />
    </div>
  );
}
