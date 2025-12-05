import { LinuxSimulation } from "../../../components/LinuxSimulation";
import { LinuxResurrectionMachine } from "../../../components/labs/LinuxResurrectionMachine";

export default function LinuxPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        <h1 className="text-3xl font-semibold">Maison Linux</h1>
        <p className="mt-2 text-sm text-white/80">
          Suis un scénario d&rsquo;installation guidé, plein d&rsquo;humour et d&rsquo;astuces pour lancer Linux dans ton établissement sans stress.
        </p>
      </header>
      <LinuxSimulation />
      <LinuxResurrectionMachine />
    </div>
  );
}
