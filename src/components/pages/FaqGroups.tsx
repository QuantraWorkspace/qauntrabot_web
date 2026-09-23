"use client";

import { useState } from "react";
import { FAQ_GROUPS, FAQ_ITEMS } from "@/lib/faq-data";

export default function FaqGroups() {
  const [open, setOpen] = useState<string | null>(FAQ_ITEMS[0].q);

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
          {FAQ_GROUPS.map(({ id, name }) => {
            const items = FAQ_ITEMS.filter((item) => item.group === name);
            return (
              <section key={id} id={id} className="lg:col-span-12 grid lg:grid-cols-12 gap-x-16 gap-y-4 scroll-mt-28">
                <h2 className="lg:col-span-4 block-title lg:sticky lg:top-28 self-start">{name}</h2>
                <div className="lg:col-span-8">
                  {items.map(({ q, a }) => {
                    const isOpen = open === q;
                    return (
                      <div key={q} className="qa-item">
                        <button
                          type="button"
                          className="qa-q"
                          aria-expanded={isOpen}
                          onClick={() => setOpen(isOpen ? null : q)}
                        >
                          {q}
                          <span className="qa-mark" aria-hidden />
                        </button>
                        <div className="qa-a" data-open={isOpen}>
                          <div>
                            <p>{a}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
