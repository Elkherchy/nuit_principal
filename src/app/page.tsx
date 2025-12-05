import Link from "next/link";
import { VillageMap } from "../components/VillageMap";

export default function Home() {
  const objectives = [
    {
      title: "Inclusion",
      text: "Mettre chaque élève en capacité d&rsquo;agir grâce à des outils accessibles et libres.",
    },
    {
      title: "Responsabilité",
      text: "Comprendre les risques des Big Tech et sécuriser les données de la communauté éducative.",
    },
    {
      title: "Durabilité",
      text: "Allonger la durée de vie du matériel et limiter les émissions carbone.",
    },
  ];

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-white">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Défi principal – Nuit de l&rsquo;Info 2025</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight">
          Village Numérique Résistant – L&rsquo;Aventure NIRD
        </h1>
        <p className="mt-4 text-lg text-slate-200">
          Entre jeu narratif, mini-défis et pédagogie libre, découvre comment une école peut résister aux Big Tech et redevenir souveraine numériquement.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/village"
            className="rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-900"
          >
            Explorer le village
          </Link>
          <Link
            href="/labs"
            className="rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-3 text-sm font-semibold text-slate-900"
          >
            Tester les NIRD Labs
          </Link>
          <Link
            href="/about-nird"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/80"
          >
            Comprendre la démarche NIRD
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {objectives.map((objective) => (
          <div key={objective.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Pilier</p>
            <h3 className="mt-2 text-2xl font-semibold">{objective.title}</h3>
            <p className="mt-2 text-sm text-white/80">{objective.text}</p>
          </div>
        ))}
      </section>

      <VillageMap />
    </div>
  );
}
