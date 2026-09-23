import Image from "next/image";
import Link from "next/link";
import {
  FOOTER_COMPANY,
  FOOTER_PLATFORM,
  FOOTER_RESOURCES,
  SOCIAL_LINKS,
  type NavItem,
} from "@/lib/site-nav";

const COLUMNS: { title: string; links: NavItem[] }[] = [
  { title: "Platform", links: FOOTER_PLATFORM },
  { title: "Resources", links: FOOTER_RESOURCES },
  { title: "Company", links: FOOTER_COMPANY },
];

/**
 * Terms, Privacy and Risk Disclosure used to render here as plain text styled
 * like links, with no routes behind them. Dead labels are worse than none, so
 * they are removed until the pages exist — they need writing before launch, and
 * are a legal question rather than a content one.
 */

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black/30">
      <div className="container-site pt-16 pb-10 md:pt-20 md:pb-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-2 md:col-span-5 lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 w-fit cursor-pointer">
              <span className="brand-tile">
                <Image src="/logo/logo.png" alt="Quantra" width={18} height={18} className="object-contain" />
              </span>
              <span className="text-[0.9375rem] font-bold text-foreground">
                Quantra
              </span>
            </Link>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xs">
              Trading intelligence. Education. Community.
            </p>
          </div>

          <div className="col-span-2 md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {COLUMNS.map(({ title, links }) => (
              <div key={title} className="flex flex-col gap-4">
                <h4 className="panel-label">{title}</h4>
                <ul className="flex flex-col gap-2.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex flex-col gap-4">
              <h4 className="panel-label">Follow us</h4>
              <ul className="flex flex-col gap-2.5">
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {label}
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground/60" title="Coming soon">{label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col gap-6">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            Trading involves substantial risk and is not suitable for every investor. Nothing on
            Quantra is investment advice. Analysis, tools and automation are provided for
            educational purposes; past results do not guarantee future outcomes.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Quantra. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
