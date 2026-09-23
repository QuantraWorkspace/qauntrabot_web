import Link from "next/link";

type Props = {
  /** One sentence naming what happens next on this page. */
  line: string;
  sub?: string;
  action: { label: string; href: string };
  secondary?: { label: string; href: string };
};

/**
 * Per-page closer. Each page ends by asking for the thing that page earned,
 * rather than repeating one site-wide call to action.
 */
export default function PageClose({ line, sub, action, secondary }: Props) {
  return (
    <section className="close-band">
      <div className="container-site">
        <div className="close-inner">
          <div>
            <p className="close-line">{line}</p>
            {sub && <p className="close-sub">{sub}</p>}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:shrink-0">
            <Link href={action.href} className="btn-primary-brand justify-center">
              {action.label}
            </Link>
            {secondary && (
              <Link href={secondary.href} className="btn-outline-brand justify-center">
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
