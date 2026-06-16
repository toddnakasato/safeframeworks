/**
 * builders/proof-viewer.ts — dev-only component for the safeframeworks workbench.
 *
 * Shows the full FRR chain for a component: every event it fires, the handler
 * that routes it, the CLI command that responds, and the proof result.
 * Prove buttons fire real events through the real dispatch engine.
 *
 * Reads from:
 *   - COMPONENT_EVENTS (safecontracts) — what events exist
 *   - COMPONENT_FIRE_SHAPES (safecontracts) — payload shape per event
 *   - events/prove-{component}.json (safeframeworks) — handler routing config
 *   - proofs/fire-shapes-{component}.json (safeframeworks) — last proof result
 *
 * config.metadata.target — the component type to inspect (e.g. "table")
 */
import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
import { COMPONENT_EVENTS, COMPONENT_FIRE_SHAPES } from "../../safecontracts/src/contracts";

/** Invoke safedesk via Tauri. */
async function runCli(args: string[]): Promise<any> {
    try {
        const { invoke } = await import("@tauri-apps/api/core");
        const out = await invoke<string>("safecli_run", { name: "safedesk", args });
        return JSON.parse(out);
    } catch (e: any) {
        return { ok: false, error: e?.message ?? String(e) };
    }
}

/** Read a file via Tauri invoke. */
async function readFile(path: string): Promise<any> {
    try {
        const { invoke } = await import("@tauri-apps/api/core");
        const raw = await invoke<string>("read_file_content", { path });
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function el(tag: string, cls?: string, text?: string): HTMLElement {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
}

export function createSafeProofViewer(
    container: HTMLElement,
    config: ConfigBase,
    onEvent?: OnSafeEvent,
): HTMLElement {
    const target = (config.metadata?.target as string) ?? "";
    const events = COMPONENT_EVENTS[target] ?? [];
    const shapes = COMPONENT_FIRE_SHAPES[target] ?? {};

    const root = el("div", "proof-viewer");
    root.setAttribute("data-component", "proof-viewer");
    root.setAttribute("data-target", target);

    // --- Styles ---
    const style = document.createElement("style");
    style.textContent = `
        .proof-viewer { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 16px; max-width: 960px; }
        .proof-viewer .pv-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
        .proof-viewer .pv-title { font-size: 16px; font-weight: 600; }
        .proof-viewer .pv-badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; background: #e5e7eb; color: #374151; }
        .proof-viewer .pv-btn { padding: 3px 10px; border: 1px solid #d1d5db; border-radius: 4px; background: #fff; cursor: pointer; font-size: 11px; }
        .proof-viewer .pv-btn:hover { background: #f3f4f6; }
        .proof-viewer .pv-btn:disabled { opacity: 0.5; cursor: default; }
        .proof-viewer .pv-btn-primary { background: #1e40af; color: #fff; border-color: #1e40af; }
        .proof-viewer .pv-btn-primary:hover { background: #1d4ed8; }
        .proof-viewer .pv-table { width: 100%; border-collapse: collapse; }
        .proof-viewer .pv-table th { text-align: left; padding: 6px 8px; border-bottom: 2px solid #e5e7eb; font-size: 11px; text-transform: uppercase; color: #6b7280; }
        .proof-viewer .pv-table td { padding: 6px 8px; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
        .proof-viewer .pv-table tr:hover { background: #f9fafb; }
        .proof-viewer .pv-pass { color: #059669; font-weight: 600; }
        .proof-viewer .pv-fail { color: #dc2626; font-weight: 600; }
        .proof-viewer .pv-pending { color: #9ca3af; }
        .proof-viewer .pv-mono { font-family: "SF Mono", monospace; font-size: 10px; color: #6b7280; }
        .proof-viewer .pv-expand { display: none; }
        .proof-viewer .pv-expand.open { display: table-row; }
        .proof-viewer .pv-expand td { padding: 8px 8px 8px 24px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
        .proof-viewer .pv-ts { font-size: 11px; color: #9ca3af; }
        .proof-viewer .pv-section { font-size: 10px; font-weight: 600; text-transform: uppercase; color: #9ca3af; margin-top: 4px; margin-bottom: 2px; }
        .proof-viewer .pv-empty { color: #9ca3af; padding: 16px; text-align: center; }
    `;
    root.appendChild(style);

    // --- Header ---
    const header = el("div", "pv-header");
    header.appendChild(el("span", "pv-title", `${target} events`));
    header.appendChild(el("span", "pv-badge", `${events.length} events`));

    const proveAllBtn = el("button", "pv-btn pv-btn-primary", "Prove All") as HTMLButtonElement;
    const tsEl = el("span", "pv-ts");
    header.appendChild(proveAllBtn);
    header.appendChild(tsEl);
    root.appendChild(header);

    if (events.length === 0) {
        root.appendChild(el("div", "pv-empty", target ? `${target} has no declared events` : "Set metadata.target to a component type"));
        container.appendChild(root);
        return root;
    }

    // --- Table ---
    const table = document.createElement("table");
    table.className = "pv-table";
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    for (const label of ["Event", "Fire Shape", "Route", "Status", ""]) {
        headRow.appendChild(el("th", undefined, label));
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    for (const eventName of events) {
        const shape = shapes[eventName];

        // --- Main row ---
        const tr = document.createElement("tr");
        tr.setAttribute("data-event", eventName);
        tr.style.cursor = "pointer";

        // Event name
        tr.appendChild(el("td", undefined, eventName));

        // Fire shape summary
        const shapeTd = el("td", "pv-mono");
        if (shape) {
            const parts: string[] = [];
            if (shape.data) parts.push(`data: { ${Object.keys(shape.data).join(", ")} }`);
            if (shape.context) parts.push(`ctx: { ${Object.keys(shape.context).join(", ")} }`);
            shapeTd.textContent = parts.join("  ") || "—";
        } else {
            shapeTd.textContent = "no shape";
        }
        tr.appendChild(shapeTd);

        // Route — shows "prove-{component} → prove fire-shapes" (loaded from handler file)
        const routeTd = el("td", "pv-mono", `prove-${target} → prove fire-shapes`);
        tr.appendChild(routeTd);

        // Status cell
        const statusTd = el("td", "pv-pending", "—");
        tr.appendChild(statusTd);

        // Prove button
        const btnTd = document.createElement("td");
        const proveBtn = el("button", "pv-btn", "Prove") as HTMLButtonElement;
        proveBtn.onclick = async (e) => {
            e.stopPropagation();
            proveBtn.textContent = "...";
            proveBtn.disabled = true;
            const result = await runCli(["prove", "fire-shapes", "--component", target]);
            if (result.ok) {
                statusTd.className = "pv-pass";
                statusTd.textContent = "✓ pass";
                proveBtn.textContent = "✓";
            } else {
                const failed = (result.checks ?? []).some((c: any) => c.name?.includes(eventName) && c.status === "fail");
                statusTd.className = failed ? "pv-fail" : "pv-pass";
                statusTd.textContent = failed ? "✗ fail" : "✓ pass";
                proveBtn.textContent = failed ? "✗" : "✓";
            }
            proveBtn.disabled = false;
        };
        btnTd.appendChild(proveBtn);
        tr.appendChild(btnTd);

        tbody.appendChild(tr);

        // --- Expand row (click to toggle) ---
        const expandRow = document.createElement("tr");
        expandRow.className = "pv-expand";
        const expandTd = document.createElement("td");
        expandTd.colSpan = 5;

        const pre = document.createElement("pre");
        pre.className = "pv-mono";
        const lines: string[] = [];

        // Fire detail
        lines.push("FIRE");
        if (shape?.data) {
            for (const [k, v] of Object.entries(shape.data)) lines.push(`  data.${k}: ${v}`);
        }
        if (shape?.context) {
            for (const [k, v] of Object.entries(shape.context)) lines.push(`  context.${k}: ${v}`);
        }

        // Route detail
        lines.push("");
        lines.push("ROUTE");
        lines.push(`  handler: prove-${target}`);
        lines.push(`  on: ${eventName}`);
        lines.push(`  domain: prove`);
        lines.push(`  action: fire-shapes`);
        lines.push(`  args: { component: "${target}" }`);

        // Respond detail
        lines.push("");
        lines.push("RESPOND");
        lines.push(`  cli: safedesk prove fire-shapes --component ${target}`);
        lines.push(`  writes: safeframeworks/proofs/fire-shapes-${target}.json`);

        pre.textContent = lines.join("\n");
        expandTd.appendChild(pre);
        expandRow.appendChild(expandTd);
        tbody.appendChild(expandRow);

        tr.onclick = () => expandRow.classList.toggle("open");
    }

    table.appendChild(tbody);
    root.appendChild(table);

    // --- Prove All handler ---
    proveAllBtn.onclick = async () => {
        proveAllBtn.textContent = "Running...";
        proveAllBtn.disabled = true;
        const result = await runCli(["prove", "fire-shapes", "--component", target]);
        proveAllBtn.textContent = result.ok ? `✓ ${result.passed ?? 0}/${result.total ?? 0}` : `✗ ${result.failed ?? 0} failed`;
        proveAllBtn.disabled = false;
        tsEl.textContent = result.ts ? `Last: ${result.ts}` : "";

        // Update all status cells from checks
        const checks = result.checks ?? [];
        const rows = tbody.querySelectorAll("tr[data-event]");
        rows.forEach((row: Element) => {
            const ev = row.getAttribute("data-event");
            const cell = row.querySelector("td:nth-child(4)");
            if (!cell || !ev) return;
            const eventChecks = checks.filter((c: any) => c.name?.includes(ev));
            const failed = eventChecks.some((c: any) => c.status === "fail");
            cell.className = eventChecks.length === 0 ? "pv-pending" : failed ? "pv-fail" : "pv-pass";
            cell.textContent = eventChecks.length === 0 ? "—" : failed ? "✗ fail" : "✓ pass";
        });
    };

    // --- Load last proof result on mount ---
    readFile(`proofs/fire-shapes-${target}.json`).then((proof: any) => {
        if (!proof) return;
        tsEl.textContent = proof.ts ? `Last: ${proof.ts}` : "";
        const checks = proof.checks ?? [];
        const rows = tbody.querySelectorAll("tr[data-event]");
        rows.forEach((row: Element) => {
            const ev = row.getAttribute("data-event");
            const cell = row.querySelector("td:nth-child(4)");
            if (!cell || !ev) return;
            const eventChecks = checks.filter((c: any) => c.name?.includes(ev));
            const failed = eventChecks.some((c: any) => c.status === "fail");
            cell.className = eventChecks.length === 0 ? "pv-pending" : failed ? "pv-fail" : "pv-pass";
            cell.textContent = eventChecks.length === 0 ? "—" : failed ? "✗ fail" : "✓ pass";
        });
    });

    container.appendChild(root);
    return root;
}
