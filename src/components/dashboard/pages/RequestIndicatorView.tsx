"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Lightbulb } from "lucide-react";
import { getIndicators } from "@/lib/zentra/data";
import { useResource } from "@/lib/zentra/useResource";
import { useNow } from "@/lib/zentra/hooks";
import { RequestError, submitRequest, useIndicatorRequests } from "@/lib/zentra/indicator-requests";
import {
  DETAILS_MAX,
  DETAILS_MIN,
  REQUEST_MARKETS,
  TIMEFRAMES,
  TIMEFRAME_LABEL,
  TRADING_STYLES,
  validateRequestInput,
} from "@/lib/zentra/indicator-request-input";
import type { IndicatorRequest, MarketGroup, RequestMarket, Timeframe, TradingStyle } from "@/lib/zentra/types";
import { PageTitle, Section } from "@/components/dashboard/zentra/ui";
import RequestList, { RequestStepper } from "@/components/dashboard/zentra/RequestList";
import ChoiceGroup from "@/components/dashboard/zentra/ChoiceGroup";

type Errors = Partial<Record<"market" | "style" | "timeframes" | "details" | "form", string>>;

const MARKET_TO_GROUP: Partial<Record<RequestMarket, MarketGroup>> = { Gold: "Gold", Forex: "Forex", Nasdaq: "Nasdaq", Crypto: "Crypto" };

export default function RequestIndicatorView() {
  const now = useNow();
  const { requests, loading, error, retry, add } = useIndicatorRequests();
  const indicators = useResource(getIndicators);

  const [market, setMarket] = useState<RequestMarket | null>(null);
  const [style, setStyle] = useState<TradingStyle | null>(null);
  const [timeframes, setTimeframes] = useState<Timeframe[]>([]);
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<IndicatorRequest | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  /** Library indicators that already cover what's being asked for. */
  const suggestions = useMemo(() => {
    const group = market ? MARKET_TO_GROUP[market] : undefined;
    if (!group || !indicators.data) return [];
    return indicators.data.filter(
      (i) =>
        i.status !== "coming-soon" &&
        i.markets.includes(group) &&
        (timeframes.length === 0 || timeframes.some((t) => i.timeframes.includes(t))),
    );
  }, [market, timeframes, indicators.data]);

  const toggleTf = (t: Timeframe) => setTimeframes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const reset = () => {
    setMarket(null);
    setStyle(null);
    setTimeframes([]);
    setDetails("");
    setErrors({});
    setSubmitted(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = validateRequestInput({
      kind: "custom",
      market: market ?? undefined,
      style: style ?? undefined,
      timeframes,
      details,
    });
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const created = await submitRequest(result.value);
      add(created);
      setSubmitted(created);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (err) {
      const fields = err instanceof RequestError ? err.fields : undefined;
      setErrors({ ...(fields ?? {}), form: err instanceof Error ? err.message : "Could not submit your request." });
    } finally {
      setSubmitting(false);
    }
  };

  const detailsLen = details.trim().length;

  return (
    <div className="z-page">
      <PageTitle title="Request an Indicator" lede="Tell us what you want to trade and we'll help you find the right indicator." />

      <ol className="z-journey" aria-label="How requests work">
        <li>
          <b>1</b> Tell us your market, style and timeframe
        </li>
        <li>
          <b>2</b> The team reviews it
        </li>
        <li>
          <b>3</b> We match or build an indicator
        </li>
        <li>
          <b>4</b> It appears in My Indicators
        </li>
      </ol>

      <div className="z-split z-split--request">
        <div className="z-panel z-panel--pad">
          {submitted ? (
            <div ref={successRef} tabIndex={-1} className="z-success" role="status">
              <CheckCircle2 size={28} className="text-profit" aria-hidden />
              <h2 className="text-lg font-semibold text-foreground">Your indicator request has been submitted.</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                We&apos;ll review it and update the status here. Most requests are either matched to an existing indicator or
                scoped as a new one.
              </p>
              <RequestStepper status={submitted.status} />
              <div className="flex flex-wrap gap-2 mt-2">
                <button type="button" className="z-btn z-btn--ghost" onClick={reset}>
                  Send another request
                </button>
                <Link href="/dashboard/indicators/library" className="z-btn z-btn--ghost">
                  Browse the library
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
              <ChoiceGroup
                legend="Market"
                options={REQUEST_MARKETS}
                selected={market ? [market] : []}
                onToggle={setMarket}
                error={errors.market}
              />
              <ChoiceGroup
                legend="Trading style"
                options={TRADING_STYLES}
                selected={style ? [style] : []}
                onToggle={setStyle}
                error={errors.style}
              />
              <ChoiceGroup
                legend="Timeframe"
                options={TIMEFRAMES}
                selected={timeframes}
                onToggle={toggleTf}
                error={errors.timeframes}
                multiple
                format={(t) => TIMEFRAME_LABEL[t]}
              />

              {suggestions.length > 0 && (
                <div className="z-suggest">
                  <Lightbulb size={16} className="text-warning shrink-0 mt-0.5" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">These may already cover it:</p>
                    <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                      {suggestions.map((i) => (
                        <li key={i.id}>
                          <Link href={`/dashboard/indicators/${i.id}`} className="z-link inline-flex">
                            {i.name} <ArrowRight size={12} aria-hidden />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="z-field">
                <label htmlFor="req-details" className="z-field-label">
                  What do you need?
                </label>
                <textarea
                  id="req-details"
                  className="z-input z-textarea"
                  rows={5}
                  maxLength={DETAILS_MAX}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe the indicator or trading problem you're trying to solve."
                  aria-invalid={Boolean(errors.details) || undefined}
                  aria-describedby="req-details-hint"
                />
                <p id="req-details-hint" className={errors.details ? "z-field-error" : "z-meta"}>
                  {errors.details ?? (detailsLen < DETAILS_MIN ? `At least ${DETAILS_MIN} characters. The more specific, the better.` : `${detailsLen} / ${DETAILS_MAX}`)}
                </p>
              </div>

              {errors.form && (
                <p className="alert-error text-sm" role="alert">
                  {errors.form}
                </p>
              )}

              <button type="submit" className="z-btn z-btn--primary z-btn--lg w-full sm:w-fit" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
            </form>
          )}
        </div>

        <Section title="Your requests">
          <RequestList
            requests={requests}
            loading={loading}
            error={error}
            onRetry={retry}
            now={now}
            highlightId={submitted?.id}
          />
        </Section>
      </div>
    </div>
  );
}
