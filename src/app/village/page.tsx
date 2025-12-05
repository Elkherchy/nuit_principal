import { BadgeDisplay } from "../../components/BadgeDisplay";
import { VillageMap } from "../../components/VillageMap";
import { BADGES } from "../../lib/progression";

export default function VillagePage() {
  return (
    <div className="space-y-10">
      <VillageMap />
      <BadgeDisplay />
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        <h2 className="text-2xl font-semibold">Parcours utilisateur</h2>
        <p className="mt-2 text-sm text-white/80">
          Accueil → Carte → Module interactif → Badge → Retour au village. Atteins les {BADGES.length} badges pour
          propulser le NIRD Index à 100%.
        </p>
      </section>
    </div>
  );
}
