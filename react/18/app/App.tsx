import { useState, useEffect, useCallback } from "react";
import { renderConfigBase } from "../SafeRenderer";
import type { ConfigBase, SafeEvent } from "safecontracts";
import { getConfig, getState, getLayout, getScene, getComponent, dispatchEvent } from "./client";

async function resolveLayout(layout: any): Promise<ConfigBase> {
  const children: Record<string, ConfigBase> = {};
  for (const [slot, ref] of Object.entries(layout.children ?? {})) {
    const path = ref as string;
    if (path.includes("{{")) continue;
    const parts = path.split("/");
    const folder = parts[0];
    const name = parts[parts.length - 1].replace(".json", "");
    let json: any = null;
    if (folder === "components") json = await getComponent(name);
    else if (folder === "scenes") json = await getScene(name);
    if (json) children[slot] = json as ConfigBase;
  }
  return { metadata: layout.metadata, children };
}

export default function App() {
  const [root, setRoot] = useState<ConfigBase | null>(null);
  const [eventHandlers, setEventHandlers] = useState<string[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const config = await getConfig();
      const state = await getState();
      const layoutPath = (config.layout as string) ?? "layout";
      const layoutName = layoutPath.split("/").pop()?.replace(".json", "") ?? "layout";
      const layout = await getLayout(layoutName);
      const activeScene = state.activeScene ?? "dashboard";

      const resolvedChildren: Record<string, string> = {};
      for (const [slot, ref] of Object.entries(layout.children ?? {})) {
        resolvedChildren[slot] = (ref as string).replace("{{activeScene}}", `${activeScene}.json`);
      }
      layout.children = resolvedChildren;

      const resolved = await resolveLayout(layout);
      const handlers = Object.values(resolved.children ?? {})
        .map((c: any) => c.eventHandler)
        .filter(Boolean) as string[];
      setEventHandlers(handlers);
      setRoot(resolved);
    } catch (e: any) {
      setError(String(e));
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleEvent = useCallback((event: SafeEvent) => {
    const payload = (event.data ?? {}) as Record<string, any>;
    const context = event.context ?? {};
    for (const h of eventHandlers) {
      dispatchEvent(event.name, { ...payload, ...context }, h).then(() => load());
    }
  }, [eventHandlers]);

  if (error) return <div style={{ padding: 16, color: "red" }}>{error}</div>;
  if (!root) return null;
  return <>{renderConfigBase(root, handleEvent)}</>;
}
