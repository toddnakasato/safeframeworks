import { useState, useEffect, useCallback } from "react";
import { renderConfigBase } from "../SafeRenderer";
import type { ConfigBase, SafeEvent } from "safecontracts";
import { resolveDataSources } from "safecontracts";
import { listen } from "@tauri-apps/api/event";
import { getConfig, getState, getLayout, getScene, getComponent, getData, dispatchEvent } from "./client";

async function resolveLayout(layout: any): Promise<ConfigBase> {
  const children: Record<string, ConfigBase> = {};
  for (const [slot, ref] of Object.entries(layout.slots ?? {})) {
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
  return { component: "layout", metadata: layout.metadata ?? {}, children };
}

export default function App() {
  const [root, setRoot] = useState<ConfigBase | null>(null);
  const [eventHandlers, setEventHandlers] = useState<string[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const config = await getConfig();
      const state = await getState();
      const layoutPath = (config.layout as string) ?? "layouts/layout.json";
      const layoutName = layoutPath.split("/").pop()?.replace(".json", "") ?? "layout";
      const layout = await getLayout(layoutName);
      const activeScene = state.activeScene ?? "home";

      // Resolve templates in slots
      const resolvedSlots: Record<string, string> = {};
      for (const [slot, ref] of Object.entries(layout.slots ?? {})) {
        resolvedSlots[slot] = (ref as string).replace("{{activeScene}}", `${activeScene}.json`);
      }
      layout.slots = resolvedSlots;

      const resolved = await resolveLayout(layout);
      const withData = await resolveDataSources(resolved, { readData: getData, state });
      const handlers = Object.values(withData.children ?? {})
        .map((c: any) => c.eventHandler?.handler)
        .filter(Boolean) as string[];
      setEventHandlers(handlers);
      setRoot(withData);
    } catch (e: any) {
      setError(String(e));
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const unlisten = listen<string>("fs-change", () => load());
    return () => { unlisten.then((fn) => fn()); };
  }, []);

  const handleEvent = useCallback((event: SafeEvent) => {
    const payload = (event.data ?? {}) as Record<string, any>;
    const context = event.context ?? {};
    const handler = (event as any).handler;
    if (handler) {
      dispatchEvent(event.name, { ...payload, ...context }, handler).then(() => load());
    }
  }, [eventHandlers]);

  if (error) return <div style={{ padding: 16, color: "red" }}>{error}</div>;
  if (!root) return null;
  return <>{renderConfigBase(root, handleEvent)}</>;
}
