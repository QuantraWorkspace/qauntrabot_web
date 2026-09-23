import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const SITE_NAME = "Quantra";

export const DEFAULT_TITLE = "Quantra — Algorithmic Trading, Education, Tools & Community";

export const DEFAULT_DESCRIPTION =
  "Quantra is a trader-first ecosystem for algorithmic trading: MT5 expert advisors, education, fundamental and technical market analysis, free TradingView indicators and a community of traders.";

export const DEFAULT_KEYWORDS = [
  "trading education",
  "market analysis",
  "TradingView indicators",
  "trading tools",
  "algorithmic trading",
  "expert advisor",
  "MT5 EA",
  "trading community",
  "Quantra",
];

export const PUBLIC_ROUTES: { path: string; changeFrequency?: "weekly" | "monthly"; priority?: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/markets", changeFrequency: "weekly", priority: 0.9 },
  { path: "/education", changeFrequency: "monthly", priority: 0.9 },
  { path: "/tools", changeFrequency: "monthly", priority: 0.9 },
  { path: "/algo", changeFrequency: "weekly", priority: 0.8 },
  { path: "/community", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/bots", changeFrequency: "weekly", priority: 0.8 },
  { path: "/features", changeFrequency: "monthly", priority: 0.6 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.8 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.7 },
  { path: "/register", changeFrequency: "monthly", priority: 0.7 },
];

export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

type PageMetadataInput = {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
  openGraphType?: "website" | "article";
};

/** Per-page metadata with canonical URL, Open Graph, and Twitter cards. */
export function createPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  noIndex = false,
  keywords,
  openGraphType = "website",
}: PageMetadataInput): Metadata {
  const canonical = path ? absoluteUrl(path) : SITE_URL;
  const socialTitle = `${title} — ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: keywords ?? DEFAULT_KEYWORDS,
    alternates: { canonical },
    robots: noIndex ? NOINDEX_ROBOTS : undefined,
    openGraph: {
      type: openGraphType,
      locale: "en_US",
      url: canonical,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      // Images come from src/app/opengraph-image.tsx (1200x630).
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
  };
}

/** Root layout defaults — pages merge/override via createPageMetadata or local exports. */
export function createRootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: DEFAULT_TITLE,
      template: `%s — ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: { canonical: SITE_URL },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      // Images come from src/app/opengraph-image.tsx (1200x630).
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
