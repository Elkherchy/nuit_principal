"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { markModuleCompletion, unlockBadge, updateScore } from "../../lib/localStorageUtils";

type PanelSprite = "hero" | "villain" | "students";

type Panel = {
  id: number;
  title: string;
  text: string;
  color: string;
  sprite: PanelSprite;
};

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 300;

const SCENARIOS = [
  {
    id: "linux",
    label: "Installer Linux",
    panels: [
      "Big Tech essaye de verrouiller la salle info.",
      "Un pingouin capé surgit avec un Live USB magique.",
      "La cloche sonne : tout le monde applaudit.",
    ],
    boost: 35,
  },
  {
    id: "recyclerie",
    label: "Ouvrir une recyclerie",
    panels: ["Les déchets électroniques forment une montagne.", "Atelier de réemploi en feu (pas littéralement).", "Une banderole NIRD flotte au vent."],
    boost: 25,
  },
  {
    id: "privacy",
    label: "Installer un mur anti-trackers",
    panels: ["Cookies et popups envahissent les écrans.", "Le club vie privée brandit uBlock et Matrix.", "Les élèves dansent autour d&rsquo;un firewall joyeux."],
    boost: 30,
  },
];

const HEROES = [
  { id: "penguin", label: "Pingouin super-héros", sprite: "hero" as const },
  { id: "students", label: "Collectif d&rsquo;élèves", sprite: "students" as const },
];

const REACTIONS = [
  { id: "no", label: "BigTech hurle NOOOO!", sprite: "villain" as const },
  { id: "shrug", label: "BigTech boude et rame", sprite: "villain" as const },
];

const PANEL_COLORS = ["#0f172a", "#312e81", "#1f2937", "#0f766e", "#4c1d95"];

const SPRITE_PATHS: Record<PanelSprite, string> = {
  hero: "/assets/comic/penguin.svg",
  villain: "/assets/comic/villain.svg",
  students: "/assets/comic/students.svg",
};

export function ComicStripGenerator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [panels, setPanels] = useState<Panel[]>(() =>
    Array.from({ length: 3 }).map((_, index) => ({
      id: index,
      title: `Case ${index + 1}`,
      text: "Choisis un scénario pour démarrer.",
      color: PANEL_COLORS[index] ?? "#0f172a",
      sprite: index === 1 ? "villain" : "hero",
    }))
  );
  const [storyConfig, setStoryConfig] = useState({
    scenario: SCENARIOS[0].id,
    hero: HEROES[0].id,
    reaction: REACTIONS[0].id,
    tagline: "Notre école résiste ensemble 💪",
  });
  const [sprites, setSprites] = useState<Record<PanelSprite, HTMLImageElement | null>>({
    hero: null,
    villain: null,
    students: null,
  });
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    let mounted = true;
    Object.entries(SPRITE_PATHS).forEach(([key, path]) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        if (mounted) {
          setSprites((prev) => ({ ...prev, [key]: img }));
        }
      };
    });
    return () => {
      mounted = false;
    };
  }, []);

  const drawPanels = useMemo(
    () => () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const panelWidth = CANVAS_WIDTH / panels.length;
      panels.forEach((panel, index) => {
        const x = index * panelWidth;
        ctx.fillStyle = panel.color;
        ctx.fillRect(x + 6, 6, panelWidth - 12, CANVAS_HEIGHT - 12);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "bold 22px Geist, sans-serif";
        ctx.fillText(panel.title, x + 20, 40);
        ctx.font = "16px Geist, sans-serif";
        wrapText(ctx, panel.text, x + 20, 70, panelWidth - 40, 22);
        const sprite = sprites[panel.sprite];
        if (sprite) {
          ctx.drawImage(sprite, x + panelWidth / 2 - 60, 120, 120, 120);
        }
      });
    },
    [panels, sprites]
  );

  useEffect(() => {
    drawPanels();
  }, [drawPanels]);

  const handleGenerate = () => {
    const scenario = SCENARIOS.find((item) => item.id === storyConfig.scenario) ?? SCENARIOS[0];
    const hero = HEROES.find((item) => item.id === storyConfig.hero) ?? HEROES[0];
    const reaction = REACTIONS.find((item) => item.id === storyConfig.reaction) ?? REACTIONS[0];
    const generated: Panel[] = scenario.panels.map((text, index) => ({
      id: index,
      title: index === 1 ? reaction.label : hero.label,
      text: index === 2 ? `${text} ${storyConfig.tagline}` : text,
      color: PANEL_COLORS[index % PANEL_COLORS.length],
      sprite: index === 1 ? reaction.sprite : hero.sprite,
    }));
    setPanels(generated);
    setShared(false);
    const creativityScore = Math.min(100, scenario.boost + storyConfig.tagline.length * 2);
    updateScore({ creativityScore });
    unlockBadge("comic");
    markModuleCompletion("comic");
    markModuleCompletion("labs");
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    setDownloadUrl(dataUrl);
    setShared(true);
    unlockBadge("labs");
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-white shadow-2xl">
      <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Studio BD NIRD</p>
      <h2 className="mt-2 text-3xl font-semibold">Générateur de strip dynamique</h2>
      <p className="mt-2 text-sm text-white/70">
        Choisis un scénario, dessine la réaction Big Tech et ajoute ta punchline. Tu peux exporter la BD en PNG pour la partager.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Selector
          label="Scénario"
          value={storyConfig.scenario}
          options={SCENARIOS.map((scenario) => ({ id: scenario.id, label: scenario.label }))}
          onChange={(value) => setStoryConfig((prev) => ({ ...prev, scenario: value }))}
        />
        <Selector
          label="Héros"
          value={storyConfig.hero}
          options={HEROES.map((hero) => ({ id: hero.id, label: hero.label }))}
          onChange={(value) => setStoryConfig((prev) => ({ ...prev, hero: value }))}
        />
        <Selector
          label="Réaction du méchant"
          value={storyConfig.reaction}
          options={REACTIONS.map((reaction) => ({ id: reaction.id, label: reaction.label }))}
          onChange={(value) => setStoryConfig((prev) => ({ ...prev, reaction: value }))}
        />
        <label className="text-sm">
          <span>Punchline finale</span>
          <input
            type="text"
            value={storyConfig.tagline}
            onChange={(event) => setStoryConfig((prev) => ({ ...prev, tagline: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-white"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGenerate}
          className="rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-900"
        >
          Générer la BD
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/80"
        >
          Exporter en image
        </motion.button>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download="nird-comic.png"
            className="rounded-full border border-emerald-300 px-4 py-2 text-xs uppercase tracking-wide text-emerald-200"
          >
            Télécharger
          </a>
        )}
      </div>
      {shared && (
        <p className="mt-2 text-xs text-emerald-200">
          BD partagée ! Badge &quot;Explorateur du Studio&quot; progressif débloqué.
        </p>
      )}

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-4">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full rounded-2xl border border-white/10" />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {panels.map((panel) => (
          <div key={panel.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <p className="text-xs uppercase tracking-wide text-white/60">{panel.title}</p>
            <p className="mt-1">{panel.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Selector({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-white"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n += 1) {
    const testLine = `${line}${words[n]} `;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = `${words[n]} `;
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

