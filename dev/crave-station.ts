/**
 * CRAVE Station engine — framework-free pipeline runner for the five-station
 * viewer panel (C → R → A → V → E).
 *
 * Runs the CRAVE lifecycle against a ConfigBase and returns plain data every
 * framework viewer can render:
 *   C — the config itself (the viewer displays/edits it)
 *   R — actual tree: what the live builder produced (actualRenderedTree on
 *       a real buildComponent mount — run-time path, real WebKit DOM)
 *   A — expected tree: what the config promises (expectedRenderedTree)
 *   V — diffRenderedTrees(expected, actual) — zero mismatches = GREEN
 *   E — event ring buffer fed by the component's live onEvent stream
 *
 * No React/Angular/Vue/Svelte imports. Viewers own the shell; this owns the flow.
 */
import type { ConfigBase, RenderNode, RenderMismatch, SafeEvent } from "../../safecontracts/src/contracts";
import { actualRenderedTree, expectedRenderedTree, diffRenderedTrees } from "../../safecontracts/src/contracts";
import { buildComponent } from "../utils/render";

export interface CraveRun {
    /** C — the resolved ConfigBase driving everything downstream */
    config: ConfigBase;
    /** R — RenderNode tree read from the live builder output */
    actual: RenderNode | null;
    /** A — RenderNode tree the config promises */
    expected: RenderNode | null;
    /** V — mismatches between A and R; empty = GREEN */
    mismatches: RenderMismatch[];
    /** V — verdict derived from mismatches (or ERROR when a stage threw) */
    verdict: "GREEN" | "RED" | "ERROR";
    /** Stage error message when verdict is ERROR */
    error: string | null;
    /** Wall-clock ms for the render step */
    renderMs: number;
    /** ISO timestamp of this run */
    ts: string;
}

/**
 * Execute C→R→A→V for one ConfigBase.
 *
 * Mounts the component via buildComponent (the single public render entry)
 * into the supplied container — the mount IS the Execute station, live at the
 * top of the page. The same root element is read back for the R tree.
 */
export function craveRun(
    config: ConfigBase,
    container: HTMLElement,
    onEvent?: (event: SafeEvent) => void,
): CraveRun {
    const ts = new Date().toISOString();
    let actual: RenderNode | null = null;
    let expected: RenderNode | null = null;
    let mismatches: RenderMismatch[] = [];
    let verdict: CraveRun["verdict"] = "GREEN";
    let error: string | null = null;
    let renderMs = 0;

    // R — Render (+ E mount): one buildComponent call, real DOM
    try {
        const t0 = performance.now();
        container.innerHTML = "";
        const root = buildComponent(config, onEvent as any);
        container.appendChild(root);
        renderMs = Math.round((performance.now() - t0) * 10) / 10;
        actual = actualRenderedTree(root);
    } catch (e: any) {
        verdict = "ERROR";
        error = `Render: ${e?.message ?? String(e)}`;
    }

    // A — Assert
    try {
        expected = expectedRenderedTree(config);
    } catch (e: any) {
        verdict = "ERROR";
        error = error ?? `Assert: ${e?.message ?? String(e)}`;
    }

    // V — Verify
    if (expected && actual) {
        try {
            mismatches = diffRenderedTrees(expected, actual);
            if (verdict !== "ERROR") verdict = mismatches.length === 0 ? "GREEN" : "RED";
        } catch (e: any) {
            verdict = "ERROR";
            error = error ?? `Verify: ${e?.message ?? String(e)}`;
        }
    }

    return { config, actual, expected, mismatches, verdict, error, renderMs, ts };
}

/** One line in the E-station ticker. */
export interface CraveEventLine {
    ts: string;
    origin: string;
    name: string;
    detail: string;
}

/** Ring buffer for the E station — newest last, capped. */
export function pushCraveEvent(buf: CraveEventLine[], event: SafeEvent, max = 50): CraveEventLine[] {
    const detail = event.data ? JSON.stringify(event.data) : "";
    const line: CraveEventLine = {
        ts: new Date().toISOString(),
        origin: (event as any).origin?.id ?? "",
        name: event.name ?? "",
        detail: detail.length > 120 ? detail.slice(0, 117) + "..." : detail,
    };
    return [...buf, line].slice(-max);
}

/** Render a RenderNode tree as indented text lines for the R and A cards. */
export function treeLines(node: RenderNode | null, depth = 0): string[] {
    if (!node) return [];
    const pad = "  ".repeat(depth);
    const attrs = Object.entries(node.attrs)
        .filter(([k]) => k.startsWith("data-"))
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
    const text = node.text ? ` "${node.text.length > 30 ? node.text.slice(0, 27) + "..." : node.text}"` : "";
    const lines = [`${pad}<${node.tag}${attrs ? " " + attrs : ""}>${text}`];
    for (const child of node.children) lines.push(...treeLines(child, depth + 1));
    return lines;
}

/** Count nodes in a tree — shown in the R/A card headers. */
export function treeCount(node: RenderNode | null): number {
    if (!node) return 0;
    return 1 + node.children.reduce((s, c) => s + treeCount(c), 0);
}
