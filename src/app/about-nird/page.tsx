const pillars = [
  {
    title: "Numérique Inclusif",
    content: "Accessibilité, sobriété, documentation claire et matériels adaptés aux publics allophones ou en situation de handicap.",
  },
  {
    title: "Numérique Responsable",
    content: "Choisir des services maîtrisés localement, protéger les données et bannir les dépendances aux Big Tech.",
  },
  {
    title: "Numérique Durable",
    content: "Réemploi, sobriété logicielle, mesure d'impact énergétique et gouvernance partagée.",
  },
];

const actions = [
  "Installer GNU/Linux sur les postes partagés",
  "Mettre en place un club de réparation mixant élèves et agents",
  "Mutualiser une instance Nextcloud avec la collectivité",
  "Former les enseignants aux outils libres (LibreOffice, Moodle, Inkscape)",
];

export default function AboutNirdPage() {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Comprendre NIRD</p>
        <h1 className="mt-2 text-3xl font-semibold">Une démarche pour résister aux Big Tech</h1>
        <p className="mt-3 text-sm text-white/80">
          NIRD signifie Numérique Inclusif, Responsable et Durable. C&rsquo;est un cadre d&rsquo;action permettant à chaque établissement scolaire de gagner en autonomie, tout en réduisant ses coûts et son empreinte écologique.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Pilier</p>
            <h3 className="mt-2 text-2xl font-semibold">{pillar.title}</h3>
            <p className="mt-2 text-sm text-white/80">{pillar.content}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        <h2 className="text-2xl font-semibold">Cas réel : Lycée Carnot</h2>
        <p className="mt-2 text-sm text-white/80">
          En 2024, le Lycée Carnot a réemployé 42 ordinateurs déclassés de la mairie. Après migration sous Linux Mint et formation express des élèves en éco-délégués, 12 salles spécialisées ont été équipées en logiciels libres. Résultat : 35k€ économisés et une réduction de 3,2 tonnes de CO₂ sur deux ans.
        </p>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        <h2 className="text-2xl font-semibold">Checklist rapide</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-white/80">
          {actions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
