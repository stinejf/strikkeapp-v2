import { useState } from "react";
import type { Project } from "../types/project";

export function ProjectsPage({
  projects,
  activeProjectId,
  onAdd,
  onSelect,
  onDelete,
  onUpdateNotes,
}: {
  projects: Project[];
  activeProjectId: string;
  onAdd: (name: string, notes: string, startDate: string) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}) {
  const [name, setName] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [startDate, setStartDate] = useState("");

  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("nb-NO");
  };

  const notesPreview = (notes: string) => {
    const trimmed = notes.trim();
    if (!trimmed) return "";
    const firstLine = trimmed.split("\n")[0];
    return firstLine.length > 70 ? firstLine.slice(0, 70) + "…" : firstLine;
  };

  return (
    <section className="rounded-[2rem] border border-stone-200/70 bg-white/75 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
      <h2 className="text-xl font-semibold text-stone-900">Prosjekt</h2>
      <p className="mt-1 text-sm text-stone-700">
        Legg til prosjekt med startdato og notat. Trykk på prosjektet for å vise
        notatfeltet.
      </p>

      {/* Legg til prosjekt */}
      <div className="rounded-[2rem] border border-stone-200/70 bg-gradient-to-b from-white/80 to-amber-50/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <label className="text-sm font-semibold text-stone-700">
          Prosjektnamn
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="t.d. Genser til Emma"
            className="mt-2 w-full rounded-[1.4rem] border border-stone-200/70 bg-white/85 px-4 py-3
                       shadow-[0_8px_18px_rgba(0,0,0,0.06)]
                       focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:bg-rose-50"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-stone-700">
          Startdato
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2 w-full rounded-[1.4rem] border border-stone-200/70 bg-white/85 px-4 py-3
                       shadow-[0_8px_18px_rgba(0,0,0,0.06)]
                       focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:bg-rose-50"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-stone-700">
          Notat (valfritt)
          <textarea
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            rows={3}
            className="mt-2 w-full resize-none rounded-[1.4rem] border border-stone-200/70 bg-white/85 px-4 py-3
                       shadow-[0_8px_18px_rgba(0,0,0,0.06)]
                       focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:bg-rose-50"
          />
        </label>

        <button
          onClick={() => {
            const trimmedName = name.trim();
            if (!trimmedName) return;
            onAdd(trimmedName, newNotes, startDate);
            setName("");
            setNewNotes("");
            setStartDate("");
          }}
          className="mt-4 h-12 w-full rounded-[1.4rem] bg-rose-500 text-white font-semibold
                     shadow-[0_14px_26px_rgba(244,63,94,0.25)] active:scale-[0.99] hover:bg-rose-600"
        >
          Legg til prosjekt
        </button>
      </div>

      {/* Prosjektliste */}
      <div className="mt-6 space-y-2">
        {projects.map((p) => {
          const active = p.id === activeProjectId;
          const preview = notesPreview(p.notes);

          return (
            <div
              key={p.id}
              className={[
                "rounded-[1.6rem] border p-4 shadow-[0_10px_22px_rgba(0,0,0,0.05)]",
                active
                  ? "border-rose-200 bg-rose-100/60"
                  : "border-stone-200/70 bg-white/80",
              ].join(" ")}
            >
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => onSelect(p.id)}
                  className="flex-1 text-left"
                >
                  <div className="font-semibold text-stone-900">{p.name}</div>

                  {p.startDate && (
                    <div className="mt-1 text-xs text-stone-600">
                      Starta: {formatDate(p.startDate)}
                    </div>
                  )}

                  {!active && preview && (
                    <div className="mt-1 text-sm text-stone-700">{preview}</div>
                  )}

                  {!active && !preview && (
                    <div className="mt-1 text-xs text-stone-600">
                      Trykk for å skrive notat ✍️
                    </div>
                  )}
                </button>

                <button
                  onClick={() => onDelete(p.id)}
                  className="rounded-[1.1rem] border border-stone-200/70 bg-white/85 px-3 py-2 text-sm font-semibold text-stone-700
                             shadow-[0_8px_18px_rgba(0,0,0,0.06)] hover:bg-amber-50 active:scale-[0.99]"
                >
                  Slett
                </button>
              </div>

              {/* Notatfelt under tittelen når aktiv */}
              {active && (
                <div className="mt-3">
                  <label className="text-xs font-semibold text-stone-700">
                    Notat
                  </label>
                  <textarea
                    value={p.notes}
                    onChange={(e) => onUpdateNotes(p.id, e.target.value)}
                    rows={5}
                    className="mt-2 w-full resize-none rounded-[1.4rem] border border-stone-200/70 bg-white/85 px-4 py-3 text-sm
                               shadow-[0_8px_18px_rgba(0,0,0,0.06)]
                               focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:bg-rose-50"
                  />
                  <div className="mt-2 text-xs text-stone-600">
                    Notat blir lagra automatisk 💾
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
