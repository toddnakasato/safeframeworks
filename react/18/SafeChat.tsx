import { useState, useRef, useEffect } from "react";
import { fireChat } from "safecontracts";
import type { ConfigBase, OnSafeEvent } from "safecontracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeChatProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

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

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function SafeChat({ config, onEvent }: SafeChatProps) {
  const { metadata } = config;
  const title = (metadata.title as string) ?? "Chat";
  const placeholder = (metadata.placeholder as string) ?? "Type a message...";
  const quickActions = (metadata.quickActions as any[]) ?? [];
  const initial = (metadata.messages as any[]) ?? [];

  const [messages, setMessages] = useState<Message[]>(() =>
    initial.map((m: any) => ({
      role: m.role ?? "assistant",
      content: m.content ?? "",
      timestamp: m.timestamp ?? now(),
    })),
  );
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", content: text, timestamp: now() }]);
    setInput("");
    fireChat(onEvent, "send", { message: text });
  };

  const handleAction = (action: any) => {
    fireChat(onEvent, "action", { label: action.label });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div data-component="chat">
      <div data-role="chat-header">
        <span data-role="chat-title">{title}</span>
      </div>

      <div data-role="chat-messages" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} data-role="chat-message" data-sender={msg.role}>
            <div data-role="chat-bubble">
              <div data-role="chat-content">{msg.content}</div>
              <div data-role="chat-timestamp">{msg.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      <div data-role="chat-input-area">
        <input
          data-role="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <button data-role="chat-send" disabled={!input.trim()} onClick={handleSend}>
          ➤
        </button>
      </div>

      {quickActions.length > 0 && (
        <div data-role="chat-actions">
          {quickActions.map((action: any, i: number) => (
            <button key={i} data-role="chat-action" onClick={() => handleAction(action)}>
              {action.icon && <span data-role="chat-action-icon">{action.icon}</span>}
              <div data-role="chat-action-text">
                <span data-role="chat-action-label">{action.label}</span>
                {action.description && (
                  <span data-role="chat-action-desc">{action.description}</span>
                )}
              </div>
              <span data-role="chat-action-arrow">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
