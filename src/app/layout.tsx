import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { AuthStatus } from "../components/AuthStatus";
import { PetitGauloisAssistant } from "../components/PetitGauloisAssistant";
import { SnakeEasterEgg } from "../components/SnakeEasterEgg";

export const metadata: Metadata = {
  title: "Village Numérique Résistant – L'Aventure NIRD",
  description:
    "Application narrative et gamifiée pour apprendre la démarche NIRD : numérique inclusif, responsable et durable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-slate-950 text-slate-50">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur overflow-x-auto">
              <div className="mx-auto flex max-w-7xl flex-nowrap items-center justify-between gap-4 px-4 py-4 min-w-max">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link href="/" className="text-lg font-semibold text-emerald-300 whitespace-nowrap">
                    Village NIRD
                  </Link>
                  <nav className="flex gap-3 text-sm text-slate-200">
                    <Link href="/village" className="hover:text-white whitespace-nowrap">
                      Village
                    </Link>
                    <Link href="/labs" className="hover:text-white whitespace-nowrap">
                      Labs
                    </Link>
                    <Link href="/observatoire" className="hover:text-white whitespace-nowrap">
                      Observatoire
                    </Link>
                    <Link href="/executif" className="hover:text-white whitespace-nowrap">
                      Dirigeants
                    </Link>
                    <Link href="/missions" className="hover:text-white whitespace-nowrap">
                      Missions
                    </Link>
                    <Link href="/pige" className="hover:text-white whitespace-nowrap">
                      Pige Radio
                    </Link>
                    <Link href="/about-nird" className="hover:text-white whitespace-nowrap">
                      NIRD
                    </Link>
                    <Link href="/badges" className="hover:text-white whitespace-nowrap">
                      Badges
                    </Link>
                    <Link href="/credits" className="hover:text-white whitespace-nowrap">
                      Crédits
                    </Link>
                  </nav>
                </div>
                <div className="flex-shrink-0">
                  <AuthStatus />
                </div>
              </div>
            </header>
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
            <footer className="border-t border-white/10 bg-slate-950/80 py-6 text-center text-xs text-slate-400">
              MIT License • Nuit de l&rsquo;Info 2025 – Village Numérique Résistant
            </footer>
          </div>
          <PetitGauloisAssistant />
          <SnakeEasterEgg />
        </AuthProvider>
      </body>
    </html>
  );
}
