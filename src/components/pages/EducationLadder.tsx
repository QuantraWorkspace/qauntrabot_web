import BlockHead from "@/components/shared/BlockHead";
import { EDUCATION_TRACKS } from "@/lib/education-tracks";

export default function EducationLadder() {
  return (
    <section className="section-cream">
      <div className="container-site py-16 md:py-24">
        <BlockHead
          title="Six tracks, in this order"
          lede="Macro before charts, risk before automation. Each track assumes the one above it, which is why they are numbered."
        />
        <ol className="ladder">
          {EDUCATION_TRACKS.map(({ n, title, text, outcome }) => (
            <li key={n} className="rung">
              <span className="rung-mark">{n}</span>
              <div className="min-w-0">
                <h3 className="rung-title">{title}</h3>
                <p className="rung-text">{text}</p>
              </div>
              <p className="rung-outcome">
                <b>After this track</b>
                {outcome}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
