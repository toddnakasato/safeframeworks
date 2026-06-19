/**
 * dev/proof-viewer.ts — dev-only EPRPP workbench for safeframeworks.
 *
 * Two tabs:
 *   PROOFS — numbered check list read from PROOF_CHECKS contract
 *   EVENTS — live event stream from component interactions
 *
 * config.metadata.target — the component type to inspect
 */
import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
import { COMPONENT_EVENTS, COMPONENT_PAYLOAD_SHAPES, PROOF_CHECKS } from "../../safecontracts/src/contracts";

async function invoke<T>(cmd: string, args?: Record<string, any>): Promise<T> {
    const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
    return tauriInvoke<T>(cmd, args);
}

async function runCli(args: string[]): Promise<any> {
    try {
        const out = await invoke<string>("safecli_run", { name: "safedesk", args });
        return JSON.parse(out);
    } catch (e: any) {
        return { ok: false, error: e?.message ?? String(e) };
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

    const root = el("div", "pv");
    root.setAttribute("data-component", "proof-viewer");
    root.setAttribute("data-target", target);

    const style = document.createElement("style");
    style.textContent = `
        .pv { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 12px; width: 100%; box-sizing: border-box; color: var(--sd-text, #0f172a); }
        .pv .pv-hdr { display: flex; align-items: center; gap: 10px; margin-bottom: 0; flex-wrap: wrap; }
        .pv .pv-title { font-size: 15px; font-weight: 600; }
        .pv .pv-badge { font-size: 10px; padding: 2px 6px; border-radius: 3px; background: var(--sd-surface-raised, #e5e7eb); color: var(--sd-text-dim, #475569); }
        .pv .pv-btn { padding: 3px 8px; border: 1px solid var(--sd-border, #d1d5db); border-radius: 3px; background: var(--sd-surface-base, #fff); color: var(--sd-text, #0f172a); cursor: pointer; font-size: 10px; white-space: nowrap; }
        .pv .pv-btn:hover { background: var(--sd-surface-raised, #f3f4f6); }
        .pv .pv-btn:disabled { opacity: 0.5; }
        .pv .pv-btn-p { background: var(--sd-accent, #2563eb); color: var(--sd-text-inverse, #fff); border-color: var(--sd-accent, #2563eb); }
        .pv .pv-btn-p:hover { background: var(--sd-accent, #1d4ed8); }
        .pv .pv-tabs { display: flex; gap: 0; margin: 10px 0 0; border-bottom: 2px solid var(--sd-border, #e5e7eb); }
        .pv .pv-tab { padding: 6px 14px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sd-text-muted, #475569); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; background: none; border-top: none; border-left: none; border-right: none; }
        .pv .pv-tab:hover { color: var(--sd-text, #374151); }
        .pv .pv-tab.active { color: var(--sd-accent, #2563eb); border-bottom-color: var(--sd-accent, #2563eb); }
        .pv .pv-panel { display: none; padding-top: 10px; }
        .pv .pv-panel.active { display: block; }
        .pv .pass { color: var(--sd-success, #15803d); font-weight: 600; }
        .pv .fail { color: var(--sd-danger, #dc2626); font-weight: 600; }
        .pv .pend { color: var(--sd-text-muted, #475569); }
        .pv .ts { font-size: 10px; color: var(--sd-text-muted, #475569); }
        .pv .empty { color: var(--sd-text-muted, #475569); padding: 16px; text-align: center; }
        .pv .pc { padding: 6px 0; border-bottom: 1px solid var(--sd-border, #e2e8f0); }
        .pv .pc-row { display: flex; align-items: baseline; gap: 8px; }
        .pv .pc-num { font-size: 10px; color: var(--sd-text-muted, #475569); min-width: 20px; text-align: right; }
        .pv .pc-icon { font-size: 12px; min-width: 16px; }
        .pv .pc-label { font-size: 12px; font-weight: 600; flex: 1; }
        .pv .pc-count { font-size: 10px; font-family: "SF Mono", ui-monospace, monospace; min-width: 40px; text-align: right; }
        .pv .pc-desc { font-size: 10px; color: var(--sd-text-dim, #475569); margin-left: 44px; margin-top: 2px; line-height: 1.4; }
        .pv .pc-summary { display: flex; align-items: center; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 2px solid var(--sd-border, #e2e8f0); font-size: 12px; font-weight: 600; }
        .pv .ev-row { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--sd-border, #e2e8f0); align-items: flex-start; }
        .pv .ev-name { font-weight: 600; font-size: 12px; min-width: 100px; }
        .pv .ev-shape { flex: 1; font-family: "SF Mono", ui-monospace, monospace; font-size: 10px; color: var(--sd-text-dim, #475569); white-space: pre-wrap; word-break: break-all; }
    `;
    root.appendChild(style);

    // Header
    const hdr = el("div", "pv-hdr");
    hdr.appendChild(el("span", "pv-title", `${target}`));
    hdr.appendChild(el("span", "pv-badge", `${events.length} events`));
    const proveAllBtn = el("button", "pv-btn pv-btn-p", "Prove All") as HTMLButtonElement;
    const tsEl = el("span", "ts");
    hdr.appendChild(proveAllBtn);
    hdr.appendChild(tsEl);
    root.appendChild(hdr);

    if (!events.length) {
        root.appendChild(el("div", "empty", target ? `${target}: no events` : "Set metadata.target"));
        container.appendChild(root);
        return root;
    }

    // Tabs
    const tabBar = el("div", "pv-tabs");
    const proofsTab = el("button", "pv-tab active", "Proofs") as HTMLButtonElement;
    const eventsTab = el("button", "pv-tab", "Events") as HTMLButtonElement;
    tabBar.appendChild(proofsTab);
    tabBar.appendChild(eventsTab);
    root.appendChild(tabBar);

    const proofsPanel = el("div", "pv-panel active");
    const eventsPanel = el("div", "pv-panel");

    proofsTab.onclick = () => {
        proofsTab.classList.add("active"); eventsTab.classList.remove("active");
        proofsPanel.classList.add("active"); eventsPanel.classList.remove("active");
    };
    eventsTab.onclick = () => {
        eventsTab.classList.add("active"); proofsTab.classList.remove("active");
        eventsPanel.classList.add("active"); proofsPanel.classList.remove("active");
    };

    // ==================== PROOFS TAB ====================

    interface CheckState {
        iconEl: HTMLElement;
        countEl: HTMLElement;
        passed: number;
        total: number;
    }

    const checkStates: CheckState[] = [];
    let totalPassed = 0;
    let totalChecks = 0;

    PROOF_CHECKS.forEach((check, i) => {
        const row = el("div", "pc");

        const top = el("div", "pc-row");
        const numEl = el("span", "pc-num", `${i + 1}.`);
        const iconEl = el("span", "pc-icon pend", "○");
        const labelEl = el("span", "pc-label", check.label);
        const countEl = el("span", "pc-count pend", "—");
        top.appendChild(numEl);
        top.appendChild(iconEl);
        top.appendChild(labelEl);
        top.appendChild(countEl);
        row.appendChild(top);

        // Description with token replacement
        const desc = check.description
            .replace(/\{component\}/g, target)
            .replace(/\{Component\}/g, target.charAt(0).toUpperCase() + target.slice(1));
        const descEl = el("div", "pc-desc", desc);
        row.appendChild(descEl);

        proofsPanel.appendChild(row);
        checkStates.push({ iconEl, countEl, passed: 0, total: 0 });
    });

    // Summary row
    const summaryRow = el("div", "pc-summary");
    const summaryCountEl = el("span", "pend", "—");
    const summaryIconEl = el("span", "pend", "");
    summaryRow.appendChild(summaryCountEl);
    summaryRow.appendChild(summaryIconEl);
    proofsPanel.appendChild(summaryRow);

    // --- Update check state from prove results ---
    function updateCheck(index: number, passed: number, total: number) {
        const cs = checkStates[index];
        cs.passed = passed;
        cs.total = total;
        const allPass = passed === total && total > 0;
        const anyFail = passed < total;
        cs.iconEl.textContent = total === 0 ? "○" : allPass ? "PASS" : "FAIL";
        cs.iconEl.className = `pc-icon ${total === 0 ? "pend" : allPass ? "pass" : "fail"}`;
        cs.countEl.textContent = `${passed}/${total}`;
        cs.countEl.className = `pc-count ${total === 0 ? "pend" : allPass ? "pass" : "fail"}`;
    }

    function updateSummary() {
        totalPassed = checkStates.reduce((s, c) => s + c.passed, 0);
        totalChecks = checkStates.reduce((s, c) => s + c.total, 0);
        const allPass = totalPassed === totalChecks && totalChecks > 0;
        summaryCountEl.textContent = `${totalPassed}/${totalChecks} passed`;
        summaryCountEl.className = allPass ? "pass" : totalChecks === 0 ? "pend" : "fail";
        summaryIconEl.textContent = totalChecks === 0 ? "" : allPass ? " PASS" : ` · ${totalChecks - totalPassed} failed`;
        summaryIconEl.className = allPass ? "pass" : "fail";
    }

    // --- Extract per-component checks from a prove result ---
    function countForComponent(result: any, groups: string[]): { passed: number; total: number } {
        const checks: any[] = result.checks ?? [];
        const matching = checks.filter((c: any) => {
            if (!groups.includes(c.group)) return false;
            // Filter to this component
            const name = (c.name ?? "").toLowerCase();
            return name.includes(target.toLowerCase());
        });
        const passed = matching.filter((c: any) => c.status === "pass").length;
        return { passed, total: matching.length };
    }

    // --- Prove All: run all prove commands, update each check ---
    proveAllBtn.onclick = async () => {
        proveAllBtn.textContent = "Running...";
        proveAllBtn.disabled = true;

        // Run all commands in parallel
        const commands = [...new Set(PROOF_CHECKS.map(c => c.command))];
        const results = await Promise.all(
            commands.map(cmd => {
                const args = cmd === "event-payload" ? ["prove", cmd, "--component", target] : ["prove", cmd];
                return runCli(args).then(r => [cmd, r] as [string, any]);
            })
        );
        const resultMap: Record<string, any> = Object.fromEntries(results);

        PROOF_CHECKS.forEach((check, i) => {
            const result = resultMap[check.command];
            if (!result) { updateCheck(i, 0, 0); return; }
            const { passed, total } = countForComponent(result, check.groups);
            updateCheck(i, passed, total);
        });

        updateSummary();
        proveAllBtn.textContent = totalPassed === totalChecks ? `PASS ${totalPassed}/${totalChecks}` : `FAIL ${totalChecks - totalPassed} failed`;
        proveAllBtn.disabled = false;
        tsEl.textContent = `Last: ${new Date().toLocaleTimeString()}`;
    };

    // ==================== EVENTS TAB ====================

    // Styles for events table and modal
    const evStyle = document.createElement("style");
    evStyle.textContent = `
        .pv .ev-tbl { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 11px; }
        .pv .ev-tbl th { text-align: left; padding: 5px 6px; border-bottom: 2px solid var(--sd-border, #e2e8f0); font-size: 10px; text-transform: uppercase; color: var(--sd-text-dim, #475569); }
        .pv .ev-tbl td { padding: 5px 6px; border-bottom: 1px solid var(--sd-border, #e2e8f0); vertical-align: top; font-size: 11px; }
        .pv .ev-tbl tr:hover { background: var(--sd-surface-raised, #f9fafb); }
        .pv .ev-tbl col.ev-c-event { width: 16%; } .pv .ev-tbl col.ev-c-payload { width: 8%; }
        .pv .ev-tbl col.ev-c-route { width: 22%; } .pv .ev-tbl col.ev-c-process { width: 26%; }
        .pv .ev-tbl col.ev-c-paint { width: 28%; }
        .pv .ev-mono { font-family: "SF Mono", ui-monospace, monospace; font-size: 10px; color: var(--sd-text-dim, #475569); white-space: pre-wrap; word-break: break-all; }
        .pv .ev-btn-view { padding: 1px 6px; border: 1px solid var(--sd-border, #d1d5db); border-radius: 3px; background: var(--sd-surface-base, #fff); cursor: pointer; font-size: 9px; font-weight: 600; }
        .pv .ev-btn-view:hover { background: var(--sd-surface-raised, #f3f4f6); }
        .pv .ev-delta { color: var(--sd-accent, #2563eb); font-weight: 600; }
        .pv .pv-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); z-index: 9999; display: flex; align-items: center; justify-content: center; }
        .pv .pv-modal { background: var(--sd-surface-base, #fff); border-radius: 8px; padding: 16px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
        .pv .pv-modal-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .pv .pv-modal-title { font-size: 13px; font-weight: 600; }
        .pv .pv-modal-close { border: none; background: none; cursor: pointer; font-size: 16px; color: var(--sd-text-dim, #475569); padding: 2px 6px; }
        .pv .pv-modal-close:hover { color: var(--sd-text, #0f172a); }
        .pv .pv-modal-body { font-family: "SF Mono", ui-monospace, monospace; font-size: 11px; color: var(--sd-text, #0f172a); white-space: pre-wrap; word-break: break-all; background: var(--sd-surface-raised, #f9fafb); border-radius: 4px; padding: 12px; }
    `;
    eventsPanel.appendChild(evStyle);

    // Events table
    const evTbl = document.createElement("table");
    evTbl.className = "ev-tbl";
    const evColgroup = document.createElement("colgroup");
    for (const cls of ["ev-c-event", "ev-c-payload", "ev-c-route", "ev-c-process", "ev-c-paint"]) {
        const col = document.createElement("col");
        col.className = cls;
        evColgroup.appendChild(col);
    }
    evTbl.appendChild(evColgroup);

    const evThead = document.createElement("thead");
    const evHr = document.createElement("tr");
    for (const l of ["Event", "Payload", "Route", "Process", "Paint"]) evHr.appendChild(el("th", undefined, l));
    evThead.appendChild(evHr);
    evTbl.appendChild(evThead);

    const evTbody = document.createElement("tbody");
    evTbl.appendChild(evTbody);

    const eventsEmpty = el("div", "empty", "Interact with the component to see events");
    eventsPanel.appendChild(eventsEmpty);
    eventsPanel.appendChild(evTbl);
    evTbl.style.display = "none";

    // State tracking for paint deltas
    let lastState: Record<string, any> = {};

    // Modal helper
    function showPayloadModal(eventName: string, payload: any) {
        const overlay = el("div", "pv-modal-overlay");
        const modal = el("div", "pv-modal");
        const hdr = el("div", "pv-modal-hdr");
        hdr.appendChild(el("span", "pv-modal-title", `${eventName} — Full Payload`));
        const closeBtn = el("button", "pv-modal-close", "x") as HTMLButtonElement;
        closeBtn.onclick = () => overlay.remove();
        hdr.appendChild(closeBtn);
        modal.appendChild(hdr);
        const body = el("div", "pv-modal-body", JSON.stringify(payload, null, 2));
        modal.appendChild(body);
        overlay.appendChild(modal);
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        root.appendChild(overlay);
    }

    // Compute paint delta — shows ConfigBase metadata intent change
    function computeDelta(event: any): { intent: string; delta: string } {
        const name = event.name ?? "";
        const data = event.data ?? {};

        if (name === "sort") {
            return { intent: "metadata.sortField", delta: `Δ metadata.sortField: ${data.field ?? "?"}\nΔ metadata.sortDir: ${data.dir ?? "asc"}` };
        }
        if (name === "page") {
            const prev = lastState.currentPage ?? 1;
            const next = data.page ?? 1;
            lastState.currentPage = next;
            return { intent: "metadata.currentPage", delta: `Δ metadata.currentPage: ${prev} → ${next}` };
        }
        if (name === "row:hover") {
            const prev = lastState.hoverRow ?? "null";
            lastState.hoverRow = data.index;
            return { intent: "metadata.hoverRow", delta: `Δ metadata.hoverRow: ${prev} → ${data.index}` };
        }
        if (name === "row:leave") {
            const prev = lastState.hoverRow ?? "null";
            lastState.hoverRow = null;
            return { intent: "metadata.hoverRow", delta: `Δ metadata.hoverRow: ${prev} → null` };
        }
        if (name === "row:click" || name === "select") {
            const prev = lastState.selectedRow ?? "null";
            lastState.selectedRow = data.index;
            return { intent: "metadata.selectedRow", delta: `Δ metadata.selectedRow: ${prev} → ${data.index}` };
        }
        if (name === "row:select") {
            const prev = JSON.stringify(lastState.selected ?? []);
            lastState.selected = data.selected;
            return { intent: "metadata.selected", delta: `Δ metadata.selected: ${prev} → ${JSON.stringify(data.selected ?? [])}` };
        }
        if (name === "cell:click" || name === "cell:dblclick") {
            return { intent: "metadata.editCell", delta: `Δ metadata.editCell: null → {${data.index},${data.field}}` };
        }
        if (name === "cell:edit") {
            return { intent: "metadata.rows", delta: `Δ metadata.rows[${data.index}].${data.field}: ${data.previous ?? "?"} → ${data.value ?? "?"}` };
        }
        if (name === "column:resize") {
            return { intent: "metadata.colWidths", delta: `Δ metadata.colWidths.${data.field}: → ${data.width}px` };
        }
        if (name === "filter") {
            return { intent: "metadata.rows", delta: `Δ metadata.rows: filtered ${data.field} ${data.operator ?? "eq"} ${data.value}` };
        }
        if (name === "reorder") {
            return { intent: "metadata.rows", delta: `Δ metadata.rows: reordered` };
        }
        // Generic fallback
        const key = name.replace(":", "_");
        return { intent: `metadata.${key}`, delta: `Δ metadata.${key}: updated` };
    }

    // Public method — host calls this to push events into the Events tab
    (root as any).pushEvent = (event: any) => {
        eventsEmpty.style.display = "none";
        evTbl.style.display = "table";

        const tr = document.createElement("tr");
        const data = event.data ?? {};
        const name = event.name ?? "?";

        // Event column — name + coordinates
        const evTd = el("td", "ev-mono");
        const coordLines = Object.entries(data)
            .filter(([k]) => !["row", "rows", "selected"].includes(k) || k === "selected")
            .map(([k, v]) => `  ${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
            .join("\n");
        evTd.textContent = name + (coordLines ? "\n" + coordLines : "");
        tr.appendChild(evTd);

        // Payload column — View button
        const payTd = document.createElement("td");
        const viewBtn = el("button", "ev-btn-view", "View") as HTMLButtonElement;
        viewBtn.onclick = (e) => { e.stopPropagation(); showPayloadModal(name, event); };
        payTd.appendChild(viewBtn);
        tr.appendChild(payTd);

        // Route column
        const routeTd = el("td", "ev-mono");
        routeTd.textContent = `handler: ${target}\non: ${name}`;
        tr.appendChild(routeTd);

        // Process column
        const procTd = el("td", "ev-mono");
        const coordArgs = Object.entries(data)
            .filter(([k]) => !["row", "rows"].includes(k))
            .map(([k, v]) => `--${k} ${typeof v === "object" ? JSON.stringify(v) : v}`)
            .join(" ");
        procTd.textContent = `safedesk data\n  ${name.replace(":", "-")}\n  --component ${target}\n  ${coordArgs}`;
        tr.appendChild(procTd);

        // Paint column — ConfigBase metadata intent delta
        const { intent, delta } = computeDelta(event);
        const paintTd = el("td", "ev-mono");
        const intentEl = el("div", undefined, intent);
        const deltaEl = el("div", "ev-delta", delta);
        paintTd.appendChild(intentEl);
        paintTd.appendChild(deltaEl);
        tr.appendChild(paintTd);

        // Insert at top, keep max 50
        if (evTbody.firstChild) {
            evTbody.insertBefore(tr, evTbody.firstChild);
        } else {
            evTbody.appendChild(tr);
        }
        while (evTbody.children.length > 50) evTbody.removeChild(evTbody.lastChild!);
    };

    root.appendChild(proofsPanel);
    root.appendChild(eventsPanel);

    container.appendChild(root);
    return root;
}