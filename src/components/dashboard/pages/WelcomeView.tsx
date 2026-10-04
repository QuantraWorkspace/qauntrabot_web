"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePreferences } from "@/lib/zentra/hooks";
import type { ExperienceLevel, LessonCategory, MarketGroup, Preferences } from "@/lib/zentra/types";
import ChoiceGroup from "@/components/dashboard/zentra/ChoiceGroup";
import { ProgressBar } from "@/components/dashboard/zentra/CourseProgressCard";

const MARKETS: MarketGroup[] = ["Gold", "Forex", "Nasdaq", "Crypto", "USD"];
const MARKET_LABEL: Record<MarketGroup, string> = { Gold: "Gold", Forex: "Forex", Nasdaq: "Nasdaq", Crypto: "Crypto", USD: "US Dollar" };
const MARKET_HINT: Record<MarketGroup, string> = {
  Gold: "XAUUSD",
  Forex: "EUR, GBP, JPY pairs",
  Nasdaq: "NAS100",
  Crypto: "BTC, ETH",
  USD: "DXY and the Fed",
};

const LEVELS: ExperienceLevel[] = ["Beginner", "Intermediate", "Advanced"];
const LEVEL_HINT: Record<ExperienceLevel, string> = {
  Beginner: "New to charts, or under a year trading",
  Intermediate: "Comfortable with structure; want consistency",
  Advanced: "Trading a model; here for macro and refinement",
};

const TOPICS: LessonCategory[] = ["Technical Analysis", "ICT", "Fundamentals", "Risk Management", "Psychology", "Beginner"];
const TOPIC_LABEL: Partial<Record<LessonCategory, string>> = { Beginner: "The basics" };

const STEPS = [
  { title: "Which markets do you trade?", lede: "We'll put their news, calendar events and prices first." },
  { title: "How much trading experience do you have?", lede: "This sets where your learning path starts." },
  { title: "What do you want to get better at?", lede: "Lessons on these topics move to the front of Up Next." },
];

export default function WelcomeView() {
  const router = useRouter();
  const { prefs, update } = usePreferences();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Preferences>(prefs);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const go = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const finish = (answers: Partial<Preferences>) => {
    update({ ...answers, done: true });
    router.push("/dashboard");
  };

  const canContinue = step === 0 ? draft.markets.length > 0 : step === 1 ? draft.level !== null : true;
  const last = step === STEPS.length - 1;

  return (
    <div className="z-page z-page--narrow">
      <div className="z-welcome">
        <div className="flex items-center gap-3">
          <ProgressBar pct={((step + 1) / STEPS.length) * 100} label="Setup progress" />
          <span className="z-meta shrink-0">
            {step + 1} of {STEPS.length}
          </span>
        </div>

        <div className="z-welcome-step" key={step}>
          <h1 ref={headingRef} tabIndex={-1} className="z-page-title outline-none">
            {STEPS[step].title}
          </h1>
          <p className="z-page-lede !mt-2">{STEPS[step].lede}</p>

          <div className="mt-6">
            {step === 0 && (
              <ChoiceGroup
                legend="Markets"
                options={MARKETS}
                selected={draft.markets}
                onToggle={(m) => setDraft((d) => ({ ...d, markets: toggle(d.markets, m) }))}
                multiple
                format={(m) => MARKET_LABEL[m]}
                hint={(m) => MARKET_HINT[m]}
              />
            )}
            {step === 1 && (
              <ChoiceGroup
                legend="Experience"
                options={LEVELS}
                selected={draft.level ? [draft.level] : []}
                onToggle={(l) => setDraft((d) => ({ ...d, level: l }))}
                hint={(l) => LEVEL_HINT[l]}
              />
            )}
            {step === 2 && (
              <ChoiceGroup
                legend="Topics"
                options={TOPICS}
                selected={draft.topics}
                onToggle={(t) => setDraft((d) => ({ ...d, topics: toggle(d.topics, t) }))}
                multiple
                format={(t) => TOPIC_LABEL[t] ?? t}
              />
            )}
          </div>
        </div>

        <div className="z-welcome-actions">
          {step > 0 ? (
            <button type="button" className="z-btn z-btn--ghost" onClick={() => go(step - 1)}>
              <ArrowLeft size={14} aria-hidden /> Back
            </button>
          ) : (
            <button type="button" className="z-link" onClick={() => finish({})}>
              Skip for now
            </button>
          )}
          <button
            type="button"
            className="z-btn z-btn--primary z-btn--lg"
            disabled={!canContinue}
            onClick={() => (last ? finish(draft) : go(step + 1))}
          >
            {last ? "Show my dashboard" : "Continue"} <ArrowRight size={14} aria-hidden />
          </button>
        </div>
        <p className="z-meta">Saved on this device. You can change these any time in Settings.</p>
      </div>
    </div>
  );
}
