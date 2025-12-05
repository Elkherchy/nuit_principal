import { EcoSimulator } from "../../../components/EcoSimulator";

export default function EcoPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        <h1 className="text-3xl font-semibold">Salle des Éco-Délégués</h1>
        <p className="mt-2 text-sm text-white/80">
          Compare consommation, réemploi et impact CO₂ pour convaincre ton établissement d&rsquo;adopter la démarche NIRD.
        </p>
      </header>
      <EcoSimulator />
    </div>
  );
}
