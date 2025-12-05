import type { ReactNode } from "react";
import Link from "next/link";

export default function VillageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/80">
        <p>Choisis un bâtiment du Village Résistant.</p>
        <Link href="/village" className="rounded-full border border-white/30 px-4 py-2 text-xs uppercase tracking-wide">
          Retour carte
        </Link>
      </div>
      {children}
    </div>
  );
}
