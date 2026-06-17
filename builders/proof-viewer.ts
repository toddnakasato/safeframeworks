/**
 * builders/proof-viewer.ts — dev-only PRRR workbench for safeframeworks.
 *
 * Shows the full Payload, Route, Reply, Respond chain per event.
 * All data comes from real sources — nothing faked.
 *
 *   Payload: COMPONENT_EVENTS + COMPONENT_PAYLOAD_SHAPES (safecontracts)
 *   Route:   events/prove-{component}.json (safeframeworks, real handler file)
 *   Reply:   actual safedesk CLI output (live, via safecli_run)
 *   Respond: proof file on disk (safeframeworks/proofs/)
 *
 * config.metadata.target — the component type to inspect
 */
import type { ConfigBase, OnSafeEvent, EventHandler } from "../../safecontracts/src/contracts";
import { COMPONENT_EVENTS, COMPONENT_PAYLOAD_SHAPES } from "../../safecontracts/src/contracts";

async function invoke<T>(cmd: string, args?: Record<string, any>): Promise<T> {
    const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
    return tauriInvoke<T>(cmd, args);
}

async function readJsonFile(path: string): Promise<any> {
    try {
        const raw = await invoke<string>("read_file_content", { path });
        return JSON.parse(raw);
    } catch { return null; }
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
    _onEvent?: OnSafeEvent,
): HTMLElement {
    const target = (config.metadata?.target as string) ?? "";
    const events = COMPONENT_EVENTS[target] ?? [];
    const shapes = COMPONENT_PAYLOAD_SHAPES[target] ?? {};

    const root = el("div", "pv");
    root.setAttribute("data-component", "proof-viewer");
    root.setAttribute("data-target", target);

    const style = document.createElement("style");
    style.textContent = `
        .pv { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 12px; width: 100%; box-sizing: border-box; }
        .pv .pv-hdr { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
        .pv .pv-title { font-size: 15px; font-weight: 600; }
        .pv .pv-badge { font-size: 10px; padding: 2px 6px; border-radius: 3px; background: #e5e7eb; }
        .pv .pv-btn { padding: 3px 8px; border: 1px solid #d1d5db; border-radius: 3px; background: #fff; cursor: pointer; font-size: 10px; white-space: nowrap; }
        .pv .pv-btn:hover { background: #f3f4f6; }
        .pv .pv-btn:disabled { opacity: 0.5; }
        .pv .pv-btn-p { background: #1e40af; color: #fff; border-color: #1e40af; }
        .pv .pv-btn-p:hover { background: #1d4ed8; }
        .pv table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .pv th { text-align: left; padding: 5px 6px; border-bottom: 2px solid #e5e7eb; font-size: 10px; text-transform: uppercase; color: #6b7280; }
        .pv td { padding: 5px 6px; border-bottom: 1px solid #f3f4f6; font-size: 11px; vertical-align: top; overflow: hidden; text-overflow: ellipsis; }
        .pv tr:hover { background: #f9fafb; }
        .pv .m { font-family: "SF Mono", ui-monospace, monospace; font-size: 10px; color: #6b7280; white-space: pre-wrap; word-break: break-all; }
        .pv .pass { color: #059669; font-weight: 600; }
        .pv .fail { color: #dc2626; font-weight: 600; }
        .pv .pend { color: #9ca3af; }
        .pv .ts { font-size: 10px; color: #9ca3af; }
        .pv .exp { display: none; }
        .pv .exp.open { display: table-row; }
        .pv .exp td { background: #f9fafb; border-bottom: 1px solid #e5e7eb; padding: 8px; }
        .pv .empty { color: #9ca3af; padding: 16px; text-align: center; }
        .pv col.c-ev { width: 10%; } .pv col.c-payload { width: 18%; } .pv col.c-route { width: 22%; }
        .pv col.c-reply { width: 20%; } .pv col.c-respond { width: 14%; } .pv col.c-status { width: 8%; } .pv col.c-btn { width: 8%; }
    `;
    root.appendChild(style);

    // Header
    const hdr = el("div", "pv-hdr");
    hdr.appendChild(el("span", "pv-title", `${target} FRRR`));
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

    // Table
    const tbl = document.createElement("table");
    const colgroup = document.createElement("colgroup");
    for (const cls of ["c-ev", "c-payload", "c-route", "c-reply", "c-respond", "c-status", "c-btn"]) {
        const col = document.createElement("col");
        col.className = cls;
        colgroup.appendChild(col);
    }
    tbl.appendChild(colgroup);

    const thead = document.createElement("thead");
    const hr = document.createElement("tr");
    for (const l of ["Event", "Payload", "Route", "Reply", "Respond", "Status", ""]) hr.appendChild(el("th", undefined, l));
    thead.appendChild(hr);
    tbl.appendChild(thead);

    const tbody = document.createElement("tbody");

    // State per row — stores live reply data
    const rowState: Record<string, { replyTd: HTMLElement; respondTd: HTMLElement; statusTd: HTMLElement; proveBtn: HTMLButtonElement }> = {};

    for (const eventName of events) {
        const shape = shapes[eventName];
        const tr = document.createElement("tr");
        tr.setAttribute("data-event", eventName);
        tr.style.cursor = "pointer";

        // Event
        tr.appendChild(el("td", undefined, eventName));

        // Payload — real shape from COMPONENT_PAYLOAD_SHAPES
        const payloadTd = el("td", "m");
        if (shape) {
            const lines: string[] = [];
            if (shape.data) for (const [k, v] of Object.entries(shape.data)) lines.push(`data.${k}: ${v}`);
            if (shape.context) for (const [k, v] of Object.entries(shape.context)) lines.push(`ctx.${k}: ${v}`);
            payloadTd.textContent = lines.join("\n") || "—";
        } else payloadTd.textContent = "no shape declared";
        tr.appendChild(payloadTd);

        // Route — known statically from handler naming convention, enriched on mount
        const routeTd = el("td", "m");
        routeTd.textContent = `handler: prove-${target}\non: ${eventName}\ncli: safedesk prove fire-shapes --component ${target} --event ${eventName}`;
        tr.appendChild(routeTd);

        // Reply — filled after prove runs
        const replyTd = el("td", "m pend", "—");
        tr.appendChild(replyTd);

        // Respond — proof file path per event
        const evSuffix = eventName.replace(":", "_");
        const respondTd = el("td", "m pend", `proofs/fire-shapes-${target}-${evSuffix}.json`);
        tr.appendChild(respondTd);

        // Status
        const statusTd = el("td", "pend", "—");
        tr.appendChild(statusTd);

        // Prove button
        const btnTd = document.createElement("td");
        const proveBtn = el("button", "pv-btn", "Prove") as HTMLButtonElement;
        btnTd.appendChild(proveBtn);
        tr.appendChild(btnTd);

        rowState[eventName] = { replyTd, respondTd, statusTd, proveBtn };

        // Single event prove
        proveBtn.onclick = async (e) => {
            e.stopPropagation();
            proveBtn.textContent = "...";
            proveBtn.disabled = true;
            const result = await runCli(["prove", "fire-shapes", "--component", target, "--event", eventName]);
            updateRow(eventName, result);
            proveBtn.disabled = false;
        };

        tbody.appendChild(tr);

        // Expand row — full FRRR detail, filled on mount
        const expRow = document.createElement("tr");
        expRow.className = "exp";
        expRow.setAttribute("data-expand-for", eventName);
        const expTd = document.createElement("td");
        expTd.colSpan = 7;
        expTd.className = "m";
        expTd.textContent = "loading...";
        expRow.appendChild(expTd);
        tbody.appendChild(expRow);

        tr.onclick = () => expRow.classList.toggle("open");
    }

    tbl.appendChild(tbody);
    root.appendChild(tbl);

    // --- Update a row from real proof result ---
    function updateRow(eventName: string, result: any) {
        const rs = rowState[eventName];
        if (!rs) return;

        // Reply — actual CLI response
        const checks = result.checks ?? [];
        const eventChecks = checks.filter((c: any) => c.name?.includes(eventName));
        const allPass = eventChecks.length > 0 && eventChecks.every((c: any) => c.status === "pass");
        const anyFail = eventChecks.some((c: any) => c.status === "fail");

        rs.replyTd.className = "m";
        rs.replyTd.textContent = eventChecks.length > 0
            ? eventChecks.map((c: any) => `${c.status === "pass" ? "✓" : "✗"} ${c.name}`).join("\n")
            : `ok: ${result.ok}\ntotal: ${result.total}\npassed: ${result.passed}\nfailed: ${result.failed}`;

        // Respond — proof file written + timestamp
        const evSuffix = eventName.replace(":", "_");
        rs.respondTd.className = "m";
        rs.respondTd.textContent = `proofs/fire-shapes-${target}-${evSuffix}.json\nts: ${result.ts ?? "—"}`;

        // Status
        rs.statusTd.className = anyFail ? "fail" : allPass ? "pass" : "pend";
        rs.statusTd.textContent = anyFail ? "✗ fail" : allPass ? "✓ pass" : "—";
        rs.proveBtn.textContent = anyFail ? "✗" : allPass ? "✓" : "Prove";
    }

    // --- Update all rows ---
    function updateAll(result: any) {
        for (const eventName of events) updateRow(eventName, result);
        tsEl.textContent = result.ts ? `Last: ${result.ts}` : "";
    }

    // --- Prove All ---
    proveAllBtn.onclick = async () => {
        proveAllBtn.textContent = "Running...";
        proveAllBtn.disabled = true;
        const result = await runCli(["prove", "fire-shapes", "--component", target]);
        proveAllBtn.textContent = result.ok ? `✓ ${result.passed}/${result.total}` : `✗ ${result.failed} failed`;
        proveAllBtn.disabled = false;
        updateAll(result);
    };

    // --- On mount: load real handler file + last proof ---
    (async () => {
        // Load real handler file for Route column
        const handlerFile = await readJsonFile(`events/prove-${target}.json`);
        const handlers: EventHandler[] = handlerFile?.handlers ?? [];

        for (const eventName of events) {
            const rs = rowState[eventName];
            const handler = handlers.find((h: any) => h.on === eventName);

            // Route column — real handler config
            if (handler && rs) {
                const h = handler as any;
                const lines: string[] = [];
                lines.push(`handler: prove-${target}`);
                lines.push(`on: ${h.on}`);
                lines.push(`domain: ${h.domain}`);
                lines.push(`action: ${h.action}`);
                if (h.payload) {
                    for (const [src, tgt] of Object.entries(h.payload)) {
                        lines.push(`payload: ${src} → ${tgt}`);
                    }
                }
                if (h.args) lines.push(`args: ${JSON.stringify(h.args)}`);
                lines.push(`cli: safedesk ${h.domain} ${h.action} --component ${h.args?.component ?? target}`);
                rs.replyTd.parentElement?.querySelector("td:nth-child(3)")?.replaceChildren();
                const routeTd = rs.replyTd.parentElement?.querySelector("td:nth-child(3)");
                if (routeTd) {
                    routeTd.className = "m";
                    routeTd.textContent = lines.join("\n");
                }
            }

            // Expand row — full FRRR detail from real sources
            const expTd = tbody.querySelector(`tr[data-expand-for="${eventName}"] td`);
            if (expTd) {
                const shape = shapes[eventName];
                const h = handler as any;
                const lines: string[] = [];

                lines.push("FIRE");
                if (shape?.data) for (const [k, v] of Object.entries(shape.data)) lines.push(`  data.${k}: ${v}`);
                if (shape?.context) for (const [k, v] of Object.entries(shape.context)) lines.push(`  ctx.${k}: ${v}`);
                if (!shape) lines.push("  (no shape declared)");

                lines.push("\nROUTE");
                if (h) {
                    lines.push(`  handler: prove-${target}`);
                    lines.push(`  on: ${h.on}`);
                    lines.push(`  domain: ${h.domain}`);
                    lines.push(`  action: ${h.action}`);
                    if (h.payload) for (const [s, t] of Object.entries(h.payload)) lines.push(`  payload: ${s} → ${t}`);
                    if (h.args) lines.push(`  args: ${JSON.stringify(h.args)}`);
                    lines.push(`  cli: safedesk ${h.domain} ${h.action} --component ${h.args?.component ?? target} --event ${eventName}`);
                } else {
                    lines.push("  (no handler matched)");
                }

                lines.push("\nREPLY");
                if (h?.returns) lines.push(`  returns: ${JSON.stringify(h.returns)}`);
                if (h && (h as any).bind) lines.push(`  bind: ${JSON.stringify((h as any).bind)}`);
                else lines.push("  bind: none");

                lines.push("\nRESPOND");
                lines.push(`  writes: safeframeworks/proofs/fire-shapes-${target}-${eventName.replace(":", "_")}.json`);
                lines.push("  watcher: fs-change → proof-viewer re-reads status");

                expTd.textContent = lines.join("\n");
            }
        }

        // Load last proof result
        const lastProof = await readJsonFile(`proofs/fire-shapes-${target}.json`);
        if (lastProof) updateAll(lastProof);
    })();

    container.appendChild(root);
    return root;
}
