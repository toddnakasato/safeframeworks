/**
 * builders/proof-viewer.ts — dev-only component for testing component events.
 *
 * Not in COMPONENT_REGISTRY. Shows all COMPONENT_EVENTS + COMPONENT_FIRE_SHAPES
 * for a target component. Fires proof commands via onEvent. Reads proof results
 * from config.data.
 *
 * config.metadata.target — the component type to inspect (e.g. "table")
 */
import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
import { COMPONENT_EVENTS, COMPONENT_FIRE_SHAPES } from "../../safecontracts/src/contracts";

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

    // Read proof results from data if provided
    const proofData = config.data?.proofs?.inline as any;
    const proofResults: Record<string, { status: string; detail?: string; ts?: string }> =
        proofData ?? {};

    const root = el("div", "proof-viewer");
    root.setAttribute("data-component", "proof-viewer");
    root.setAttribute("data-target", target);

    // --- Styles (dev-only, scoped) ---
    const style = document.createElement("style");
    style.textContent = `
        .proof-viewer { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 16px; max-width: 900px; }
        .proof-viewer .pv-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .proof-viewer .pv-title { font-size: 18px; font-weight: 600; }
        .proof-viewer .pv-badge { font-size: 12px; padding: 2px 8px; border-radius: 4px; background: #e5e7eb; color: #374151; }
        .proof-viewer .pv-btn { padding: 4px 12px; border: 1px solid #d1d5db; border-radius: 4px; background: #fff; cursor: pointer; font-size: 12px; }
        .proof-viewer .pv-btn:hover { background: #f3f4f6; }
        .proof-viewer .pv-btn-primary { background: #1e40af; color: #fff; border-color: #1e40af; }
        .proof-viewer .pv-btn-primary:hover { background: #1d4ed8; }
        .proof-viewer .pv-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        .proof-viewer .pv-table th { text-align: left; padding: 8px; border-bottom: 2px solid #e5e7eb; font-size: 12px; text-transform: uppercase; color: #6b7280; }
        .proof-viewer .pv-table td { padding: 8px; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
        .proof-viewer .pv-table tr:hover { background: #f9fafb; }
        .proof-viewer .pv-pass { color: #059669; font-weight: 600; }
        .proof-viewer .pv-fail { color: #dc2626; font-weight: 600; }
        .proof-viewer .pv-pending { color: #9ca3af; }
        .proof-viewer .pv-shape { font-family: "SF Mono", monospace; font-size: 11px; color: #6b7280; }
        .proof-viewer .pv-expand { display: none; padding: 8px 8px 8px 24px; background: #f9fafb; }
        .proof-viewer .pv-expand.open { display: table-row; }
        .proof-viewer .pv-expand td { border-bottom: 1px solid #e5e7eb; }
        .proof-viewer .pv-shape-key { color: #1e40af; }
        .proof-viewer .pv-shape-token { color: #6b7280; }
        .proof-viewer .pv-no-events { color: #9ca3af; padding: 24px; text-align: center; }
    `;
    root.appendChild(style);

    // --- Header ---
    const header = el("div", "pv-header");
    header.appendChild(el("span", "pv-title", target || "No component selected"));
    if (events.length > 0) {
        header.appendChild(el("span", "pv-badge", `${events.length} events`));
    }

    // Prove All button
    if (events.length > 0) {
        const proveAllBtn = el("button", "pv-btn pv-btn-primary", "Prove All");
        proveAllBtn.onclick = () => {
            if (onEvent) {
                onEvent({
                    id: crypto.randomUUID(),
                    name: "prove:run",
                    origin: { kind: "component", id: "proof-viewer" },
                    data: { component: target, event: "all" },
                    ts: new Date().toISOString(),
                });
            }
        };
        header.appendChild(proveAllBtn);
    }
    root.appendChild(header);

    if (events.length === 0) {
        root.appendChild(el("div", "pv-no-events", target ? `${target} has no declared events` : "Set metadata.target to a component type"));
        container.appendChild(root);
        return root;
    }

    // --- Events table ---
    const table = document.createElement("table");
    table.className = "pv-table";

    // Header row
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    for (const label of ["Event", "Data Shape", "Status", ""]) {
        headRow.appendChild(el("th", undefined, label));
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement("tbody");

    for (const eventName of events) {
        const shape = shapes[eventName];
        const proof = proofResults[eventName];
        const status = proof?.status ?? "pending";

        // Main row
        const tr = document.createElement("tr");
        tr.style.cursor = "pointer";

        // Event name
        tr.appendChild(el("td", undefined, eventName));

        // Shape summary
        const shapeTd = el("td", "pv-shape");
        if (shape) {
            const dataKeys = Object.keys(shape.data ?? {});
            const contextKeys = Object.keys(shape.context ?? {});
            const parts: string[] = [];
            if (dataKeys.length) parts.push(`data: { ${dataKeys.join(", ")} }`);
            if (contextKeys.length) parts.push(`context: { ${contextKeys.join(", ")} }`);
            shapeTd.textContent = parts.join("  ");
        } else {
            shapeTd.textContent = "—";
        }
        tr.appendChild(shapeTd);

        // Status
        const statusCls = status === "pass" ? "pv-pass" : status === "fail" ? "pv-fail" : "pv-pending";
        tr.appendChild(el("td", statusCls, status === "pass" ? "✓ pass" : status === "fail" ? "✗ fail" : "—"));

        // Prove button
        const btnTd = document.createElement("td");
        const proveBtn = el("button", "pv-btn", "Prove");
        proveBtn.onclick = (e) => {
            e.stopPropagation();
            if (onEvent) {
                onEvent({
                    id: crypto.randomUUID(),
                    name: "prove:run",
                    origin: { kind: "component", id: "proof-viewer" },
                    data: { component: target, event: eventName },
                    ts: new Date().toISOString(),
                });
            }
        };
        btnTd.appendChild(proveBtn);
        tr.appendChild(btnTd);

        tbody.appendChild(tr);

        // Expand row — fire shape detail
        const expandRow = document.createElement("tr");
        expandRow.className = "pv-expand";
        const expandTd = document.createElement("td");
        expandTd.colSpan = 4;

        if (shape) {
            const detailLines: string[] = [];
            for (const [root, fields] of Object.entries({ data: shape.data, context: shape.context })) {
                if (!fields) continue;
                for (const [key, token] of Object.entries(fields)) {
                    detailLines.push(`${root}.${key}: ${token}`);
                }
            }
            if (proof?.detail) {
                detailLines.push(`last run: ${proof.detail}`);
            }
            if (proof?.ts) {
                detailLines.push(`at: ${proof.ts}`);
            }
            const pre = document.createElement("pre");
            pre.className = "pv-shape";
            pre.textContent = detailLines.join("\n");
            expandTd.appendChild(pre);
        }

        expandRow.appendChild(expandTd);
        tbody.appendChild(expandRow);

        // Toggle expand on row click
        tr.onclick = () => {
            expandRow.classList.toggle("open");
        };
    }

    table.appendChild(tbody);
    root.appendChild(table);

    container.appendChild(root);
    return root;
}
