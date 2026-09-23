export type FaqGroup = "Getting started" | "Licensing" | "Running the EA" | "Performance and risk";

export type FaqItem = { q: string; a: string; group: FaqGroup };

export const FAQ_GROUPS: { id: string; name: FaqGroup }[] = [
  { id: "getting-started", name: "Getting started" },
  { id: "licensing", name: "Licensing" },
  { id: "running", name: "Running the EA" },
  { id: "risk", name: "Performance and risk" },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    group: "Getting started",
    q: "Do I need to know how to code?",
    a: "No. The expert advisors ship as compiled MetaTrader 5 files and are configured from the inputs panel like any other EA. The algorithmic trading track explains the logic if you want to follow it, but nothing on the platform requires you to write code.",
  },
  {
    group: "Getting started",
    q: "Is there a free way to try this first?",
    a: "The market read, the TradingView indicators, the economic calendar, the risk calculator and the templates are free and need no account. The EA licence is paid, and it should run on a demo account before it points at real money.",
  },
  {
    group: "Getting started",
    q: "What do I actually get with an account?",
    a: "A free account adds the market dashboard, saves your place across the education tracks, and keeps your journal between sessions. Licences, EA downloads and the trading-account view live in the same dashboard once you buy one.",
  },
  {
    group: "Licensing",
    q: "Which brokers work?",
    a: "Any broker offering MetaTrader 5 with automated trading enabled. Spread and execution quality differ between brokers and will change your results, so test on your own broker's demo server rather than assuming another trader's numbers transfer.",
  },
  {
    group: "Licensing",
    q: "How is the licence delivered?",
    a: "After payment the key and the EA file appear in your dashboard under Licence. You bind the key to one MT5 account number yourself, so nothing is locked to hardware you might replace.",
  },
  {
    group: "Licensing",
    q: "Can I move a licence to another account?",
    a: "Yes, from the Licence page in your dashboard. Transfers are rate-limited so that one key stays bound to one live account at a time.",
  },
  {
    group: "Licensing",
    q: "What happens when a licence expires?",
    a: "The EA stops opening new positions. It does not close anything you already have open, so an expiry never liquidates a position out from under you — you keep manual control of whatever is running.",
  },
  {
    group: "Running the EA",
    q: "Does my computer have to stay switched on?",
    a: "MetaTrader has to be open and connected for the EA to act, so either the machine stays on or you run it on a VPS. Most people use a VPS, because a closed laptop is the most common reason an EA misses a session.",
  },
  {
    group: "Running the EA",
    q: "What happens after a MetaTrader or broker update?",
    a: "When a platform change breaks something, an updated build is published to your dashboard. Check there after any MetaTrader update and confirm the EA still attaches cleanly on demo before re-enabling live trading.",
  },
  {
    group: "Running the EA",
    q: "Can I run it on a different pair or timeframe?",
    a: "You can attach it anywhere, but the rules were built around one instrument and timeframe. Running it elsewhere is an untested strategy that happens to share a filename — treat it as a new thing to test, not as the same one.",
  },
  {
    group: "Performance and risk",
    q: "What returns should I expect?",
    a: "No figure is published, because none can be promised honestly. Numbers shown anywhere in the interface are illustrative examples of the layout rather than results, and they are labelled as such.",
  },
  {
    group: "Performance and risk",
    q: "What is the maximum drawdown?",
    a: "That depends on the risk settings you choose, not on the strategy alone. Risk per trade and the daily loss limit are yours to set and they are what bound your worst case. Run a month on demo at your intended settings to get your own number.",
  },
  {
    group: "Performance and risk",
    q: "Are results guaranteed?",
    a: "No. Trading carries a substantial risk of loss, and automation does not change that. An EA removes hesitation from execution; it cannot remove the possibility that a strategy stops working in a market that has moved on.",
  },
];
