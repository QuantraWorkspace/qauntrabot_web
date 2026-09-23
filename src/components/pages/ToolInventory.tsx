import BlockHead from "@/components/shared/BlockHead";

/**
 * An inventory, not a feature grid: each row says what the tool does, where it
 * runs and what you need to use it. `access` is stated plainly and never oversold.
 */
const TOOLS = [
  {
    id: "indicators",
    name: "TradingView indicators",
    text: "Session boxes, market structure and resting liquidity, drawn the way the education tracks teach them.",
    where: "TradingView",
    access: "Free, no account",
  },
  {
    id: "calendar",
    name: "Economic calendar",
    text: "High-impact releases with a line on why each one matters for the markets the desk tracks.",
    where: "Quantra web",
    access: "Free, no account",
  },
  {
    id: "risk",
    name: "Risk calculator",
    text: "Position size from account balance, stop distance and the percentage you are willing to lose.",
    where: "Quantra web",
    access: "Free, no account",
  },
  {
    id: "journal",
    name: "Trading journal",
    text: "A sheet for logging setup, execution and review, structured so your leaks show up as a pattern.",
    where: "Google Sheets or Excel",
    access: "Download",
  },
  {
    id: "checklists",
    name: "Pre- and post-trade checklists",
    text: "Two pages that sit beside the screen: what to confirm before entry, what to record after the exit.",
    where: "PDF",
    access: "Download",
  },
  {
    id: "dashboard",
    name: "Market dashboard",
    text: "The day's bias, active session and key events for Gold, Nasdaq, the dollar and Bitcoin in one view.",
    where: "Quantra dashboard",
    access: "Account needed",
  },
];

export default function ToolInventory() {
  return (
    <section className="section-cream">
      <div className="container-site py-16 md:py-24">
        <BlockHead
          title="What's in the box"
          lede="Six tools, each built because a step in the daily routine was taking longer than it should."
        />
        <div className="inv">
          <div className="inv-head">
            <span className="panel-label">Tool</span>
            <span className="panel-label">Where it runs</span>
            <span className="panel-label md:text-right">Access</span>
          </div>
          {TOOLS.map(({ id, name, text, where, access }) => (
            <div key={id} id={id} className="inv-row scroll-mt-28">
              <div className="min-w-0">
                <h3 className="inv-name">{name}</h3>
                <p className="inv-text">{text}</p>
              </div>
              <p className="inv-where">{where}</p>
              <span className="inv-state state-chip">{access}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Tools are added when a real gap shows up in the routine, which means this list grows slowly and
          nothing on it is there to pad the page.
        </p>
      </div>
    </section>
  );
}
