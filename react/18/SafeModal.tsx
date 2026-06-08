/**
 * SafeModal — config-driven dialog.
 */
import type { ReactNode } from "react";
import type { ConfigBase } from "safecontracts";

export interface SafeModalProps {
  config: ConfigBase;
  children?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function SafeModal({ config, children, onConfirm, onCancel }: SafeModalProps) {
  const { metadata } = config;

  const borderColor =
    metadata.variant === "danger"
      ? "color-mix(in srgb, var(--sd-danger) 30%, transparent)"
      : metadata.variant === "info"
        ? "color-mix(in srgb, var(--sd-accent) 30%, transparent)"
        : "var(--sd-border)";

  const confirmBg =
    metadata.variant === "danger"
      ? "var(--sd-danger)"
      : "var(--sd-accent)";

  const sizeMap: Record<string, number> = { sm: 360, md: 448, lg: 640, xl: 840, full: 9999 };
  const maxW = sizeMap[(metadata.size as string) ?? "md"] ?? 448;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--sd-surface-overlay)",
      }}
      onClick={metadata.dismissOnOverlay !== false ? onCancel : undefined}
    >
      <div
        style={{
          background: "var(--sd-surface-raised)",
          borderRadius: "var(--sd-radius-lg)",
          border: `1px solid ${borderColor}`,
          boxShadow: "0 20px 25px -5px color-mix(in srgb, var(--sd-surface) 30%, transparent)",
          maxWidth: maxW,
          width: "100%",
          margin: `0 var(--sd-space-xl)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "var(--sd-space-xl) var(--sd-space-2xl)", borderBottom: "1px solid var(--sd-border)" }}>
          <h3 style={{ fontSize: "var(--sd-font-xl)", fontWeight: 600, color: "var(--sd-text)", margin: 0 }}>{metadata.heading}</h3>
        </div>

        <div style={{ padding: "var(--sd-space-xl) var(--sd-space-2xl)", fontSize: "var(--sd-font-lg)", color: "var(--sd-text)" }}>
          {children ?? metadata.body ?? ""}
        </div>

        <div style={{ padding: "var(--sd-space-lg) var(--sd-space-2xl)", borderTop: "1px solid var(--sd-border)", display: "flex", justifyContent: "flex-end", gap: "var(--sd-space-md)" }}>
          {metadata.cancelLabel !== "" && (
            <button
              style={{
                padding: "var(--sd-space-sm) var(--sd-space-lg)", fontSize: "var(--sd-font-lg)", color: "var(--sd-text)",
                background: "transparent", border: "none", borderRadius: "var(--sd-radius-md)", cursor: "pointer",
              }}
              onClick={onCancel}
            >
              {metadata.cancelLabel ?? "Cancel"}
            </button>
          )}
          {metadata.confirmLabel !== "" && (
            <button
            style={{
              padding: "var(--sd-space-sm) var(--sd-space-lg)", fontSize: "var(--sd-font-lg)", color: "var(--sd-surface)",
              background: confirmBg, border: "none", borderRadius: "var(--sd-radius-md)", cursor: "pointer",
            }}
            onClick={onConfirm}
          >
            {metadata.confirmLabel ?? "Confirm"}
          </button>
          )}
        </div>
      </div>
    </div>
  );
}
