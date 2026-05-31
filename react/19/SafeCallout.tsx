/**
 * SafeCallout — positioned annotation bubble.
 *
 * Display-only. Renders colored dot + message + pointer arrow.
 * Data-attributes for variant and position. Zero Tailwind.
 * Reusable — not tied to any specific component.
 */
import type { ConfigBase, OnSafeEvent } from "safecomponents";

export interface SafeCalloutProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeCallout({ config }: SafeCalloutProps) {
  const { metadata } = config;
  const variant = (metadata.variant as string) ?? "insight";
  const message = (metadata.message as string) ?? "";
  const position = (metadata.position as string) ?? "right";

  return (
    <div
      data-component="callout"
      data-variant={variant}
      data-position={position}
    >
      <div data-role="callout-dot" />
      <div data-role="callout-message">{message}</div>
      <div data-role="callout-arrow" />
    </div>
  );
}
