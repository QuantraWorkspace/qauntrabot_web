export type NavItem = { label: string; href: string };

export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Markets", href: "/markets" },
  { label: "Education", href: "/education" },
  { label: "Tools", href: "/tools" },
  { label: "Signals", href: "/signals" },
  { label: "Algo", href: "/algo" },
  { label: "Community", href: "/community" },
];

export const FOOTER_PLATFORM: NavItem[] = PRIMARY_NAV.filter((item) => item.href !== "/");

export const FOOTER_RESOURCES: NavItem[] = [
  { label: "TradingView Indicators", href: "/tools#indicators" },
  { label: "Economic Calendar", href: "/tools#calendar" },
  { label: "Trading Journal", href: "/tools#journal" },
  { label: "Risk Calculator", href: "/tools#risk" },
];

export const FOOTER_COMPANY: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/community#contact" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQs", href: "/faqs" },
];

/**
 * Social profiles. Set the NEXT_PUBLIC_* URL to enable a link;
 * unset entries render as inactive labels rather than dead links.
 */
export const SOCIAL_LINKS: { label: string; href?: string }[] = [
  { label: "Telegram", href: process.env.NEXT_PUBLIC_TELEGRAM_URL },
  { label: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL },
  { label: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL },
  { label: "YouTube", href: process.env.NEXT_PUBLIC_YOUTUBE_URL },
];
