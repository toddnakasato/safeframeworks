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
        .pv { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 12px; width: 100%; box-sizing: border-box; }
        .pv .pv-hdr { display: flex; align-items: center; gap: 10px; margin-bottom: 0; flex-wrap: wrap; }
        .pv .pv-title { font-size: 15px; font-weight: 600; }
        .pv .pv-badge { font-size: 10px; padding: 2px 6px; border-radius: 3px; background: #e5e7eb; }
        .pv .pv-btn { padding: 3px 8px; border: 1px solid #d1d5db; border-radius: 3px; background: #fff; cursor: pointer; font-size: 10px; white-space: nowrap; }
        .pv .pv-btn:hover { background: #f3f4f6; }
        .pv .pv-btn:disabled { opacity: 0.5; }
        .pv .pv-btn-p { background: #1e40af; color: #fff; border-color: #1e40af; }
        .pv .pv-btn-p:hover { background: #1d4ed8; }
        .pv .pv-tabs { display: flex; gap: 0; margin: 10px 0 0; border-bottom: 2px solid #e5e7eb; }
        .pv .pv-tab { padding: 6px 14px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; background: none; border-top: none; border-left: none; border-right: none; }
        .pv .pv-tab:hover { color: #374151; }
        .pv .pv-tab.active { color: #1e40af; border-bottom-color: #1e40af; }
        .pv .pv-panel { display: none; padding-top: 10px; }
        .pv .pv-panel.active { display: block; }
        .pv .pass { color: #059669; font-weight: 600; }
        .pv .fail { color: #dc2626; font-weight: 600; }
        .pv .pend { color: #9ca3af; }
        .pv .ts { font-size: 10px; color: #9ca3af; }
        .pv .empty { color: #9ca3af; padding: 16px; text-align: center; }
        .pv .pc { padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
        .pv .pc-row { display: flex; align-items: baseline; gap: 8px; }
        .pv .pc-num { font-size: 10px; color: #9ca3af; min-width: 20px; text-align: right; }
        .pv .pc-icon { font-size: 12px; min-width: 16px; }
        .pv .pc-label { font-size: 12px; font-weight: 600; flex: 1; }
        .pv .pc-count { font-size: 10px; font-family: "SF Mono", ui-monospace, monospace; min-width: 40px; text-align: right; }
        .pv .pc-desc { font-size: 10px; color: #6b7280; margin-left: 44px; margin-top: 2px; line-height: 1.4; }
        .pv .pc-summary { display: flex; align-items: center; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 2px solid #e5e7eb; font-size: 12px; font-weight: 600; }
        .pv .ev-row { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f3f4f6; align-items: flex-start; }
        .pv .ev-name { font-weight: 600; font-size: 12px; min-width: 100px; }
        .pv .ev-shape { flex: 1; font-family: "SF Mono", ui-monospace, monospace; font-size: 10px; color: #6b7280; white-space: pre-wrap; word-break: break-all; }
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
        cs.iconEl.textContent = total === 0 ? "○" : allPass ? "✓" : "✗";
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
        summaryIconEl.textContent = totalChecks === 0 ? "" : allPass ? " ✓" : ` · ${totalChecks - totalPassed} failed`;
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

    // --- Prove All: run all 4 prove commands, update each check ---
    proveAllBtn.onclick = async () => {
        proveAllBtn.textContent = "Running...";
        proveAllBtn.disabled = true;

        // Run all 4 commands in parallel
        const [shapesResult, dumbResult, complianceResult, reconcileResult] = await Promise.all([
            runCli(["prove", "payload-shapes", "--component", target]),
            runCli(["prove", "builders-dumb"]),
            runCli(["prove", "framework-compliance"]),
            runCli(["prove", "builder-reconcile"]),
        ]);

        const resultMap: Record<string, any> = {
            "payload-shapes": shapesResult,
            "builders-dumb": dumbResult,
            "framework-compliance": complianceResult,
            "builder-reconcile": reconcileResult,
        };

        PROOF_CHECKS.forEach((check, i) => {
            const result = resultMap[check.command];
            if (!result) { updateCheck(i, 0, 0); return; }
            const { passed, total } = countForComponent(result, check.groups);
            updateCheck(i, passed, total);
        });

        updateSummary();
        proveAllBtn.textContent = totalPassed === totalChecks ? `✓ ${totalPassed}/${totalChecks}` : `✗ ${totalChecks - totalPassed} failed`;
        proveAllBtn.disabled = false;
        tsEl.textContent = `Last: ${new Date().toLocaleTimeString()}`;
    };

    // ==================== EVENTS TAB ====================

    const eventsLog = el("div", "pv-events-log");
    const eventsEmpty = el("div", "empty", "Interact with the component to see events");
    eventsPanel.appendChild(eventsEmpty);
    eventsPanel.appendChild(eventsLog);

    // Public method — host calls this to push events into the Events tab
    (root as any).pushEvent = (event: any) => {
        eventsEmpty.style.display = "none";
        const entry = el("div", "ev-row");
        const tsEl2 = el("span", "ts", new Date().toLocaleTimeString());
        const nameEl = el("span", "ev-name", `${event.name}`);
        const dataEl = el("div", "ev-shape", event.data ? JSON.stringify(event.data) : "—");
        entry.appendChild(tsEl2);
        entry.appendChild(nameEl);
        entry.appendChild(dataEl);
        eventsLog.insertBefore(entry, eventsLog.firstChild);
        while (eventsLog.children.length > 50) eventsLog.removeChild(eventsLog.lastChild!);
    };

    root.appendChild(proofsPanel);
    root.appendChild(eventsPanel);

    container.appendChild(root);
    return root;
}
