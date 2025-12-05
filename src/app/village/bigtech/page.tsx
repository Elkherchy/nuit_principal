import { MiniGameBigTech } from "../../../components/MiniGameBigTech";
import { SurveillanceSimulator } from "../../../components/labs/SurveillanceSimulator";

export default function BigTechPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        <h1 className="text-3xl font-semibold">Tour de Surveillance Big Tech</h1>
        <p className="mt-2 text-sm text-white/80">
          Les notifications parasites et verrous propriétaires tentent d&rsquo;envahir le village. Bloque-les avant qu&rsquo;ils ne sapent la résilience numérique.
        </p>
      </header>
      <MiniGameBigTech />
      <SurveillanceSimulator />
    </div>
  );
}
