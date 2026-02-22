import { useState } from "react";

export default function DecreaseCalculator() {
  const [start, setStart] = useState<number>(60);
  const [end, setEnd] = useState<number>(44);

  const decreases = start - end;

  const isValid =
    Number.isFinite(start) &&
    Number.isFinite(end) &&
    start > 0 &&
    end >= 0 &&
    start > end &&
    decreases > 0;

  const plan = isValid ? buildPlan(start, decreases) : null;

  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-stone-900">Fellekalkulator</h2>

      <p className="mt-1 text-sm text-stone-700">
        Skriv inn start og slutt, så får du eit koseleg og enkelt forslag.
      </p>

      {/* Inputfelt */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-stone-700">
          Startmasker
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            type="number"
            min={0}
            step={1}
            value={start}
            onChange={(e) =>
              setStart(Math.max(0, Math.trunc(Number(e.target.value))))
            }
            className="mt-2 w-full rounded-[1.4rem] border border-stone-200/70 bg-white/85 px-4 py-3 text-lg
                       shadow-[0_8px_18px_rgba(0,0,0,0.06)]
                       focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:bg-rose-50"
          />
        </label>

        <label className="text-sm font-semibold text-stone-700">
          Sluttmasker
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            type="number"
            min={0}
            step={1}
            value={end}
            onChange={(e) =>
              setEnd(Math.max(0, Math.trunc(Number(e.target.value))))
            }
            className="mt-2 w-full rounded-[1.4rem] border border-stone-200/70 bg-white/85 px-4 py-3 text-lg
                       shadow-[0_8px_18px_rgba(0,0,0,0.06)]
                       focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:bg-rose-50"
          />
        </label>
      </div>

      {/* Resultat */}
      {isValid && plan ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-[1.6rem] border border-stone-200/70 bg-gradient-to-b from-white/80 to-amber-50/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="text-sm text-stone-600">Du må felle</div>
            <div className="mt-1 text-4xl font-semibold tabular-nums text-stone-900">
              {decreases}
              <span className="ml-2 text-base font-medium text-stone-600">
                masker
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-200/70 bg-white/80 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <div className="text-sm font-semibold text-stone-700">
              Forslag (strikk, fell)
            </div>

            {plan.r === 0 ? (
              <div className="mt-3 rounded-[1.6rem] bg-rose-100/70 p-4 shadow-[0_10px_22px_rgba(244,63,94,0.10)]">
                <div className="text-2xl font-semibold text-stone-900">
                  Strikk {plan.q - 1}, fell 1
                </div>
                <div className="mt-1 text-sm text-stone-700">
                  Gjenta × {decreases}
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <div className="rounded-[1.6rem] bg-rose-100/70 p-4 shadow-[0_10px_22px_rgba(244,63,94,0.10)]">
                  <div className="text-2xl font-semibold text-stone-900">
                    Strikk {plan.q}, fell 1
                  </div>
                  <div className="mt-1 text-sm text-stone-700">
                    Gjenta × {plan.r}
                  </div>
                </div>

                <div className="rounded-[1.6rem] bg-white/80 p-4 border border-stone-200/70 shadow-[0_8px_18px_rgba(0,0,0,0.05)]">
                  <div className="text-2xl font-semibold text-stone-900">
                    Strikk {plan.q - 1}, fell 1
                  </div>
                  <div className="mt-1 text-sm text-stone-700">
                    Gjenta × {decreases - plan.r}
                  </div>
                </div>

                <p className="text-sm text-stone-600">
                  Tips: Sprei dei lengre intervalla jamt utover omgongen.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-6 text-stone-700">
          Sluttmasker må vere mindre enn startmasker.
        </p>
      )}
    </section>
  );
}

function buildPlan(start: number, decreases: number) {
  const q = Math.floor(start / decreases);
  const r = start % decreases;
  return { q, r };
}
