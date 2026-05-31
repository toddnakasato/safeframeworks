const API = `/api/${getAccount()}`;

function getAccount(): string {
  // Account from URL: /app/{account}/...
  const match = window.location.pathname.match(/^\/app\/([^/]+)/);
  return match ? match[1] : "demo";
}

export async function getConfig(): Promise<any> {
  const res = await fetch(`${API}/config`);
  if (!res.ok) throw new Error(`config: ${res.status}`);
  return res.json();
}

export async function getState(): Promise<any> {
  const res = await fetch(`${API}/state`);
  if (!res.ok) throw new Error(`state: ${res.status}`);
  return res.json();
}

export async function getLayout(name: string): Promise<any> {
  const res = await fetch(`${API}/layout/${name}`);
  if (!res.ok) throw new Error(`layout ${name}: ${res.status}`);
  return res.json();
}

export async function getScene(name: string): Promise<any> {
  const res = await fetch(`${API}/scene/${name}`);
  if (!res.ok) throw new Error(`scene ${name}: ${res.status}`);
  return res.json();
}

export async function getComponent(name: string): Promise<any> {
  const res = await fetch(`${API}/component/${name}`);
  if (!res.ok) throw new Error(`component ${name}: ${res.status}`);
  return res.json();
}

export async function dispatchEvent(
  eventName: string,
  payload: Record<string, any>,
  handler: string,
): Promise<any> {
  const res = await fetch(`${API}/dispatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: eventName, payload, handler }),
  });
  if (!res.ok) throw new Error(`dispatch: ${res.status}`);
  return res.json();
}
