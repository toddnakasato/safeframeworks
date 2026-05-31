/**
 * useRenderLog — hook that measures a component and emits a render snapshot.
 *
 * The snapshot answers: what is on screen right now?
 * Declarative, minimal, actionable. An agent reads it and adjusts config.
 *
 * Shape defined by RenderSnapshot and RenderChild types.
 * Only non-default values included. Problems self-reported.
 */
import { useEffect, useRef, useCallback } from "react";

// --- Types: the render contract ---

/** One child element in the component tree. */
export interface RenderChild {
  role: string;           // "search-input", "list", "row-sample", "header", "left", "right"
  tag: string;            // "input", "ul", "li", "div"
  layout: string;         // "flex-row", "flex-column", "grid", "block", "inline"
  size: { w: number; h: number };
  scrollable: boolean;
  visible: boolean;
  items?: number;         // count of child elements (for lists)
  columns?: string;       // grid-template-columns value (for grids)
}

/** The render snapshot. One per component per measurement. */
export interface RenderSnapshot {
  component: string;      // "picker", "layout", "card", "table"
  variant: string;        // "default", "two-column", "compact"
  config_path: string;    // config tree path that produced this: "scenes.opportunity.picker"
  layout: string;         // "flex-row", "flex-column", "grid", "block"
  size: { w: number; h: number };
  columns?: string;       // grid-template-columns (grids only)
  visible: boolean;
  scrollable: boolean;
  data_count?: number;    // how many data items
  children: RenderChild[];
  problems: string[];     // self-reported: "clipped", "zero-height", "hidden-ancestor", "nested-scroll"
}

export type RenderLogFn = (snapshot: RenderSnapshot) => void;

// --- Internals ---

function deriveLayout(style: CSSStyleDeclaration): string {
  if (style.display === "grid") return "grid";
  if (style.display === "flex") {
    return style.flexDirection === "column" ? "flex-column" : "flex-row";
  }
  if (style.display === "inline" || style.display === "inline-block") return "inline";
  return "block";
}

function isScrollable(el: HTMLElement, style: CSSStyleDeclaration): boolean {
  const oy = style.overflowY;
  return (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight;
}

function hasHiddenAncestor(el: HTMLElement): boolean {
  let cur = el.parentElement;
  while (cur) {
    const s = getComputedStyle(cur);
    if (s.display === "none" || s.visibility === "hidden") return true;
    cur = cur.parentElement;
  }
  return false;
}

function hasNestedScroll(el: HTMLElement): boolean {
  let cur = el.parentElement;
  while (cur) {
    const s = getComputedStyle(cur);
    if (s.overflowY === "auto" || s.overflowY === "scroll") return true;
    cur = cur.parentElement;
  }
  return false;
}

function measureChild(role: string, el: HTMLElement): RenderChild {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const tag = el.tagName.toLowerCase();
  const layout = deriveLayout(style);
  const child: RenderChild = {
    role,
    tag,
    layout,
    size: { w: Math.round(rect.width), h: Math.round(rect.height) },
    scrollable: isScrollable(el, style),
    visible: el.offsetParent !== null && rect.width > 0 && rect.height > 0,
  };

  // Count children for list-like elements
  if (tag === "ul" || tag === "ol" || tag === "tbody") {
    child.items = el.children.length;
  }

  // Grid columns
  if (layout === "grid" && style.gridTemplateColumns !== "none") {
    child.columns = style.gridTemplateColumns;
  }

  return child;
}

function detectProblems(el: HTMLElement, style: CSSStyleDeclaration, rect: DOMRect): string[] {
  const problems: string[] = [];

  // Clipped content
  if (style.overflowY === "hidden" && el.scrollHeight > rect.height + 1) {
    problems.push("clipped");
  }
  if (style.overflowX === "hidden" && el.scrollWidth > rect.width + 1) {
    problems.push("clipped-x");
  }

  // Zero dimensions
  if (rect.height === 0) problems.push("zero-height");
  if (rect.width === 0) problems.push("zero-width");

  // Hidden ancestor
  if (hasHiddenAncestor(el)) problems.push("hidden-ancestor");

  // Nested scroll
  if (hasNestedScroll(el)) problems.push("nested-scroll");

  // Not visible
  if (el.offsetParent === null && style.position !== "fixed") problems.push("invisible");

  return problems;
}

// --- Hook ---

export function useRenderLog(
  onRenderLog: RenderLogFn | undefined,
  opts: {
    component: string;
    variant: string;
    config_path?: string;
    data_count?: number;
    subRefs?: Record<string, React.RefObject<HTMLElement | null>>;
  },
) {
  const ref = useRef<HTMLDivElement>(null);
  const onRenderLogRef = useRef(onRenderLog);
  onRenderLogRef.current = onRenderLog;
  const subRefsRef = useRef(opts.subRefs);
  subRefsRef.current = opts.subRefs;
  const lastEmitRef = useRef<string | null>(null);

  const measure = useCallback(() => {
    if (!ref.current || !onRenderLogRef.current) return;

    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const layout = deriveLayout(style);

    // Measure children
    const children: RenderChild[] = [];
    if (subRefsRef.current) {
      for (const [role, subRef] of Object.entries(subRefsRef.current)) {
        if (subRef.current) {
          children.push(measureChild(role, subRef.current));
        }
      }
    }

    const snapshot: RenderSnapshot = {
      component: opts.component,
      variant: opts.variant,
      config_path: opts.config_path ?? "",
      layout,
      size: { w: Math.round(rect.width), h: Math.round(rect.height) },
      visible: el.offsetParent !== null && rect.width > 0 && rect.height > 0,
      scrollable: isScrollable(el, style),
      children,
      problems: detectProblems(el, style, rect),
    };

    // Optional fields — only include when present
    if (layout === "grid" && style.gridTemplateColumns !== "none") {
      snapshot.columns = style.gridTemplateColumns;
    }
    if (opts.data_count !== undefined && opts.data_count !== null) {
      snapshot.data_count = opts.data_count;
    }

    onRenderLogRef.current(snapshot);
  }, [opts.component, opts.variant, opts.data_count, opts.config_path]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => measure());
    return () => cancelAnimationFrame(raf);
  }, [measure]);

  return ref;
}
