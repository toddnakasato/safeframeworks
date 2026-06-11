import { invoke } from "@tauri-apps/api/core";

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

export async function dispatchEvent(
  eventName: string,
  payload: Record<string, any>,
  handler: string,
): Promise<any> {
  // Read event handler config
  const evtRaw = await invoke<string>("read_file_content", { path: `events/${handler}.json` });
  const evt = JSON.parse(evtRaw);

  const h = (evt.handlers ?? []).find((h: any) => h.on === eventName);
  if (!h) return;

  // State update: read, apply payload mapping, write
  if (h.target === "runtime" && h.action === "state") {
    const stateRaw = await invoke<string>("read_state");
    const state = JSON.parse(stateRaw);

    for (const [payloadKey, stateKey] of Object.entries(h.payload ?? {})) {
      const parts = payloadKey.split(".");
      let val: any = payload;
      for (const p of parts) {
        val = val?.[p];
      }
      if (val !== undefined) {
        state[stateKey as string] = val;
      }
    }

    await invoke("write_state", { content: JSON.stringify(state, null, 2) + "\n" });
  }
}
