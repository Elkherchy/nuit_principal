import { BadgeDisplay } from "../../components/BadgeDisplay";
import { NirdScorePanel } from "../../components/NirdScorePanel";

export default function BadgesPage() {
  return (
    <div className="space-y-6 text-white">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-semibold">Badges & progression</h1>
        <p className="mt-2 text-sm text-white/80">
          {`Tous les badges et modules enrichissent l'index NIRD (badges, CO₂, vie privée). LocalStorage conserve la progression pour chaque utilisateur.`}
        </p>
      </header>
      <NirdScorePanel />
      <BadgeDisplay />
    </div>
  );
}
