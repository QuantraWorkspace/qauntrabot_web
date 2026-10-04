"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock3, Search } from "lucide-react";
import { getEducation, getIndicators, getNews } from "@/lib/zentra/data";
import { NO_IDS, useStoredState } from "@/lib/zentra/hooks";

type Hit = { group: string; label: string; sub: string; href: string };

async function loadIndex(): Promise<Hit[]> {
  const [news, edu, indicators] = await Promise.all([getNews(), getEducation(), getIndicators()]);
  return [
    ...news.data.map((n) => ({ group: "News", label: n.headline, sub: n.markets.join(", "), href: `/dashboard/news/${n.id}` })),
    ...edu.data.courses.map((c) => ({ group: "Courses", label: c.title, sub: c.category, href: "/dashboard/learn" })),
    ...edu.data.lessons.map((l) => ({ group: "Lessons", label: l.title, sub: l.category, href: `/dashboard/learn/lessons/${l.id}` })),
    ...indicators.data.map((i) => ({ group: "Indicators", label: i.name, sub: i.markets.join(" / "), href: `/dashboard/indicators/${i.id}` })),
  ];
}

export default function HeaderSearch() {
  const router = useRouter();
  const [index, setIndex] = useState<Hit[] | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recent, setRecent] = useStoredState("zentra-recent-searches", NO_IDS);
  const remember = (q: string) => {
    const term = q.trim();
    if (term) setRecent((prev) => [term, ...prev.filter((x) => x.toLowerCase() !== term.toLowerCase())].slice(0, 5));
  };

  const ensureIndex = () => {
    if (!index) loadIndex().then(setIndex).catch(() => setIndex([]));
  };

  // ⌘K / Ctrl+K from anywhere, or "/" outside a text field, focuses search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !index) return [];
    return index.filter((h) => h.label.toLowerCase().includes(q) || h.sub.toLowerCase().includes(q)).slice(0, 8);
  }, [query, index]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={rootRef} className="z-hsearch">
      <Search size={15} className="z-hsearch-icon" aria-hidden />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={open && (query.trim().length > 0 || recent.length > 0)}
        aria-controls="z-hsearch-results"
        aria-activedescendant={hits[cursor] ? `z-hit-${cursor}` : undefined}
        aria-label="Search news, courses, lessons and indicators"
        placeholder="Search news, lessons, courses…"
        className="z-hsearch-input"
        value={query}
        onFocus={() => {
          ensureIndex();
          setOpen(true);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setCursor(0);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            close();
            inputRef.current?.blur();
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setCursor((c) => Math.min(c + 1, hits.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setCursor((c) => Math.max(c - 1, 0));
          } else if (e.key === "Enter" && hits[cursor]) {
            e.preventDefault();
            remember(query);
            router.push(hits[cursor].href);
            close();
            inputRef.current?.blur();
          }
        }}
      />
      <kbd className="z-kbd" aria-hidden>
        ⌘K
      </kbd>
      {open && !query.trim() && recent.length > 0 && (
        <div className="z-pop z-hsearch-pop">
          <p className="z-pop-heading">Recent searches</p>
          {recent.map((q) => (
            <button
              key={q}
              type="button"
              className="z-pop-item w-full text-left"
              onClick={() => {
                setQuery(q);
                setCursor(0);
                ensureIndex();
                inputRef.current?.focus();
              }}
            >
              <Clock3 size={14} className="text-muted-foreground shrink-0 mt-0.5" aria-hidden />
              <span className="text-sm text-foreground truncate">{q}</span>
            </button>
          ))}
          <button type="button" className="z-pop-foot text-left" onClick={() => setRecent(() => [])}>
            Clear recent
          </button>
        </div>
      )}
      {open && query.trim() && (
        <div id="z-hsearch-results" role="listbox" aria-label="Search results" className="z-pop z-hsearch-pop">
          {index === null ? (
            <p className="z-pop-empty">Loading…</p>
          ) : hits.length === 0 ? (
            <p className="z-pop-empty">No matches for &ldquo;{query.trim()}&rdquo;</p>
          ) : (
            hits.map((h, i) => (
              <div key={`${h.group}-${h.href}-${h.label}`} role="presentation">
                {(i === 0 || hits[i - 1].group !== h.group) && (
                  <p className="z-pop-heading" role="presentation">
                    {h.group}
                  </p>
                )}
                <Link
                  id={`z-hit-${i}`}
                  role="option"
                  aria-selected={i === cursor}
                  href={h.href}
                  className="z-pop-item"
                  onClick={() => {
                    remember(query);
                    close();
                  }}
                  onMouseEnter={() => setCursor(i)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-foreground">{h.label}</span>
                    <span className="block truncate z-meta">{h.sub}</span>
                  </span>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
