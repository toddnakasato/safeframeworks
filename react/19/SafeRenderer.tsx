import { useState, useEffect, useRef } from "react";
import { getDataSource } from "safecontracts";
import type { ReactNode } from "react";
import type { ConfigBase, ConfigLayout, OnSafeEvent } from "safecontracts";
import { buildComponent } from "../../utils/render";
import { SafeCard } from "./SafeCard";
import { SafeColumns } from "./SafeColumns";
import { SafeLayout } from "./SafeLayout";
import { SafeButton } from "./SafeButton";
import type { RenderChild } from "../../builders/layout";

// Universal DOM render callback — stamps handler before rendering children
const renderChild: RenderChild = buildComponent;

function extractData(config: ConfigBase): { inline: any; list: any[]; record: Record<string, any> } {
    const raw = getDataSource(config)?.inline;
    const list = Array.isArray(raw) ? raw : [];
    const record = (Array.isArray(raw) ? raw[0] : raw) ?? {};
    return { inline: raw, list, record };
}

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface RenderContext {
    parentContext?: { parent: string; path: string };
    handler?: string;
}

/** Bridge — mounts any component via shared buildComponent (DOM builder). */
function BuilderBridge({ config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!ref.current) return;
        ref.current.innerHTML = "";
        const root = buildComponent(config, onEvent);
        if (root) ref.current.appendChild(root);
    }, [config, onEvent]);
    return <div ref={ref} />;
}

/** Dev-only bridge — mounts proof-viewer via buildComponent (DOM builder). */
function ProofViewerBridge({ config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent }) {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const root = buildComponent(config, onEvent);
        container.appendChild(root);
        return () => { root.remove(); };
    }, [config]);
    return <div ref={containerRef} />;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 * Rule: only composition components (layout, columns, card, button) have framework-native
 * handling because they need React to recurse into children. Every other component delegates
 * to BuilderBridge which calls buildComponent — one builder, one path.
 *
 ----------------------------------------------------------------------------------------------------*/

export function renderConfigBase(config: ConfigBase, onEvent?: OnSafeEvent, ctx?: RenderContext): ReactNode {
    const component = config.component ?? (config.metadata.component as string);
    const { record, list } = extractData(config);

    const handler = config.eventHandler?.handler ?? ctx?.handler;

    const childCtx = (extra?: Partial<RenderContext>): RenderContext => ({
        ...ctx,
        ...extra,
        handler
    });

    const stampedOnEvent: OnSafeEvent | undefined =
        onEvent && handler
            ? (event) => { onEvent({ ...event, handler }); }
            : onEvent;

    // --- Composition components (need React recursion into children) ---

    if (component === "layout") {
        return <SafeLayout config={config} onEvent={stampedOnEvent} renderChild={renderChild} />;
    }

    if (component === "columns") {
        return <SafeColumns config={config} renderChild={(_key, child) => renderConfigBase(child, stampedOnEvent, childCtx())} onEvent={stampedOnEvent} />;
    }

    if (component === "card") {
        const childNodes: ReactNode[] = [];
        if (config.children) {
            for (const [key, child] of Object.entries(config.children)) {
                childNodes.push(
                    <div key={key} data-child={key}>
                        {renderConfigBase(child, stampedOnEvent, childCtx({
                            parentContext: { parent: (config.metadata.ref as string) ?? "card", path: key }
                        }))}
                    </div>
                );
            }
        }
        return (
            <div>
                <SafeCard config={config} data={record} onEvent={stampedOnEvent} />
                {childNodes.length > 0 && (
                    <div data-role="card-actions" style={{ display: "flex", gap: "var(--sd-space-md)", padding: "var(--sd-space-md) var(--sd-space-lg)" }}>
                        {childNodes}
                    </div>
                )}
            </div>
        );
    }

    if (component === "button") {
        return (
            <SafeButton
                config={config}
                onEvent={stampedOnEvent}
                eventContext={ctx?.parentContext}
                renderChild={(key, child) =>
                    renderConfigBase(child, stampedOnEvent, childCtx({ parentContext: { parent: (config.metadata.ref as string) ?? "button", path: key } }))
                }
            />
        );
    }

    // --- Dev-only ---
    if (component === "proof-viewer") {
        return <ProofViewerBridge config={config} onEvent={stampedOnEvent} />;
    }

    // --- All other components delegate to the builder — one path, no reinvention ---
    return <BuilderBridge config={config} onEvent={stampedOnEvent} />;
}

// Layout resolution lives in safecontracts (resolver-layout.ts) — re-exported here
export { resolveConfigLayout } from "safecontracts";
export type { ConfigResolver } from "safecontracts";
