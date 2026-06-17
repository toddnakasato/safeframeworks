/**
 * builders/payload-delegate.ts — delegate payload assembly to the safedesk binary.
 *
 * Builders call fireWithPayload() with coordinates (what happened, where).
 * safedesk builds the full payload from the contract template + datasource.
 * Builder stays dumb. CLI owns the payload.
 *
 * Runs in Tauri webview — calls safedesk via safecli_run Tauri command.
 */
import type { OnSafeEvent, SafeEvent } from "../../safecontracts/src/contracts-events";
import { createSafeEvent } from "../../safecontracts/src/contracts-events";

async function invoke<T>(cmd: string, args?: Record<string, any>): Promise<T> {
    const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
    return tauriInvoke<T>(cmd, args);
}

export interface PayloadCoordinates {
    index?: number;
    col?: number;
    field?: string;
    value?: any;
    dir?: string;
    page?: number;
    selected?: number[];
    order?: any[];
    operator?: string;
    width?: number;
    previous?: any;
    /** Inline data rows — passed as --data JSON to safedesk */
    rows?: Record<string, any>[];
}

/**
 * Call safedesk payload build via Tauri invoke, return assembled payload.
 */
export async function buildPayloadViaCliAsync(
    component: string,
    event: string,
    coords: PayloadCoordinates,
    datasource?: string,
): Promise<{ ok: boolean; data?: Record<string, any>; context?: Record<string, any>; error?: string }> {
    const args: string[] = [
        "payload", "build",
        "--component", component,
        "--event", event,
    ];

    if (datasource) {
        args.push("--datasource", datasource);
    } else if (coords.rows && coords.rows.length > 0) {
        args.push("--data", JSON.stringify(coords.rows));
    }
    if (coords.index !== undefined) args.push("--index", String(coords.index));
    if (coords.col !== undefined) args.push("--col", String(coords.col));
    if (coords.field) args.push("--field", coords.field);
    if (coords.value !== undefined) args.push("--value", String(coords.value));
    if (coords.dir) args.push("--dir", coords.dir);
    if (coords.page !== undefined) args.push("--page", String(coords.page));
    if (coords.selected) args.push("--selected", coords.selected.join(","));
    if (coords.order) args.push("--order", JSON.stringify(coords.order));
    if (coords.operator) args.push("--operator", coords.operator);
    if (coords.width !== undefined) args.push("--width", String(coords.width));
    if (coords.previous !== undefined) args.push("--previous", String(coords.previous));

    try {
        const out = await invoke<string>("safecli_run", { name: "safedesk", args });
        return JSON.parse(out.trim());
    } catch (e: any) {
        return { ok: false, error: `safedesk payload build failed: ${e}` };
    }
}

/**
 * Fire an event by delegating payload assembly to safedesk.
 *
 * Builder calls this instead of fireTable/fireNav etc.
 * 1. Calls safedesk payload build with coordinates
 * 2. Creates SafeEvent with the assembled payload
 * 3. Calls onEvent with the complete event
 */
export async function fireWithPayload(
    onEvent: OnSafeEvent | undefined,
    component: string,
    event: string,
    coords: PayloadCoordinates,
    options?: { instanceId?: string; datasource?: string },
): Promise<void> {
    if (!onEvent) return;

    const result = await buildPayloadViaCliAsync(component, event, coords, options?.datasource);
    if (!result.ok) {
        console.error(`[payload-delegate] ${result.error}`);
        return;
    }

    const safeEvent = createSafeEvent(component, event, result.data, {
        instanceId: options?.instanceId,
        context: result.context,
    });
    onEvent(safeEvent);
}
