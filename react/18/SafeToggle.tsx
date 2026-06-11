import { useState } from "react";
import { fireToggle } from "safecontracts";
import type { ConfigBase, OnSafeEvent } from "safecontracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeToggleProps {
  config: ConfigBase;
  data?: Record<string, any>[];
  onEvent?: OnSafeEvent;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

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

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

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
    fireToggle(onEvent, "change", { checked: next, label });
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
    fireToggle(onEvent, "change", { key, checked: next, label });
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
    fireToggle(onEvent, "change", { key, checked: next, label });
  };

  const handleExpand = (key: string) => {
    const next = !expanded[key];
    setExpanded((s) => ({ ...s, [key]: next }));
    fireToggle(onEvent, "expand", { key, expanded: next });
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

export function SafeToggle({ config, data, onEvent }: SafeToggleProps) {
  const variant = (config.metadata.variant as string) ?? "switch";
  if (variant === "table") return <TableToggle config={config} data={data} onEvent={onEvent} />;
  if (variant === "expandable") return <ExpandableToggle config={config} data={data} onEvent={onEvent} />;
  return <SingleSwitch config={config} onEvent={onEvent} />;
}
