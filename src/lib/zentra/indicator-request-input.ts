import type { IndicatorRequest, RequestMarket, Timeframe, TradingStyle } from "./types";

export const REQUEST_MARKETS: RequestMarket[] = ["Gold", "Forex", "Nasdaq", "Crypto", "Other"];
export const TRADING_STYLES: TradingStyle[] = ["Scalping", "Intraday", "Swing"];
export const TIMEFRAMES: Timeframe[] = ["1M", "5M", "15M", "1H", "4H", "D"];
export const TIMEFRAME_LABEL: Record<Timeframe, string> = {
  "1M": "1M",
  "5M": "5M",
  "15M": "15M",
  "1H": "1H",
  "4H": "4H",
  D: "Daily",
};

export const DETAILS_MIN = 20;
export const DETAILS_MAX = 2000;

export type IndicatorRequestInput = {
  kind: "access" | "custom";
  indicatorId?: string;
  indicatorName?: string;
  market?: RequestMarket;
  style?: TradingStyle;
  timeframes?: Timeframe[];
  details?: string;
};

export type ValidRequest = Pick<
  IndicatorRequest,
  "kind" | "indicatorId" | "indicatorName" | "market" | "style" | "timeframes" | "details"
>;

/** Shared by the form and the API route, so both reject the same input. */
export function validateRequestInput(
  input: IndicatorRequestInput,
): { ok: true; value: ValidRequest } | { ok: false; errors: Partial<Record<"market" | "style" | "timeframes" | "details" | "indicatorId", string>> } {
  const errors: Partial<Record<"market" | "style" | "timeframes" | "details" | "indicatorId", string>> = {};
  const details = (input.details ?? "").trim();
  const timeframes = (input.timeframes ?? []).filter((t): t is Timeframe => TIMEFRAMES.includes(t));

  if (input.kind === "access") {
    if (!input.indicatorId || !/^[a-z0-9-]{1,64}$/.test(input.indicatorId)) {
      errors.indicatorId = "Choose an indicator.";
    }
    if (details.length > DETAILS_MAX) errors.details = `Keep it under ${DETAILS_MAX} characters.`;
  } else if (input.kind === "custom") {
    if (!input.market || !REQUEST_MARKETS.includes(input.market)) errors.market = "Choose a market.";
    if (!input.style || !TRADING_STYLES.includes(input.style)) errors.style = "Choose a trading style.";
    if (timeframes.length === 0) errors.timeframes = "Choose at least one timeframe.";
    if (details.length < DETAILS_MIN) errors.details = `Tell us a bit more — at least ${DETAILS_MIN} characters.`;
    else if (details.length > DETAILS_MAX) errors.details = `Keep it under ${DETAILS_MAX} characters.`;
  } else {
    return { ok: false, errors: { details: "Unknown request type." } };
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      kind: input.kind,
      indicatorId: input.kind === "access" ? input.indicatorId : undefined,
      indicatorName: input.kind === "access" ? input.indicatorName?.slice(0, 120) : undefined,
      market: input.kind === "custom" ? input.market : undefined,
      style: input.kind === "custom" ? input.style : undefined,
      timeframes,
      details,
    },
  };
}
