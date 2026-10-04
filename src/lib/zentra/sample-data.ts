/**
 * Sample content for reviewing the dashboard before the real feeds exist.
 *
 * Nothing here is market data, published news or a track record. It is
 * served only through `@/lib/zentra/data`, which never serves it in a
 * production build and labels it "Sample" wherever it renders. Timestamps are
 * built relative to `now` so the UI always reads as current.
 */
import type {
  CommunityPost,
  Course,
  CourseProgress,
  EconomicEvent,
  Indicator,
  IndicatorRequest,
  Lesson,
  MarketAsset,
  NewsArticle,
  QuizQuestion,
} from "./types";

const MIN = 60e3;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/** Deterministic walk so sparklines are stable between renders. */
function walk(seed: number, n: number, drift: number, start = 50): number[] {
  let v = start;
  return Array.from({ length: n }, (_, i) => {
    const x = Math.sin((i + 1) * 12.9898 * seed) * 43758.5453;
    v += (x - Math.floor(x) - 0.5) * 3 + drift;
    return Math.round(v * 100) / 100;
  });
}

export function sampleMarkets(): MarketAsset[] {
  return [
    { symbol: "XAUUSD", name: "Gold", group: "Gold", price: 2651.4, changePct: 0.62, bias: "bullish", history: walk(1.1, 32, 0.35), digits: 2 },
    { symbol: "NAS100", name: "Nasdaq 100", group: "Nasdaq", price: 20184.5, changePct: -0.31, bias: "neutral", history: walk(2.3, 32, -0.05), digits: 1 },
    { symbol: "EURUSD", name: "Euro / Dollar", group: "Forex", price: 1.0842, changePct: 0.18, bias: "bullish", history: walk(3.7, 32, 0.12), digits: 4 },
    { symbol: "GBPUSD", name: "Pound / Dollar", group: "Forex", price: 1.2716, changePct: -0.24, bias: "bearish", history: walk(4.1, 32, -0.22), digits: 4 },
    { symbol: "USDJPY", name: "Dollar / Yen", group: "Forex", price: 149.82, changePct: -0.47, bias: "bearish", history: walk(5.9, 32, -0.3), digits: 2 },
    { symbol: "BTCUSD", name: "Bitcoin", group: "Crypto", price: 67420, changePct: 1.84, bias: "bullish", history: walk(6.2, 32, 0.45), digits: 0 },
  ];
}

export function sampleIndicators(): Indicator[] {
  return [
    {
      id: "structure-map",
      name: "Zentra Structure Map",
      tagline: "Higher-timeframe structure and entry zones, drawn on your chart.",
      description:
        "Reads higher-timeframe structure first, then marks the fair value gaps and order blocks that line up with it on the lower timeframe — the same model taught in ICT Market Structure.",
      method: [
        "Sets directional bias from 1H and 4H market structure.",
        "Highlights fair value gaps and order blocks in the direction of that bias.",
        "Marks lower-timeframe breaks of structure as they happen.",
        "Shows the swing that would invalidate the current read.",
      ],
      markets: ["Gold", "Forex", "Nasdaq"],
      timeframes: ["5M", "15M", "1H"],
      platform: "TradingView",
      status: "active",
    },
    {
      id: "session-sweep",
      name: "Session Liquidity Sweep",
      tagline: "Flags when London or New York takes the Asian range and reverses.",
      description:
        "Marks the Asian session high and low, then watches the London and New York opens for a sweep of either side followed by a displacement back inside the range.",
      method: [
        "Draws the Asian range automatically each day.",
        "Detects a wick beyond the range during the London or New York killzone.",
        "Requires a close back inside the range with displacement.",
        "Targets the opposite side of the range.",
      ],
      markets: ["Gold", "Forex"],
      timeframes: ["5M", "15M"],
      platform: "TradingView",
      status: "active",
    },
    {
      id: "trend-compass",
      name: "Trend Compass",
      tagline: "One read on direction across four timeframes.",
      description:
        "Aligns 15M, 1H, 4H and daily trend into a single bias panel so you stop fighting the higher timeframe. It does not print entries; it tells you which side to look for them on.",
      method: [
        "Scores trend on each timeframe from swing structure and a 50/200 average filter.",
        "Combines the four scores into bullish, bearish or mixed.",
        "Highlights the timeframe that disagrees, so you know what could flip the bias.",
      ],
      markets: ["Gold", "Forex", "Nasdaq", "Crypto"],
      timeframes: ["15M", "1H", "4H", "D"],
      platform: "TradingView",
      status: "active",
    },
    {
      id: "news-volatility",
      name: "News Volatility Guard",
      tagline: "Shades the chart around high-impact releases.",
      description:
        "Pulls the economic calendar onto your chart and shades the minutes around CPI, NFP, FOMC and other high-impact releases, so you know when spreads widen and setups are less reliable.",
      method: [
        "Marks each scheduled high- and medium-impact event on the chart.",
        "Shades a configurable window before and after the release.",
        "Lists the release, forecast and previous figure on hover.",
      ],
      markets: ["Gold", "Forex", "Nasdaq", "USD"],
      timeframes: ["1M", "5M", "15M"],
      platform: "TradingView",
      status: "beta",
    },
    {
      id: "crypto-momentum",
      name: "Crypto Momentum Shift",
      tagline: "Momentum regime changes on BTC and ETH.",
      description:
        "Detects when momentum on Bitcoin and Ethereum flips from expansion to contraction on the 4H and daily, the point where trend trades usually stop working.",
      method: [
        "Measures momentum expansion against a rolling baseline.",
        "Flags regime changes only after a candle close.",
        "Pairs each flag with the level that would invalidate it.",
      ],
      markets: ["Crypto"],
      timeframes: ["4H", "D"],
      platform: "TradingView",
      status: "coming-soon",
    },
  ];
}

/** Indicators on the sample member's account. */
export const SAMPLE_OWNED_INDICATOR_IDS = ["structure-map", "session-sweep", "trend-compass"];

export function sampleNews(now = Date.now()): NewsArticle[] {
  return [
    {
      id: "fed-restrictive",
      kind: "news",
      headline: "Fed keeps a restrictive stance as core inflation cools slowly",
      source: "Zentra Desk",
      publishedAt: new Date(now - 2 * HOUR),
      markets: ["USD", "Gold", "Nasdaq"],
      impact: "high",
      summary:
        "Officials signalled no rush to cut. The dollar firmed on the headline before gold buyers stepped back in at the 4H demand zone.",
      body: [
        "Policymakers held rates and repeated that they need more evidence that inflation is moving sustainably toward target before easing.",
        "For traders, the takeaway is that the path of cuts is still data-dependent. Each CPI and payrolls release carries more weight than usual, and the dollar reacts quickly to any surprise.",
        "Gold dipped on the initial dollar strength but found buyers at the 4H demand zone, which is typical when the statement repeats rather than shifts guidance.",
      ],
    },
    {
      id: "cpi-preview",
      kind: "analysis",
      headline: "CPI preview: what a hot or soft print means for gold and the dollar",
      source: "Zentra Desk",
      publishedAt: new Date(now - 5 * HOUR),
      markets: ["USD", "Gold", "Forex"],
      impact: "high",
      summary:
        "A 0.1 point surprise in core CPI has been enough to move gold 1% on release. We map the levels that matter on both outcomes.",
      body: [
        "Markets care about core CPI month-on-month more than the headline number, because it strips out energy and food.",
        "A hotter print pushes rate-cut expectations later, which tends to lift the dollar and weigh on gold and the Nasdaq. A softer print usually does the reverse.",
        "Spreads widen in the minutes around the release. If you trade it, size down and wait for the first 15-minute candle to close before trusting direction.",
      ],
    },
    {
      id: "boj-yen",
      kind: "news",
      headline: "Yen firms as Bank of Japan officials keep the door open to another hike",
      source: "Zentra Desk",
      publishedAt: new Date(now - 7 * HOUR),
      markets: ["Forex"],
      impact: "medium",
      summary:
        "USDJPY slipped below 150 after comments pointed to further normalisation if wage growth holds.",
      body: [
        "Comments from Bank of Japan officials suggested policy could tighten further if wage negotiations deliver.",
        "USDJPY broke below the 150 handle, a level that had held for most of the week. Watch whether it closes the day below it before treating the move as a trend change.",
      ],
    },
    {
      id: "nasdaq-earnings",
      kind: "analysis",
      headline: "Nasdaq holds its range into megacap earnings week",
      source: "Zentra Desk",
      publishedAt: new Date(now - 11 * HOUR),
      markets: ["Nasdaq"],
      impact: "medium",
      summary:
        "Index futures have spent five sessions inside a 250-point range. Earnings are the likely catalyst for a break.",
      body: [
        "The Nasdaq 100 has respected the same range for a week, with sellers active at the prior-day high.",
        "Earnings from the largest index weights land this week. Until one of them breaks the range, fading the edges has worked better than chasing breakouts.",
      ],
    },
    {
      id: "btc-flows",
      kind: "news",
      headline: "Bitcoin pushes back above its 50-day average on steady spot demand",
      source: "Zentra Desk",
      publishedAt: new Date(now - 15 * HOUR),
      markets: ["Crypto"],
      impact: "low",
      summary:
        "The move reclaims a level that capped price for three weeks. Higher lows on the daily keep the structure constructive.",
      body: [
        "Bitcoin reclaimed its 50-day moving average after three weeks below it.",
        "Daily structure is printing higher lows. A daily close back below the average would put the move in doubt.",
      ],
    },
    {
      id: "gold-weekly",
      kind: "analysis",
      headline: "Gold weekly outlook: buyers defend the 4H FVG again",
      source: "Zentra Desk",
      publishedAt: new Date(now - 1 * DAY - 2 * HOUR),
      markets: ["Gold", "USD"],
      impact: "medium",
      summary:
        "Structure stays bullish while price holds above the last higher low. The next liquidity sits above the weekly high.",
      body: [
        "Gold has now respected the same 4H fair value gap three times this month, which keeps the higher-timeframe bias bullish.",
        "The obvious liquidity is resting above the weekly high. A sweep of that level followed by a close back below it would be the first warning that buyers are exhausted.",
        "Invalidation for the bullish view is a 4H close below the last higher low.",
      ],
    },
  ];
}

function todayAtUtc(now: number, hour: number, minute = 0, dayOffset = 0): Date {
  const d = new Date(now);
  d.setUTCHours(hour, minute, 0, 0);
  return new Date(d.getTime() + dayOffset * DAY);
}

export function sampleEvents(now = Date.now()): EconomicEvent[] {
  return [
    { id: "ev-cpi", at: todayAtUtc(now, 12, 30), event: "CPI (MoM)", currency: "USD", impact: "high", forecast: "0.2%", previous: "0.3%", whyItMatters: "The main inflation read. It shifts rate-cut expectations and usually moves the dollar, gold and the Nasdaq within seconds.", affects: ["XAUUSD", "NAS100", "EURUSD"] },
    { id: "ev-core-cpi", at: todayAtUtc(now, 12, 30), event: "Core CPI (MoM)", currency: "USD", impact: "high", forecast: "0.3%", previous: "0.3%", whyItMatters: "Excludes food and energy. The Fed watches it more closely than the headline, so surprises here matter most.", affects: ["XAUUSD", "NAS100", "USDJPY"] },
    { id: "ev-fed-speech", at: todayAtUtc(now, 14, 0), event: "Fed Chair Speech", currency: "USD", impact: "medium", whyItMatters: "Tone on the pace of cuts can move the dollar, especially if it contradicts what the CPI print implies.", affects: ["XAUUSD", "EURUSD", "USDJPY"] },
    { id: "ev-uk-gdp", at: todayAtUtc(now, 6, 0), event: "GDP (MoM)", currency: "GBP", impact: "medium", forecast: "0.1%", previous: "0.0%", actual: "0.2%", whyItMatters: "A read on UK growth that feeds into Bank of England expectations.", affects: ["GBPUSD"] },
    { id: "ev-ecb", at: todayAtUtc(now, 12, 15, 1), event: "ECB Rate Decision", currency: "EUR", impact: "high", forecast: "3.25%", previous: "3.50%", whyItMatters: "Sets the euro's rate differential against the dollar. The press conference 30 minutes later often matters more than the decision.", affects: ["EURUSD"] },
    { id: "ev-claims", at: todayAtUtc(now, 12, 30, 1), event: "Initial Jobless Claims", currency: "USD", impact: "low", forecast: "225K", previous: "231K", whyItMatters: "A weekly labour-market read. Usually minor unless it breaks a trend.", affects: ["EURUSD", "XAUUSD"] },
    { id: "ev-ppi", at: todayAtUtc(now, 12, 30, 2), event: "PPI (MoM)", currency: "USD", impact: "medium", forecast: "0.2%", previous: "0.1%", whyItMatters: "Producer prices can lead consumer inflation. A hot print reinforces a hot CPI.", affects: ["XAUUSD", "NAS100"] },
  ];
}


/** Self-check questions, keyed by lesson id. Lessons without an entry skip the quiz. */
const QUIZZES: Record<string, QuizQuestion[]> = {
  "ms-1": [
    { question: "What makes a swing high valid?", options: ["Any candle with a long upper wick", "A high with a lower high on each side of it", "The highest close of the day"], answer: 1, explanation: "A swing high needs lower highs either side — otherwise it's just a candle in a trend." },
    { question: "When the 4H and 15M structure disagree, which leads?", options: ["The 15M, because it's more recent", "Whichever moved last", "The 4H"], answer: 2, explanation: "Higher-timeframe structure outranks the lower one; the lower timeframe is for timing." },
  ],
  "ms-2": [
    { question: "The first break against an established trend is called…", options: ["A break of structure", "A change of character", "A liquidity sweep"], answer: 1, explanation: "A change of character is the first sign the trend may be turning; a break of structure continues it." },
    { question: "What confirms a break?", options: ["A wick through the level", "A candle body close beyond it", "Volume above average"], answer: 1, explanation: "Wait for a body close. Wicks through a level are often sweeps, not breaks." },
  ],
  "ms-3": [
    { question: "Where do stop orders tend to cluster?", options: ["Above equal highs and below equal lows", "At round-number prices only", "In the middle of a range"], answer: 0, explanation: "Equal highs and lows are obvious places for stops, which makes them liquidity." },
    { question: "Price sweeps a high with no displacement afterwards. What is it?", options: ["A reversal signal on its own", "Not enough to act on alone", "A guaranteed continuation"], answer: 1, explanation: "A sweep without displacement is information, not a setup." },
  ],
  "ms-4": [
    { question: "A fair value gap is…", options: ["A gap between Friday close and Monday open", "A three-candle imbalance", "Any area of support"], answer: 1, explanation: "It's the space left when the middle candle moves so fast the wicks either side don't overlap." },
  ],
  "rm-1": [
    { question: "Your stop doubles in distance. To keep risk the same you…", options: ["Keep the same lot size", "Halve the position size", "Double the position size"], answer: 1, explanation: "Risk = size × stop distance. Twice the distance means half the size." },
    { question: "What do you decide first?", options: ["Lot size", "Risk per trade as a % of the account", "Take profit"], answer: 1, explanation: "Fix risk first; the position size falls out of the stop distance." },
  ],
  "rm-2": [
    { question: "After a 20% drawdown, what gain gets you back to even?", options: ["20%", "25%", "40%"], answer: 1, explanation: "80 × 1.25 = 100. Losses need proportionally larger gains to recover." },
  ],
  "fa-2": [
    { question: "Which CPI reading does the Fed watch most closely?", options: ["Headline CPI", "Core CPI", "Import prices"], answer: 1, explanation: "Core strips out volatile food and energy, so it says more about underlying inflation." },
    { question: "What does PPI measure?", options: ["Producer prices", "Payrolls", "Personal income"], answer: 0, explanation: "Producer prices, which can lead consumer inflation." },
  ],
  "ps-1": [
    { question: "When does rule-breaking happen most often?", options: ["Right after a loss", "At the start of the week", "After a news release"], answer: 0, explanation: "Most plan violations come straight after a loss, which is why a daily stop matters." },
  ],
};

export function sampleLessons(): Lesson[] {
  const lessons: Lesson[] = [
    { id: "ms-1", courseId: "ict-structure", title: "Swing highs, swing lows and why they matter", category: "ICT", minutes: 9, summary: "How to mark the swings that actually define structure, and ignore the ones that don't.", keyPoints: ["A swing high needs a lower high on each side of it.", "Only mark swings that price has reacted from.", "Structure on the higher timeframe outranks the lower one."] },
    { id: "ms-2", courseId: "ict-structure", title: "Break of structure vs change of character", category: "ICT", minutes: 12, summary: "The difference between trend continuation and the first sign of a reversal.", keyPoints: ["A break of structure continues the existing trend.", "A change of character is the first break against it.", "Wait for a candle body close, not a wick, to confirm either."] },
    { id: "ms-3", courseId: "ict-structure", title: "Liquidity & market structure", category: "ICT", minutes: 14, summary: "Where resting orders sit, why price reaches for them, and how that shapes the next leg.", keyPoints: ["Equal highs and lows are obvious stop clusters.", "Price often sweeps liquidity before reversing.", "A sweep without displacement is not a signal on its own."] },
    { id: "ms-4", courseId: "ict-structure", title: "Fair value gaps and order blocks", category: "ICT", minutes: 13, summary: "The two entry zones the ICT model is built on, and how to grade them.", keyPoints: ["A fair value gap is a three-candle imbalance.", "Gaps created with displacement are higher quality.", "An order block is the last opposing candle before the move."] },
    { id: "ms-5", courseId: "ict-structure", title: "Putting it together: a full trade plan", category: "ICT", minutes: 16, summary: "From higher-timeframe bias to entry, stop and target on one chart.", keyPoints: ["Bias from 4H, entry from 15M or lower.", "Stop beyond the swing that invalidates the idea.", "Target the next pool of liquidity, not a round number."] },

    { id: "rm-1", courseId: "risk-basics", title: "Position size from stop distance", category: "Risk Management", minutes: 8, summary: "Size every trade so a stop-out costs the same fixed share of the account.", keyPoints: ["Decide risk per trade first, usually 0.5–1%.", "Lot size = risk amount ÷ (stop distance × value per point).", "A wider stop means a smaller position, not more risk."] },
    { id: "rm-2", courseId: "risk-basics", title: "What a losing streak does to an account", category: "Risk Management", minutes: 10, summary: "Why drawdowns take longer to recover from than they took to create.", keyPoints: ["A 20% drawdown needs a 25% gain to recover.", "Streaks of five or more losses are normal even with an edge.", "Cap daily loss so one bad session cannot compound."] },
    { id: "rm-3", courseId: "risk-basics", title: "Reading risk-to-reward honestly", category: "Risk Management", minutes: 7, summary: "RR only means something next to how often the target is reached.", keyPoints: ["A 1:3 trade that rarely hits its target is not better than a 1:1.5 that often does.", "Measure RR from your real entry, not the best price in the zone.", "Move the stop for a reason, never to avoid a loss."] },

    { id: "fa-1", courseId: "macro-basics", title: "How interest rates move currencies", category: "Fundamentals", minutes: 11, summary: "Rate differentials and why the dollar reacts to every Fed comment.", keyPoints: ["Capital flows toward higher expected real yields.", "Markets trade expectations, so the surprise matters, not the level.", "Guidance can move price more than the decision itself."] },
    { id: "fa-2", courseId: "macro-basics", title: "CPI, NFP and PPI: what each release tells you", category: "Fundamentals", minutes: 12, summary: "The three US releases that move gold and the dollar most, and how to read them.", keyPoints: ["CPI measures consumer inflation; core excludes food and energy.", "NFP is the monthly jobs count; wages matter as much as the headline.", "PPI measures producer prices and can lead CPI."] },

    { id: "ta-1", courseId: "chart-foundations", title: "Support, resistance and why levels fail", category: "Technical Analysis", minutes: 9, summary: "Levels are zones where orders cluster, not lines price must respect.", keyPoints: ["Mark zones from wicks and bodies, not single prices.", "Each retest weakens a level.", "A clean break and retest flips support into resistance."] },
    { id: "ta-2", courseId: "chart-foundations", title: "Multi-timeframe analysis", category: "Technical Analysis", minutes: 10, summary: "Top-down reading so your entry agrees with the bigger picture.", keyPoints: ["Use a factor of four to six between timeframes.", "Direction from the higher timeframe, timing from the lower.", "When timeframes disagree, stand aside or size down."] },
    { id: "bg-1", courseId: "chart-foundations", title: "Reading a candlestick chart", category: "Beginner", minutes: 6, summary: "Open, high, low, close, and what a candle's shape says about who won the period.", keyPoints: ["The body is open to close; wicks show rejected prices.", "Long wicks at a level signal rejection.", "One candle is a clue, not a signal."] },

    { id: "ps-1", courseId: "trader-mindset", title: "Following your plan on the hard days", category: "Psychology", minutes: 8, summary: "The specific moments discipline breaks, and routines that hold up under pressure.", keyPoints: ["Most rule-breaking happens right after a loss.", "Write the plan before the session, not during it.", "A daily stop protects your judgement as much as your account."] },
    { id: "ps-2", courseId: "trader-mindset", title: "Keeping a trading journal that helps", category: "Psychology", minutes: 7, summary: "What to record so your review turns into better decisions.", keyPoints: ["Log the reason for entry before the result is known.", "Screenshot the chart at entry and exit.", "Review weekly, looking for repeated mistakes rather than single trades."] },
  ];
  return lessons.map((l) => (QUIZZES[l.id] ? { ...l, quiz: QUIZZES[l.id] } : l));
}

export function sampleCourses(): Course[] {
  return [
    { id: "chart-foundations", title: "Chart Foundations", category: "Beginner", level: "Beginner", description: "Candles, levels and timeframes — the reading skills every other course assumes.", lessonIds: ["bg-1", "ta-1", "ta-2"] },
    { id: "risk-basics", title: "Risk Management Essentials", category: "Risk Management", level: "Beginner", description: "Size positions, survive losing streaks and read risk-to-reward honestly.", lessonIds: ["rm-1", "rm-2", "rm-3"] },
    { id: "ict-structure", title: "ICT Market Structure", category: "ICT", level: "Intermediate", description: "Swings, liquidity, fair value gaps and order blocks — the core of the ICT model.", lessonIds: ["ms-1", "ms-2", "ms-3", "ms-4", "ms-5"] },
    { id: "macro-basics", title: "Macro for Traders", category: "Fundamentals", level: "Intermediate", description: "Rates, inflation and jobs data, and the path each takes before it shows up in price.", lessonIds: ["fa-1", "fa-2"] },
    { id: "trader-mindset", title: "The Trader's Mindset", category: "Psychology", level: "Beginner", description: "Routines and review habits that keep you on plan when it matters.", lessonIds: ["ps-1", "ps-2"] },
  ];
}

/** Recommended order for the learning path. */
export const SAMPLE_LEARNING_PATH = ["chart-foundations", "risk-basics", "ict-structure", "macro-basics", "trader-mindset"];

export function sampleProgress(): CourseProgress[] {
  return [
    { courseId: "chart-foundations", completedLessonIds: ["bg-1", "ta-1", "ta-2"], currentLessonId: "ta-2" },
    { courseId: "risk-basics", completedLessonIds: ["rm-1"], currentLessonId: "rm-2" },
    { courseId: "ict-structure", completedLessonIds: ["ms-1", "ms-2"], currentLessonId: "ms-3" },
  ];
}

export function samplePosts(now = Date.now()): CommunityPost[] {
  return [
    { id: "p-1", author: { name: "Dara K.", handle: "darak" }, topic: "Setups", symbol: "XAUUSD", body: "Gold rejected the 4H FVG exactly like the example in the market structure course. Marked the sweep low as invalidation and watched it play out into the London session.", chart: { points: walk(7.3, 28, 0.4), label: "XAUUSD · 15M" }, likes: 24, comments: [{ author: "Sophea M.", body: "Same read. The 4H gap has held three times now." }, { author: "Liam T.", body: "Nice — did you wait for the BOS or enter at the gap?" }], createdAt: new Date(now - 35 * MIN) },
    { id: "p-2", author: { name: "Sophea M.", handle: "sophea" }, topic: "Macro", body: "Reminder: CPI at 12:30 UTC. I'm flat into the release and only looking at the first 15M close after. Spreads on gold get silly in that first minute.", likes: 17, comments: [{ author: "Rith P.", body: "Same. Learned that one the expensive way." }], createdAt: new Date(now - 2 * HOUR) },
    { id: "p-3", author: { name: "Liam T.", handle: "liamt" }, topic: "Psychology", body: "Three losses in a row this morning, all valid setups. Hit my daily stop and closed the platform. Journal says this happens roughly once a month — it's the rule that keeps it at once a month.", likes: 41, comments: [], createdAt: new Date(now - 5 * HOUR) },
    { id: "p-4", author: { name: "Rith P.", handle: "rithp" }, topic: "Setups", symbol: "EURUSD", body: "London swept the Asian low on EURUSD right on the open. Waiting for the 1H close back in the range before reading anything into it.", chart: { points: walk(8.8, 28, 0.2), label: "EURUSD · 1H" }, likes: 12, comments: [{ author: "Dara K.", body: "Watching the same one." }], createdAt: new Date(now - 7 * HOUR) },
  ];
}

export function sampleThreads(now = Date.now()): CommunityPost[] {
  return [
    { id: "t-1", author: { name: "Chan V.", handle: "chanv" }, topic: "Education", thread: { title: "How do you grade a fair value gap before entering?" }, body: "I get a lot of FVG entries that just run through. Curious what everyone checks before trusting one — displacement, timeframe, location in the range?", likes: 32, comments: [{ author: "Sophea M.", body: "Displacement first. If the candle that made the gap wasn't decisive, I skip it." }, { author: "Dara K.", body: "Location. Discount for buys, premium for sells, otherwise pass." }, { author: "Liam T.", body: "And higher-timeframe agreement. A 5M gap against the 4H trend is a coin flip." }], createdAt: new Date(now - 3 * HOUR) },
    { id: "t-2", author: { name: "Nita S.", handle: "nitas" }, topic: "Psychology", thread: { title: "What does your pre-session routine look like?" }, body: "Trying to build a proper routine instead of opening the chart and reacting. Share yours?", likes: 21, comments: [{ author: "Rith P.", body: "Calendar, higher-timeframe bias, mark three levels, done. Ten minutes." }], createdAt: new Date(now - 9 * HOUR) },
    { id: "t-3", author: { name: "Liam T.", handle: "liamt" }, topic: "Macro", thread: { title: "Trading gold around FOMC — worth it?" }, body: "Every FOMC I either sit out or get chopped. Is anyone consistently trading the release, or is it better to wait for the next session?", likes: 15, comments: [{ author: "Sophea M.", body: "I wait for the press conference to finish. The statement move reverses too often." }], createdAt: new Date(now - 1 * DAY) },
    { id: "t-4", author: { name: "Dara K.", handle: "darak" }, topic: "Setups", thread: { title: "Session Sweep on Nasdaq?" }, body: "Has anyone tried the Session Sweep logic on NAS100? The indicator is Gold/Forex only but the idea seems to translate.", likes: 9, comments: [], createdAt: new Date(now - 2 * DAY) },
  ];
}

export function sampleRequests(now = Date.now()): IndicatorRequest[] {
  return [
    {
      id: "req-sample-1",
      kind: "custom",
      market: "Gold",
      style: "Intraday",
      timeframes: ["15M", "1H"],
      details: "An alert when gold sweeps the previous day's high or low during New York and closes back inside.",
      status: "REVIEWING",
      createdAt: new Date(now - 3 * DAY),
      updatedAt: new Date(now - 1 * DAY),
    },
  ];
}
