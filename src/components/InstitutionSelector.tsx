"use client";

import type { Institution } from "../data/institutions";

type SelectorProps = {
  institutions: Institution[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export function InstitutionSelector({ institutions, selectedIds, onChange }: SelectorProps) {
  const handleSelect = (index: number, value: string) => {
    const clone = [...selectedIds];
    clone[index] = value;
    onChange(clone);
  };

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">Comparer</p>
        <p className="text-base text-white/80">Choisis deux établissements à mettre face-à-face.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1].map((slot) => (
          <label key={slot} className="text-sm text-white/80">
            {slot === 0 ? "Établissement A" : "Établissement B"}
            <select
              value={selectedIds[slot]}
              onChange={(event) => handleSelect(slot, event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white"
            >
              {institutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="text-xs text-white/60">
        Astuce : ajoute ton propre lycée via le formulaire “Mon établissement” puis sélectionne-le ici.
      </div>
    </div>
  );
}

export default InstitutionSelector;


