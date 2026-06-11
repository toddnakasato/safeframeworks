import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
import { fireChat } from "./emit";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

interface Message {
    role: "assistant" | "user";
    content: string;
    timestamp: string;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function now(): string {
    return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function el(tag: string, role?: string, text?: string): HTMLElement {
    const e = document.createElement(tag);
    if (role) e.setAttribute("data-role", role);
    if (text != null) e.textContent = text;
    return e;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeChat(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const metadata = config.metadata;
    const title = (metadata.title as string) ?? "Chat";
    const placeholder = (metadata.placeholder as string) ?? "Type a message...";
    const quickActions = (metadata.quickActions as any[]) ?? [];
    const initial = (metadata.messages as any[]) ?? [];

    const messages: Message[] = initial.map((m: any) => ({
        role: m.role ?? "assistant",
        content: m.content ?? "",
        timestamp: m.timestamp ?? now(),
    }));

    const root = el("div");
    root.setAttribute("data-component", "chat");

    const header = el("div", "chat-header");
    header.appendChild(el("span", "chat-title", title));
    root.appendChild(header);

    const messagesEl = el("div", "chat-messages");
    root.appendChild(messagesEl);

    function renderMessages() {
        messagesEl.replaceChildren();
        for (const msg of messages) {
            const m = el("div", "chat-message");
            m.setAttribute("data-sender", msg.role);
            const bubble = el("div", "chat-bubble");
            bubble.appendChild(el("div", "chat-content", msg.content));
            bubble.appendChild(el("div", "chat-timestamp", msg.timestamp));
            m.appendChild(bubble);
            messagesEl.appendChild(m);
        }
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    const inputArea = el("div", "chat-input-area");
    const input = document.createElement("input");
    input.setAttribute("data-role", "chat-input");
    input.type = "text";
    input.placeholder = placeholder;

    const sendBtn = el("button", "chat-send", "➤") as HTMLButtonElement;
    sendBtn.disabled = true;

    const handleSend = () => {
        const text = input.value.trim();
        if (!text) return;
        messages.push({ role: "user", content: text, timestamp: now() });
        input.value = "";
        sendBtn.disabled = true;
        renderMessages();
        fireChat(onEvent, "send", { message: text });
    };

    input.addEventListener("input", () => {
        sendBtn.disabled = !input.value.trim();
    });
    input.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
    sendBtn.onclick = handleSend;

    inputArea.append(input, sendBtn);
    root.appendChild(inputArea);

    if (quickActions.length > 0) {
        const actions = el("div", "chat-actions");
        for (const action of quickActions) {
            const btn = el("button", "chat-action");
            btn.onclick = () => fireChat(onEvent, "action", { label: action.label });
            if (action.icon) btn.appendChild(el("span", "chat-action-icon", action.icon));
            const text = el("div", "chat-action-text");
            text.appendChild(el("span", "chat-action-label", action.label));
            if (action.description) text.appendChild(el("span", "chat-action-desc", action.description));
            btn.appendChild(text);
            btn.appendChild(el("span", "chat-action-arrow", "›"));
            actions.appendChild(btn);
        }
        root.appendChild(actions);
    }

    renderMessages();
    container.appendChild(root);
    return root;
}

export function initSafeChats(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-chat-config]").forEach((host) => {
        if (host.dataset.chatMounted) return;
        host.dataset.chatMounted = "1";
        const config = JSON.parse(host.dataset.chatConfig!) as ConfigBase;
        createSafeChat(host, config);
    });
}
