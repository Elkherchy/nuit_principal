import { AnimatedShort } from "../../components/labs/AnimatedShort";
import { ComicStripGenerator } from "../../components/labs/ComicStripGenerator";
import { DigitalEscapeRoom } from "../../components/labs/DigitalEscapeRoom";
import { ImpactVisualizer } from "../../components/labs/ImpactVisualizer";
import { NarrativeAdventure } from "../../components/labs/NarrativeAdventure";
import { PotionLab } from "../../components/labs/PotionLab";
import { VillageBuilder } from "../../components/labs/VillageBuilder";

export default function LabsPage() {
  return (
    <div className="space-y-6 text-white">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Studios &amp; Simulations</p>
        <h1 className="mt-2 text-4xl font-semibold">NIRD Labs – Expériences folles</h1>
        <p className="mt-2 text-sm text-white/70">
          BD dynamiques, city-builder, potions libres, court-métrage SVG et puzzles avancés : tout est jouable hors-ligne,
          badges compris.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <ComicStripGenerator />
        <VillageBuilder />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DigitalEscapeRoom />
        <ImpactVisualizer />
      </div>

      <NarrativeAdventure />

      <div className="grid gap-6 lg:grid-cols-2">
        <PotionLab />
        <AnimatedShort />
      </div>
    </div>
  );
}

