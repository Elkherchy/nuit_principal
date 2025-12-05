import { NextResponse } from "next/server";
import type { ExecutiveProjection, ExecutiveScenario } from "../../../types/executive";

const budgetPrompt = (scenario: ExecutiveScenario, projection: ExecutiveProjection) => `
Tu es un consultant NIRD qui conseille des directions d'établissements.
Analyse les données suivantes et rédige une note structurée (3 paragraphes max) :

- Parc : ${scenario.pcCount} postes, objectif Linux ${scenario.linuxTarget}%.
- Coût licence / poste : ${scenario.licenseCost} €.
- Dépenses SaaS / Cloud actuelles : ${scenario.cloudSpend} €/mois.
- Contrats support propriétaires : ${scenario.supportSpend} €/an.
- Taux de remplacement matériel : ${Math.round(scenario.hardwareReplacementRate * 100)}% (${scenario.hardwareCost} €/poste).
- Gains estimés : ${Math.round(projection.totalSavings)} €/an (licences ${Math.round(projection.licenseSavings)} €, cloud ${Math.round(projection.cloudSavings)} €, support ${Math.round(projection.supportSavings)} €, matériel ${Math.round(projection.hardwareSavings)} €, énergie ${Math.round(projection.energySavings)} €).
- CO₂ évité : ${Math.round(projection.avoidedCO2)} kg/an.

Format attendu :
1. "Par Toutatis budgétaire !" + résumé exécutif.
2. Bullet points "Impact financier", "Souveraineté & risques", "Actions suggérées (3 max)".
3. Conclusion très courte invitant à rejoindre la communauté NIRD.
`;

const buildFallbackMemo = (scenario: ExecutiveScenario, projection: ExecutiveProjection) => {
  const lines: string[] = [];
  lines.push(
    `Par Toutatis budgétaire ! En convertissant ${scenario.linuxTarget}% des ${scenario.pcCount} postes vers GNU/Linux, ` +
      `ton établissement peut économiser environ ${Math.round(projection.totalSavings)} € par an tout en évitant ${Math.round(projection.avoidedCO2)} kg de CO₂.`,
  );
  lines.push(
    `Impact financier : licences propriétaires (-${Math.round(
      projection.licenseSavings,
    )} €), SaaS/Cloud fermés (-${Math.round(projection.cloudSavings)} €), contrats de support (-${Math.round(
      projection.supportSavings,
    )} €), renouvellement matériel différé (-${Math.round(
      projection.hardwareSavings,
    )} €) et énergie (-${Math.round(projection.energySavings)} €).`,
  );
  lines.push(
    `Actions suggérées : 1) lancer un pilote Linux sur ${Math.round(
      (scenario.pcCount * scenario.linuxTarget) / 5 / 100,
    )} machines critiques, 2) migrer un service SaaS vers la Forge NIRD, 3) présenter ce scénario en conseil d'administration pour sanctuariser le budget.`,
  );
  lines.push(`Conclusion : rejoins la communauté NIRD pour mutualiser scripts, formations et retours d'expérience.`);
  return lines.join("\n\n");
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY manquant" }, { status: 500 });
  }

  let scenario: ExecutiveScenario | undefined;
  let projection: ExecutiveProjection | undefined;

  try {
    const body = (await request.json()) as {
      scenario?: ExecutiveScenario;
      projection?: ExecutiveProjection;
    };
    scenario = body.scenario;
    projection = body.projection;

    if (!scenario || !projection) {
      return NextResponse.json({ error: "Payload incomplet" }, { status: 400 });
    }

    const upstreamResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        temperature: 0.65,
        max_output_tokens: 1024,
        messages: [
          { role: "system", content: "Tu es un consultant financier spécialisé NIRD." },
          {
            role: "user",
            content: budgetPrompt(scenario, projection),
          },
        ],
      }),
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      console.error("Budget advisor error", errorText);
      return NextResponse.json(
        {
          message: buildFallbackMemo(scenario, projection),
          warning: "Analyse Groq indisponible – mémo généré localement.",
          details: errorText,
        },
        { status: 200 },
      );
    }

    const data = await upstreamResponse.json();
    const reply = data.choices?.[0]?.message?.content ?? buildFallbackMemo(scenario, projection);

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("Budget advisor error", error);
    return NextResponse.json(
      {
        message: scenario && projection ? buildFallbackMemo(scenario, projection) : "Impossible de calculer ce scénario.",
        warning: "Analyse locale (fallback)",
      },
      { status: 200 },
    );
  }
}


