"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Key, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { signOut } from "@/lib/auth";
import { BILLING_PERIOD_LABEL } from "@/lib/subscription-plans";
import { formatDisplayDate } from "@/lib/dates";
import { useMemberName, usePreferences, useStoredState } from "@/lib/zentra/hooks";
import { toast } from "@/lib/toast";
import { PageTitle, Section, Skeleton } from "@/components/dashboard/zentra/ui";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="z-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function MembershipBadge() {
  const { active, subscription, loading } = useDashboard();
  if (loading) return null;
  const state = active ? "active" : subscription ? "expired" : "free";
  return (
    <span className="z-membership" data-state={state}>
      {active ? "Member" : subscription ? "Expired" : "Free"}
    </span>
  );
}

/* ── Profile ──────────────────────────────────────────────────────────────── */

export function ProfileView() {
  const { user, profile } = useAuth();
  const { email } = useDashboard();
  const name = useMemberName();

  return (
    <div className="z-page z-page--narrow">
      <PageTitle title="Profile" lede="Your account details." />
      <div className="z-panel z-panel--pad">
        <div className="flex items-center gap-4">
          <span className="z-avatar z-avatar--lg" aria-hidden>
            {name.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-foreground truncate">{name}</p>
            <p className="z-meta truncate">{email}</p>
          </div>
          <span className="ml-auto">
            <MembershipBadge />
          </span>
        </div>
        <dl className="z-rows">
          <Row label="Email">{email || "—"}</Row>
          <Row label="Display name">{profile?.displayName || <span className="text-muted-foreground">Not set — we use your email name</span>}</Row>
          <Row label="Member since">{profile?.createdAt ? formatDisplayDate(profile.createdAt) : "—"}</Row>
          <Row label="Email verified">{user ? (user.emailVerified ? "Yes" : "Not yet") : "—"}</Row>
        </dl>
      </div>
      <button
        type="button"
        className="z-btn z-btn--danger w-fit"
        onClick={async () => {
          await signOut();
          window.location.href = "/";
        }}
      >
        <LogOut size={14} aria-hidden /> Sign out
      </button>
    </div>
  );
}

/* ── Subscription ─────────────────────────────────────────────────────────── */

export function SubscriptionView() {
  const { subscription, loading, active } = useDashboard();
  const [copied, setCopied] = useState(false);

  const copyKey = async () => {
    if (!subscription?.licenseKey) return;
    try {
      await navigator.clipboard.writeText(subscription.licenseKey);
      setCopied(true);
      toast.success("License key copied.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the license key.");
    }
  };

  return (
    <div className="z-page z-page--narrow">
      <PageTitle title="Subscription" lede="Your plan and what it includes." aside={<MembershipBadge />} />
      {loading ? (
        <Skeleton rows={1} height="12rem" />
      ) : !subscription ? (
        <div className="z-panel z-panel--pad">
          <p className="text-base font-semibold text-foreground">You&apos;re on the free plan</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Membership unlocks the full course library, desk analysis and the indicators on your account.
          </p>
          <Link href="/pricing" className="z-btn z-btn--primary w-fit">
            See membership plans <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      ) : (
        <div className="z-panel z-panel--pad">
          <dl className="z-rows !mt-0">
            <Row label="Status">
              <span className={active ? "text-profit" : "text-loss-soft"}>{active ? "Active" : subscription.status === "cancelled" ? "Cancelled" : "Expired"}</span>
            </Row>
            <Row label="Plan">{BILLING_PERIOD_LABEL[subscription.billingPeriod]}</Row>
            <Row label={active ? "Renews / valid until" : "Ended"}>{formatDisplayDate(subscription.validUntil)}</Row>
            <Row label="Started">{formatDisplayDate(subscription.createdAt)}</Row>
            {subscription.licenseKey && (
              <Row label="License key">
                <span className="inline-flex items-center gap-2 min-w-0">
                  <Key size={13} className="text-muted-foreground shrink-0" aria-hidden />
                  <code className="text-xs break-all">{subscription.licenseKey}</code>
                  <button type="button" onClick={copyKey} className="z-icon-btn" aria-label="Copy license key">
                    {copied ? <Check size={14} className="text-profit" /> : <Copy size={14} />}
                  </button>
                </span>
              </Row>
            )}
          </dl>
          {!active && (
            <Link href="/pricing" className="z-btn z-btn--primary w-fit">
              Renew membership <ArrowRight size={14} aria-hidden />
            </Link>
          )}
        </div>
      )}
      {subscription?.licenseKey && (
        <p className="z-meta">
          Using a Zentra MetaTrader tool from an earlier plan? Your license and downloads are still at{" "}
          <Link href="/dashboard/license" className="z-link inline-flex">
            License key
          </Link>
          .
        </p>
      )}
    </div>
  );
}

/* ── Settings ─────────────────────────────────────────────────────────────── */

type Prefs = { newsAlerts: boolean; highImpactAlerts: boolean; lessonReminders: boolean; communityReplies: boolean };
const DEFAULT_PREFS: Prefs = { newsAlerts: true, highImpactAlerts: true, lessonReminders: false, communityReplies: true };
const PREFS_KEY = "zentra-notification-prefs";
const NO_PREFS: Partial<Prefs> = {};

const PREF_COPY: { key: keyof Prefs; title: string; body: string }[] = [
  { key: "newsAlerts", title: "Breaking news", body: "When the desk publishes high-impact news or new analysis." },
  { key: "highImpactAlerts", title: "High-impact events", body: "30 minutes before CPI, NFP, FOMC and other red-folder releases." },
  { key: "lessonReminders", title: "Learning reminders", body: "A nudge when you haven't continued a course in a week." },
  { key: "communityReplies", title: "Community replies", body: "When someone replies to your post or discussion." },
];

const noopSubscribe = () => () => {};
const localTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const serverTimeZone = () => "—";

export function SettingsView() {
  const [stored, setStored] = useStoredState<Partial<Prefs>>(PREFS_KEY, NO_PREFS);
  const prefs: Prefs = { ...DEFAULT_PREFS, ...stored };
  const timeZone = useSyncExternalStore(noopSubscribe, localTimeZone, serverTimeZone);
  const { prefs: preferences, personalised, reset: resetPrefs } = usePreferences();

  const toggle = (key: keyof Prefs) => setStored((prev) => ({ ...prev, [key]: !prefs[key] }));

  return (
    <div className="z-page z-page--narrow">
      <PageTitle title="Settings" lede="Choose what Zentra tells you about." />
      <Section title="Markets & level">
        <div className="z-panel z-panel--pad">
          <dl className="z-rows !mt-0">
            <Row label="Markets">{preferences.markets.length ? preferences.markets.join(", ") : <span className="text-muted-foreground">Not set</span>}</Row>
            <Row label="Experience">{preferences.level ?? <span className="text-muted-foreground">Not set</span>}</Row>
            <Row label="Topics">{preferences.topics.length ? preferences.topics.join(", ") : <span className="text-muted-foreground">Not set</span>}</Row>
          </dl>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/welcome" className="z-btn z-btn--ghost">
              {personalised ? "Update preferences" : "Personalise my dashboard"}
            </Link>
            {personalised && (
              <button type="button" className="z-btn z-btn--static !cursor-pointer" onClick={resetPrefs}>
                Clear
              </button>
            )}
          </div>
          <p className="z-meta">Used to order news, filter the calendar to your currencies and set your learning path.</p>
        </div>
      </Section>
      <Section title="Notifications">
        <div className="z-panel">
          {PREF_COPY.map(({ key, title, body }) => (
            <label key={key} className="z-toggle-row">
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{title}</span>
                <span className="block z-meta mt-0.5">{body}</span>
              </span>
              <input type="checkbox" role="switch" checked={prefs[key]} onChange={() => toggle(key)} className="z-switch" />
            </label>
          ))}
        </div>
        <p className="z-meta">Saved on this device. Email and push delivery will use these choices once they&apos;re switched on.</p>
      </Section>
      <Section title="Display">
        <div className="z-panel z-panel--pad">
          <dl className="z-rows !mt-0">
            <Row label="Timezone">{timeZone}</Row>
            <Row label="Theme">Dark</Row>
          </dl>
          <p className="z-meta">Calendar and news times follow your device&apos;s timezone.</p>
        </div>
      </Section>
    </div>
  );
}
