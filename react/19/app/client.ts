import { invoke } from "@tauri-apps/api/core";
import { dispatchEvent } from "safecontracts";
import type { SafeEvent, HandlerFile, HandlerResult, DispatchContext } from "safecontracts";

export async function getConfig(): Promise<any> {
  const raw = await invoke<string>("read_config");
  return JSON.parse(raw);
}

export async function getState(): Promise<any> {
  const raw = await invoke<string>("read_state");
  return JSON.parse(raw);
}

export async function getLayout(name: string): Promise<any> {
  const raw = await invoke<string>("read_file_content", { path: `layouts/${name}.json` });
  return JSON.parse(raw);
}

export async function getScene(name: string): Promise<any> {
  const raw = await invoke<string>("read_file_content", { path: `scenes/${name}.json` });
  return JSON.parse(raw);
}

export async function getComponent(name: string): Promise<any> {
  const raw = await invoke<string>("read_file_content", { path: `components/${name}.json` });
  return JSON.parse(raw);
}

/** Load data/<name>.json for source: "file" datasources. */
export async function getData(name: string): Promise<any> {
  try {
    const raw = await invoke<string>("read_file_content", { path: `data/${name}.json` });
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/**
 * Dev-app dispatch context: handler files via invoke, "runtime state" action
 * implemented as read-modify-write of state.json (this dev harness has no
 * CLI; safeapp proper routes serverCall to the safedesk binary).
 */
const ctx: DispatchContext = {
  readHandlerFile: async (name: string): Promise<HandlerFile | null> => {
    try {
      const raw = await invoke<string>("read_file_content", { path: `events/${name}.json` });
      return JSON.parse(raw) as HandlerFile;
    } catch {
      return null;
    }
  },
  serverCall: async (_domain: string, action: string, args?: Record<string, any>) => {
    if (action !== "state") return null;
    const stateRaw = await invoke<string>("read_state");
    const state = JSON.parse(stateRaw);
    for (const [k, v] of Object.entries(args ?? {})) {
      if (v === undefined) continue;
      state[k] = v;
    }
    await invoke("write_state", { content: JSON.stringify(state, null, 2) + "\n" });
    return state;
  },
};

export async function dispatch(event: SafeEvent): Promise<HandlerResult[]> {
  const results = await dispatchEvent(event, ctx);
  for (const r of results) {
    if (!r.ok) {
      console.error(`[dispatch] handler failed — on: "${event.name}", handler file: "${event.handler}":`, r.error);
    }
  }
  return results;
}
