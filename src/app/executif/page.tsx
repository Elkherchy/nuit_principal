"use client";

import { useCallback, useState } from "react";
import ExecutiveCalculator from "../../components/ExecutiveCalculator";
import ExecutiveProjectionCard from "../../components/ExecutiveProjection";
import ExecutiveAiAdvisor from "../../components/ExecutiveAiAdvisor";
import type { ExecutiveProjection, ExecutiveScenario } from "../../types/executive";

export default function ExecutifPage() {
  const [scenario, setScenario] = useState<ExecutiveScenario | null>(null);
  const [projection, setProjection] = useState<ExecutiveProjection | null>(null);

  const handleChange = useCallback(
    ({ scenario: nextScenario, projection: nextProjection }: { scenario: ExecutiveScenario; projection: ExecutiveProjection }) => {
      setScenario(nextScenario);
      setProjection(nextProjection);
    },
    [],
  );

  return (
    <div className="space-y-8 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Interface décideurs</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Montre en 2 minutes ce que Linux &amp; le libre économisent</h1>
        <p className="mt-3 text-sm text-white/70">
          Pensé pour les chefs d&rsquo;établissement, DSI et collectivités : tu entres ton parc, tu obtiens un mémo budgétaire
          prêt à présenter en CA.
        </p>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <ExecutiveCalculator onChange={handleChange} />
        <ExecutiveProjectionCard projection={projection} />
      </div>
      <ExecutiveAiAdvisor scenario={scenario} projection={projection} />
    </div>
  );
}


