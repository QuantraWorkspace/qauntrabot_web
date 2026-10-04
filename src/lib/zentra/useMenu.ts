"use client";

import { useEffect, type RefObject } from "react";

const ITEMS = 'a[href], button:not([disabled]), [role="menuitem"]';

/**
 * Keyboard behaviour for a popover menu: focus the first item on open,
 * ↑/↓/Home/End move between items, Escape or an outside click closes it and
 * focus goes back to the trigger.
 */
export function useMenu(
  open: boolean,
  close: () => void,
  panelRef: RefObject<HTMLElement | null>,
  rootRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const items = () => Array.from(panel?.querySelectorAll<HTMLElement>(ITEMS) ?? []);
    items()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
        return;
      }
      if (!panel?.contains(document.activeElement)) return;
      const list = items();
      const i = list.indexOf(document.activeElement as HTMLElement);
      let next = -1;
      if (e.key === "ArrowDown") next = (i + 1) % list.length;
      else if (e.key === "ArrowUp") next = (i - 1 + list.length) % list.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = list.length - 1;
      else if (e.key === "Tab") {
        // Leaving the menu with Tab closes it rather than stranding it open.
        close();
        return;
      }
      if (next >= 0) {
        e.preventDefault();
        list[next]?.focus();
      }
    };
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, close, panelRef, rootRef, triggerRef]);
}
