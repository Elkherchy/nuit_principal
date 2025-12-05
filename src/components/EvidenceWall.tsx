"use client";

import { motion } from "framer-motion";

type EvidenceItem = {
  id: string;
  label: string;
  description: string;
  link: string;
};

const evidenceItems: EvidenceItem[] = [
  {
    id: "nird-site",
    label: "Site officiel NIRD",
    description: "Guides, fiches pratiques, retours d&rsquo;expérience du collectif.",
    link: "https://nird.forge.apps.education.fr/",
  },
  {
    id: "forge",
    label: "Forge des communs éducatifs",
    description: "Mutualisation des scripts, fiches et ateliers libres.",
    link: "https://forge.apps.education.fr/",
  },
  {
    id: "video-demo",
    label: "Le projet NIRD en vidéo",
    description: "Les élèves du lycée Carnot pitchent leur démarche.",
    link: "https://tube-numerique-educatif.apps.education.fr/w/pZCnzPKTYX2iF38Qh4ZGmq",
  },
  {
    id: "linux-facile",
    label: "Linux, c&rsquo;est facile !",
    description: "Démonstration par les élèves pour installer une distrib légère.",
    link: "https://tube-numerique-educatif.apps.education.fr/w/3LXem3XK4asbwZa5R1qGkW",
  },
];

export function EvidenceWall() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.4em] text-purple-300">Mur d&rsquo;évidence</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">Les preuves que le village résiste déjà</h2>
      <p className="mt-2 text-sm text-white/70">
        Vidéos, articles, manifestes : pioche dans ces preuves pour argumenter face aux Big Tech.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {evidenceItems.map((item) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80"
          >
            <p className="text-lg font-semibold text-white">{item.label}</p>
            <p className="mt-1 text-white/70">{item.description}</p>
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-xs font-semibold text-emerald-300 underline"
            >
              Consulter ↗
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default EvidenceWall;

