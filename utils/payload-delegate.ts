/**
 * utils/payload-delegate.ts — bridges safecontracts safeFire to the Tauri host.
 *
 * Provides buildPayloadViaCli — the BuildPayloadFn the host injects into
 * createSafeFireContext. Calls the compiled safedesk binary via Tauri invoke.
 *
 * Builders never import this. The renderer does, once, and passes the
 * SafeFireContext to every builder.
 */
import type { BuildPayloadFn, PayloadResult } from "../../safecontracts/src/contracts-safefire";

async function invoke<T>(cmd: string, args?: Record<string, any>): Promise<T> {
    const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
    return tauriInvoke<T>(cmd, args);
}

/**
 * BuildPayloadFn implementation for Tauri desktop.
 * Calls safedesk payload build via safecli_run Tauri command.
 */
export const buildPayloadViaCli: BuildPayloadFn = async (component: string, event: string, coords: Record<string, any>, rows: Record<string, any>[]): Promise<PayloadResult> => {
    const args: string[] = ["payload", "build", "--component", component, "--event", event];

    if (rows.length > 0) {
        args.push("--data", JSON.stringify(rows));
    }
    if (coords.index !== undefined) args.push("--index", String(coords.index));
    if (coords.col !== undefined) args.push("--col", String(coords.col));
    if (coords.field) args.push("--field", coords.field);
    if (coords.value !== undefined) args.push("--value", String(coords.value));
    if (coords.dir) args.push("--dir", coords.dir);
    if (coords.page !== undefined) args.push("--page", String(coords.page));
    if (Array.isArray(coords.selected)) args.push("--selected", coords.selected.join(","));
    if (coords.order) args.push("--order", JSON.stringify(coords.order));
    if (coords.operator) args.push("--operator", coords.operator);
    if (coords.width !== undefined) args.push("--width", String(coords.width));
    if (coords.previous !== undefined) args.push("--previous", String(coords.previous));
    if (coords.year !== undefined) args.push("--year", String(coords.year));
    if (coords.month !== undefined) args.push("--month", String(coords.month));
    if (coords.day !== undefined) args.push("--day", String(coords.day));
    if (coords.date) args.push("--date", String(coords.date));
    if (coords.direction) args.push("--direction", String(coords.direction));
    if (coords.query) args.push("--query", String(coords.query));
    if (coords.id) args.push("--id", String(coords.id));
    if (coords.content) args.push("--content", String(coords.content));

    try {
        const out = await invoke<string>("safecli_run", { name: "safedesk", args });
        return JSON.parse(out.trim());
    } catch (e: any) {
        return { ok: false, error: `safedesk payload build failed: ${e}` };
    }
};
