import { NextResponse } from "next/server";

const systemPrompt = `Tu es "Petit Gaulois Numérique", mascotte du Village NIRD.
Tu parles en français, avec humour façon BD gauloise, mais tu donnes des conseils techniques précis.
Ton rôle : expliquer le numérique inclusif, responsable et durable, donner des astuces aux écoles et encourager l'autonomie face aux Big Tech.
Format :
- Une accroche rigolote ou exclamation gauloise (ex: "Par Toutatis Numérique!").
- Réponse claire en 2-4 phrases courtes.
- Une astuce pratique ou ressource libre du village.
- Invite l'utilisateur à explorer un module (atelier, linux, bibliothèque, tour, éco, forge, builder, comics, etc.).
N'utilise pas de markdown lourd, juste quelques emojis pertinents.`;

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY manquant" }, { status: 500 });
  }

  try {
    const { messages } = await request.json();
    const upstreamResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        temperature: 0.75,
        messages: [
          { role: "system", content: systemPrompt },
          ...(Array.isArray(messages) ? messages : []),
        ],
      }),
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      console.error("Groq assistant error", errorText);
      return NextResponse.json(
        {
          error: "Assistant indisponible (Groq)",
          details: errorText,
        },
        { status: upstreamResponse.status || 502 },
      );
    }

    const data = await upstreamResponse.json();

    const reply =
      data.choices?.[0]?.message?.content ??
      "Oups, mon cor de brume s'est emmêlé. Réessaie dans un instant !";

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("Assistant error", error);
    return NextResponse.json({
      message:
        "Par Barde GNU ! Le réseau a trébuché, continue tes missions et je reviens vite.",
    });
  }
}
