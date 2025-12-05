"use client";

import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import { useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const starterMessages: ChatMessage[] = [
  {
    id: nanoid(),
    role: "assistant",
    content:
      "Par Toutatis numérique ! Je suis Petit Gaulois Numérique, gardien du Village Résistant. Pose-moi une question sur Linux, le réemploi, la vie privée…",
  },
];

const suggestions = [
  "Comment convaincre un proviseur de passer à Linux ?",
  "Idées de mini-jeu sur la vie privée",
  "Expliquer la démarche NIRD aux parents",
  "Comment organiser un atelier réemploi ?",
];

export function PetitGauloisAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    const userMessage: ChatMessage = { id: nanoid(), role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Assistant indisponible");
      }

      const data = (await response.json()) as { message: string };
      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setError("Pas de potion magique pour l'instant. Réessaie !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-xl shadow-emerald-400/50"
      >
        {isOpen ? "Fermer" : "Petit Gaulois"}
        <span className="text-lg">🐧</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mt-3 w-80 rounded-3xl border border-white/10 bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Petit Gaulois Numérique</p>
              <span className="text-xs text-white/60">NIRD-AI</span>
            </div>
            <div className="mt-3 max-h-64 space-y-3 overflow-y-auto pr-1 text-sm">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl px-3 py-2 ${
                    message.role === "assistant"
                      ? "bg-emerald-500/20 text-emerald-100"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {loading && <p className="text-xs text-white/60">Le druide réfléchit...</p>}
              {error && <p className="text-xs text-rose-300">{error}</p>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="rounded-full border border-white/10 px-3 py-1 text-white/80 hover:border-emerald-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <form
              className="mt-3 flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(input);
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Pose ta question..."
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-3 py-2 text-xs font-semibold text-slate-900 disabled:opacity-40"
              >
                Envoyer
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
