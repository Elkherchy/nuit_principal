import { MiniGameAtelier } from "../../../components/MiniGameAtelier";

export default function AtelierPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        <h1 className="text-3xl font-semibold">Atelier Réemploi</h1>
        <p className="mt-2 text-sm text-white/80">
          Diagnostique un ordinateur jugé obsolète par les Big Tech. Ici, on prouve qu&rsquo;un PC de 10 ans peut encore servir avec un système léger.
        </p>
      </header>
      <MiniGameAtelier />
    </div>
  );
}
