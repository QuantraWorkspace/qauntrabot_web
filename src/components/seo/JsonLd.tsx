import { FAQ_ITEMS } from "@/lib/faq-data";
import { SITE_NAME } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-config";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
    />
  );
}

export function SiteJsonLd() {
  return (
    <JsonLd
      data={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/logo/logo.png`,
          description:
            "A trader-first ecosystem: algorithmic trading and expert advisors, trading education, market analysis, free tools and community.",
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          // No SearchAction: this declared a sitewide search at /bots?q=, but
          // that route reads no query param. Re-add it when search exists.
        },
      ]}
    />
  );
}

export function FaqPageJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      }}
    />
  );
}

type BotJsonLdInput = {
  id: string;
  name: string;
  description: string;
  asset: string;
};

export function BotProductJsonLd({ id, name, description, asset }: BotJsonLdInput) {
  const url = `${SITE_URL}/bots/${id}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name,
        description,
        applicationCategory: "FinanceApplication",
        // The strategy specification states MetaTrader 5 only; claiming MT4
        // here contradicted it.
        operatingSystem: "MetaTrader 5",
        url,
        // No Offer: one without price and priceCurrency is an incomplete entity
        // that asserts purchasability without stating terms. Prices are per
        // billing period and come from Firestore, so they are not static here.
        featureList: asset,
        brand: {
          "@type": "Brand",
          name: SITE_NAME,
        },
      }}
    />
  );
}
