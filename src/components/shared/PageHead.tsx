import type { ReactNode } from "react";

export type PageHeadProps = {
  title: string;
  lede: string;
  /** Page-specific readout shown beside the headline on large screens. */
  aside?: ReactNode;
  /** Rendered under the lede — usually a single action. */
  children?: ReactNode;
};

/**
 * Inner-page header. Deliberately has no eyebrow and no tinted accent phrase:
 * the page is identified by its headline and by the readout it carries.
 */
export default function PageHead({ title, lede, aside, children }: PageHeadProps) {
  return (
    <header className="page-head">
      <div className="container-site">
        <div className={`page-head-inner ${aside ? "page-head-inner--split" : ""}`}>
          <div>
            <h1 className="page-head-title">{title}</h1>
            <p className="page-head-lede">{lede}</p>
            {children && <div className="mt-7">{children}</div>}
          </div>
          {aside && <div className="min-w-0">{aside}</div>}
        </div>
      </div>
    </header>
  );
}
