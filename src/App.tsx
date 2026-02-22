import { useEffect, useMemo, useState } from "react";
import { Heart, Sparkles, NotebookText } from "lucide-react";

import DecreaseCalculator from "./components/DecreaseCalculator";
import { ProjectsPage } from "./components/ProjectsPage";
import type { Project } from "./types/project";

const STORAGE_KEY = "strikketeller:v1";
const STORAGE_PROJECTS_KEY = "strikketeller:projects:v1";
const STORAGE_ACTIVE_PROJECT_KEY = "strikketeller:activeProjectId:v1";

type Tab = "counter" | "decrease" | "projects";

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function loadProjects(): Project[] {
  const raw = localStorage.getItem(STORAGE_PROJECTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

export default function App() {
  const [tab, setTab] = useState<Tab>("counter");

  // Omganger
  const [count, setCount] = useState<number>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(count));
  }, [count]);

  const dec = () => setCount((prev) => (prev > 0 ? prev - 1 : 0));
  const inc = () => setCount((prev) => prev + 1);
  const reset = () => setCount(0);

  // Prosjekt
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_ACTIVE_PROJECT_KEY) ?? "";
  });

  const safeActiveProjectId = useMemo(() => {
    if (projects.some((p) => p.id === activeProjectId)) return activeProjectId;
    return projects[0]?.id ?? "";
  }, [projects, activeProjectId]);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === safeActiveProjectId) ?? null,
    [projects, safeActiveProjectId],
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ACTIVE_PROJECT_KEY, activeProjectId);
  }, [activeProjectId]);

  return (
    <div className="min-h-screen knit-bg text-stone-900">
      <main className="mx-auto w-full max-w-xl px-4 pb-24 pt-8 relative">
        {/* liten mjuk glød bak innhald */}
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-rose-200/20 blur-3xl" />

        <header className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-stone-200/70 bg-white/70 px-4 py-2 shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
            <span className="text-xl">🧶</span>
            <span className="text-sm font-semibold tracking-wide text-stone-700">
              Mine strikkeverktøy
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Kos deg med strikkinga 💛
          </h1>
          <p className="mt-2 text-stone-700">
            Omganger, felling og prosjekt – samla på ein stad.
          </p>

          <div className="mt-4">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-stone-200/70 bg-white/70 px-3 py-2 text-sm text-stone-700 shadow-[0_8px_18px_rgba(0,0,0,0.05)]">
              <span className="text-stone-500">Aktivt prosjekt:</span>
              <span className="font-semibold">
                {activeProject ? activeProject.name : "Ingen"}
              </span>
            </span>
          </div>
        </header>

        {/* COUNTER */}
        {tab === "counter" && (
          <section className="mt-8 rounded-[2rem] border border-stone-200/70 bg-white/75 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-stone-700">Omganger</h2>

              <button
                onClick={reset}
                className="rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-2 text-sm font-semibold text-stone-700
                           shadow-[0_8px_18px_rgba(0,0,0,0.06)] active:scale-[0.99] hover:bg-amber-50"
              >
                Reset
              </button>
            </div>

            <div className="mt-5 rounded-[2rem] bg-gradient-to-b from-white/80 to-amber-50/70 p-6 text-center border border-stone-200/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="text-xs uppercase tracking-wide text-stone-500">
                Teller
              </div>
              <div className="mt-2 text-7xl font-semibold tabular-nums text-stone-900">
                {count}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={dec}
                disabled={count === 0}
                className="h-16 rounded-[1.6rem] border border-stone-200/70 bg-white/85 text-3xl font-semibold text-stone-800
                           shadow-[0_10px_22px_rgba(0,0,0,0.06)] active:scale-[0.98] disabled:opacity-50
                           hover:bg-amber-50"
                aria-label="Minus én omgang"
              >
                −
              </button>

              <button
                onClick={inc}
                className="h-16 rounded-[1.6rem] bg-rose-500 text-3xl font-semibold text-white
                           shadow-[0_14px_26px_rgba(244,63,94,0.25)] active:scale-[0.98] hover:bg-rose-600"
                aria-label="Pluss én omgang"
              >
                +
              </button>
            </div>
          </section>
        )}

        {/* DECREASE */}
        {tab === "decrease" && (
          <div className="mt-8">
            <DecreaseCalculator />
          </div>
        )}

        {/* PROJECTS */}
        {tab === "projects" && (
          <div className="mt-8">
            <ProjectsPage
              projects={projects}
              activeProjectId={safeActiveProjectId}
              onAdd={(name, notes, startDate) => {
                const p: Project = {
                  id: makeId(),
                  name,
                  createdAt: Date.now(),
                  notes: notes ?? "",
                  startDate: startDate ?? "",
                };
                setProjects((prev) => [p, ...prev]);
                setActiveProjectId(p.id);
              }}
              onSelect={(id) => setActiveProjectId(id)}
              onDelete={(id) =>
                setProjects((prev) => prev.filter((p) => p.id !== id))
              }
              onUpdateNotes={(id, notes) => {
                setProjects((prev) =>
                  prev.map((p) => (p.id === id ? { ...p, notes } : p)),
                );
              }}
            />
          </div>
        )}
      </main>

      {/* Meny nedst (ekstra kos) */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto grid w-full max-w-xl grid-cols-3 gap-2 px-4 py-3">
          <TabButton
            active={tab === "counter"}
            onClick={() => setTab("counter")}
            label="Omganger"
            Icon={Heart}
          />
          <TabButton
            active={tab === "decrease"}
            onClick={() => setTab("decrease")}
            label="Felling"
            Icon={Sparkles}
          />
          <TabButton
            active={tab === "projects"}
            onClick={() => setTab("projects")}
            label="Prosjekt"
            Icon={NotebookText}
          />
        </div>
      </nav>
    </div>
  );
}

type TabButtonProps = {
  active: boolean;
  onClick: () => void;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

function TabButton({ active, onClick, label, Icon }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative flex flex-col items-center justify-center gap-1 rounded-[1.4rem] px-2 py-2",
        "transition active:scale-[0.98]",
        active
          ? "bg-rose-100 text-rose-900 shadow-[0_8px_18px_rgba(244,63,94,0.18)]"
          : "text-stone-700 hover:bg-amber-50",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {/* Indikator = liten rosa “stripe” som viser aktiv tab */}
      <span
        className={[
          "absolute top-0 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full",
          active ? "bg-rose-500" : "bg-transparent",
        ].join(" ")}
      />

      <Icon
        className={[
          "h-5 w-5 stroke-[1.6] transition",
          active ? "scale-110" : "",
        ].join(" ")}
      />

      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  );
}
