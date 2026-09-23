import { createElement, type ReactNode } from "react";

export type ScrollRevealVariant = "up" | "down" | "left" | "right" | "fade" | "scale";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  variant?: ScrollRevealVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  as?: "div" | "section" | "article" | "li";
};

/** Plain layout wrapper. Scroll-triggered entrances were removed on purpose: motion is reserved for the hero's session clock. */
export default function ScrollReveal({ children, className = "", as: Tag = "div" }: ScrollRevealProps) {
  return createElement(Tag, { className: className || undefined }, children);
}
