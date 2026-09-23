import { FAQ_GROUPS, FAQ_ITEMS } from "@/lib/faq-data";

/**
 * Built on <details>/<summary> rather than a button plus a CSS-collapsed panel.
 * The native element keeps a collapsed answer out of the accessibility tree and
 * out of the tab order, which a `grid-template-rows: 0fr` collapse does not — it
 * hides pixels while screen readers still announce every answer. It also makes
 * the component a server component, so the Q&A prose stays out of the bundle.
 */
export default function FaqGroups() {
  return (
    <section className="section-cream">
      <div className="container-site py-16 md:py-24">
        <nav className="flex flex-wrap gap-2 mb-12 md:mb-16" aria-label="Jump to a topic">
          {FAQ_GROUPS.map(({ id, name }) => (
            <a key={id} href={`#${id}`} className="jump-link">
              {name}
            </a>
          ))}
        </nav>

        <div className="grid lg:grid-cols-12 gap-x-16 gap-y-12">
          {FAQ_GROUPS.map(({ id, name }, groupIndex) => {
            const items = FAQ_ITEMS.filter((item) => item.group === name);
            return (
              <section
                key={id}
                id={id}
                className="lg:col-span-12 grid lg:grid-cols-12 gap-x-16 gap-y-4 scroll-mt-28"
              >
                <h2 className="lg:col-span-4 block-title lg:sticky lg:top-28 self-start">{name}</h2>
                <div className="lg:col-span-8">
                  {items.map(({ q, a }, i) => (
                    <details
                      key={q}
                      className="qa-item"
                      /* One answer starts open so the pattern is legible at a glance. */
                      open={groupIndex === 0 && i === 0}
                    >
                      <summary className="qa-q">
                        {q}
                        <span className="qa-mark" aria-hidden />
                      </summary>
                      <p className="qa-a">{a}</p>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
