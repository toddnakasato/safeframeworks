/**
 * SafeToggle — config-driven on/off switch.
 *
 * Variants: switch (single), table (settings list), expandable (collapsible groups).
 * Owns toggle state. Data-attributes for host CSS. Zero Tailwind.
 * Events: "change" (toggle flipped), "expand" (section opened/closed).
 */
import { useState } from "react";
import type { ConfigBase, OnSafeEvent } from "safecomponents";
import { createSafeEvent } from "safecomponents";

export interface SafeToggleProps {
  config: ConfigBase;
  data?: Record<string, any>[];
  onEvent?: OnSafeEvent;
}

/* ------------------------------------------------------------------ */
/*  Switch track                                                       */
/* ------------------------------------------------------------------ */

function SwitchTrack({
  checked,
  disabled,
  onToggle,
}: {
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      data-role="toggle-track"
      data-checked={checked || undefined}
      data-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onToggle}
      type="button"
    >
      <span data-role="toggle-thumb" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Single switch variant                                              */
/* ------------------------------------------------------------------ */

function SingleSwitch({ config, onEvent }: SafeToggleProps) {
  const { metadata } = config;
  const label = metadata.label as string | undefined;
  const description = metadata.description as string | undefined;
  const icon = metadata.icon as string | undefined;
  const labelPosition = (metadata.labelPosition as string) ?? "right";
  const initialChecked = !!metadata.checked;
  const disabled = !!metadata.disabled;

  const [checked, setChecked] = useState(initialChecked);

  const handleToggle = () => {
    if (disabled) return;
    const next = !checked;
    setChecked(next);
    onEvent?.(createSafeEvent("toggle", "change", { checked: next, label }));
  };

  const labelEl = label ? (
    <div data-role="toggle-label-wrap">
      <span data-role="toggle-label">{label}</span>
      {description && <span data-role="toggle-description">{description}</span>}
    </div>
  ) : null;

  const iconEl = icon ? <span data-role="toggle-icon">{icon}</span> : null;

  return (
    <div
      data-component="toggle"
      data-variant="switch"
      data-label-position={labelPosition}
      data-disabled={disabled || undefined}
    >
      {(labelPosition === "left" || labelPosition === "top") && labelEl}
      {iconEl}
      <SwitchTrack checked={checked} disabled={disabled} onToggle={handleToggle} />
      {(labelPosition === "right" || labelPosition === "bottom") && labelEl}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Table variant                                                      */
/* ------------------------------------------------------------------ */

function TableToggle({ config, data, onEvent }: SafeToggleProps) {
  const items = (config.metadata.items as any[]) ?? data ?? [];

  const [states, setStates] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const item of items) init[item.key] = !!item.checked;
    return init;
  });

  const handleToggle = (key: string, label: string) => {
    const next = !states[key];
    setStates((s) => ({ ...s, [key]: next }));
    onEvent?.(createSafeEvent("toggle", "change", { key, checked: next, label }));
  };

  return (
    <div data-component="toggle" data-variant="table">
      <div data-role="toggle-table-header">
        <span data-role="toggle-table-th">Setting</span>
        <span data-role="toggle-table-th" data-align="right">Enable</span>
      </div>
      {items.map((item: any) => (
        <div key={item.key} data-role="toggle-table-row">
          <div data-role="toggle-table-cell">
            <span data-role="toggle-label">{item.label}</span>
            {item.description && <span data-role="toggle-description">{item.description}</span>}
          </div>
          <div data-role="toggle-table-cell" data-align="right">
            <SwitchTrack
              checked={!!states[item.key]}
              onToggle={() => handleToggle(item.key, item.label)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Expandable variant                                                 */
/* ------------------------------------------------------------------ */

function ExpandableToggle({ config, data, onEvent }: SafeToggleProps) {
  const items = (config.metadata.items as any[]) ?? data ?? [];

  const [states, setStates] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const item of items) {
      init[item.key] = !!item.checked;
      for (const child of item.children ?? []) init[child.key] = !!child.checked;
    }
    return init;
  });

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleToggle = (key: string, label: string) => {
    const next = !states[key];
    setStates((s) => ({ ...s, [key]: next }));
    onEvent?.(createSafeEvent("toggle", "change", { key, checked: next, label }));
  };

  const handleExpand = (key: string) => {
    const next = !expanded[key];
    setExpanded((s) => ({ ...s, [key]: next }));
    onEvent?.(createSafeEvent("toggle", "expand", { key, expanded: next }));
  };

  return (
    <div data-component="toggle" data-variant="expandable">
      {items.map((item: any) => (
        <div key={item.key} data-role="toggle-group">
          <div data-role="toggle-group-header" onClick={() => handleExpand(item.key)}>
            <button data-role="toggle-expand-btn" data-expanded={expanded[item.key] || undefined}>
              ▾
            </button>
            {item.icon && <span data-role="toggle-icon">{item.icon}</span>}
            <div data-role="toggle-label-wrap" style={{ flex: 1 }}>
              <div data-role="toggle-label-row">
                <span data-role="toggle-label">{item.label}</span>
                {item.badge && <span data-role="toggle-badge">{item.badge}</span>}
              </div>
              {item.description && <span data-role="toggle-description">{item.description}</span>}
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <SwitchTrack
                checked={!!states[item.key]}
                onToggle={() => handleToggle(item.key, item.label)}
              />
            </div>
          </div>
          {expanded[item.key] && item.children && (
            <div data-role="toggle-group-children">
              {item.children.map((child: any) => (
                <div key={child.key} data-role="toggle-child-row">
                  <div data-role="toggle-label-wrap">
                    <span data-role="toggle-label">{child.label}</span>
                    {child.description && <span data-role="toggle-description">{child.description}</span>}
                  </div>
                  <SwitchTrack
                    checked={!!states[child.key]}
                    onToggle={() => handleToggle(child.key, child.label)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export function SafeToggle({ config, data, onEvent }: SafeToggleProps) {
  const variant = (config.metadata.variant as string) ?? "switch";
  if (variant === "table") return <TableToggle config={config} data={data} onEvent={onEvent} />;
  if (variant === "expandable") return <ExpandableToggle config={config} data={data} onEvent={onEvent} />;
  return <SingleSwitch config={config} onEvent={onEvent} />;
}
