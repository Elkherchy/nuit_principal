const tools = [
  "Next.js 16 (App Router) + TypeScript",
  "Tailwind CSS 4 / PostCSS",
  "Framer Motion pour les animations",
  "Tabler Icons (MIT)",
  "Fonts Geist (Google Fonts)",
];

const roles = [
  { title: "Narratif & pédagogie", content: "Écriture originale des textes NIRD et du cas Lycée Carnot." },
  { title: "Game design", content: "Création des mini-jeux diagnostics, tower defense et simulateur CO₂." },
  { title: "Développement", content: "Intégration Next.js, stockage localStorage, responsive & accessibilité." },
];

export default function CreditsPage() {
  return (
    <div className="space-y-8 text-white">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-semibold">Crédits & Licence</h1>
        <p className="mt-2 text-sm text-white/80">
          Projet &quot;Village Numérique Résistant&quot; – MIT License. Contenus originaux écrits pour la Nuit de l&rsquo;Info 2025. Illustrations et icônes : sources libres.
        </p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold">Technologies</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-white/80">
          {tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold">Équipe fictive</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {roles.map((role) => (
            <div key={role.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">{role.title}</p>
              <p className="mt-2 text-white">{role.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        <p>Assets libres : Tabler Icons (MIT), illustrations potentielles provenant de unDraw / OpenClipart.</p>
        <p className="mt-2">Ce projet peut être déployé sur Vercel en un clic (npm run build → vercel deploy).</p>
      </section>
    </div>
  );
}
