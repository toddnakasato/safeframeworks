/**
 * ticket-service.ts — Read/write tickets via Tauri invoke.
 * Tickets live in safeframeworks/tickets/{component}/{id}.json
 */
import type { Ticket, TicketType } from "../../../../../safecontracts/src/contracts-ticket";
import { suggestProves } from "../../../../../safecontracts/src/contracts-ticket";

const TICKETS_DIR = "../../../../tickets";

async function invoke<T>(cmd: string, args?: Record<string, any>): Promise<T> {
    const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
    return tauriInvoke<T>(cmd, args);
}

/** List all component folders that have tickets */
export async function listTicketComponents(): Promise<string[]> {
    return invoke<string[]>("list_dir", { path: TICKETS_DIR });
}

/** List all ticket files for a component */
export async function listTickets(component: string): Promise<Ticket[]> {
    const files = await invoke<string[]>("list_dir", { path: `${TICKETS_DIR}/${component}` });
    const tickets: Ticket[] = [];
    for (const f of files) {
        if (!f.endsWith(".json")) continue;
        try {
            const raw = await invoke<string>("read_file_content", { path: `${TICKETS_DIR}/${component}/${f}` });
            tickets.push(JSON.parse(raw));
        } catch {}
    }
    return tickets.sort((a, b) => b.created.localeCompare(a.created));
}

/** Load all tickets across all components */
export async function listAllTickets(): Promise<Ticket[]> {
    const components = await listTicketComponents();
    const all: Ticket[] = [];
    for (const comp of components) {
        const tickets = await listTickets(comp);
        all.push(...tickets);
    }
    return all.sort((a, b) => b.created.localeCompare(a.created));
}

/** Get next ticket ID for a component */
async function nextId(component: string): Promise<string> {
    const tickets = await listTickets(component);
    const nums = tickets.map(t => parseInt(t.id.split("-").pop() ?? "0", 10)).filter(n => !isNaN(n));
    const next = (Math.max(0, ...nums) + 1).toString().padStart(4, "0");
    return `${component}-${next}`;
}

/** Create a new ticket */
export async function createTicket(component: string, type: TicketType, title: string, description: string, event?: string, variant?: string): Promise<Ticket> {
    const id = await nextId(component);
    const now = new Date().toISOString();
    const ticket: Ticket = {
        id,
        component,
        type,
        title,
        description,
        status: "open",
        proves: suggestProves(type),
        params: { component, ...(event ? { event } : {}) },
        created: now,
        updated: now,
    };
    if (event) ticket.event = event;
    if (variant) ticket.variant = variant;

    await invoke("ensure_dir", { path: `${TICKETS_DIR}/${component}` });
    await invoke("write_state", { path: `${TICKETS_DIR}/${component}/${id}.json`, content: JSON.stringify(ticket, null, 2) });
    return ticket;
}

/** Update a ticket */
export async function updateTicket(ticket: Ticket): Promise<void> {
    ticket.updated = new Date().toISOString();
    await invoke("write_state", { path: `${TICKETS_DIR}/${ticket.component}/${ticket.id}.json`, content: JSON.stringify(ticket, null, 2) });
}
