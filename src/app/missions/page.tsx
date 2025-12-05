"use client";

import { motion } from "framer-motion";
import MissionGenerator from "../../components/MissionGenerator";
import ResistanceRadio from "../../components/ResistanceRadio";
import EvidenceWall from "../../components/EvidenceWall";

export default function MissionsPage() {
  return (
    <div className="space-y-8 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.4em] text-rose-300">Quartier des Missions</p>
          <h1 className="mt-3 text-4xl font-semibold">
            Briefings secrets, radio libre et mur d’évidence pour inspirer le village.
          </h1>
          <p className="mt-3 text-base text-white/80">
            Chaque mission réussie renforce ton badge <strong>Stratège Résistant</strong> et diffuse la démarche NIRD dans
            d’autres établissements. Pioche, enquête, partage.
          </p>
        </motion.div>
      </section>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <MissionGenerator />
        <ResistanceRadio />
      </div>
      <EvidenceWall />
    </div>
  );
}


