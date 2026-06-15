import type { ReactNode } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { LAYOUT_VARIANTS } from "safecontracts";

interface SafeLayoutProps {
  config: ConfigBase;
  regions: Record<string, ReactNode>;
  onEvent?: OnSafeEvent;
}

export function SafeLayout({ config, regions, onEvent }: SafeLayoutProps) {
  const metadata = config.metadata ?? {};
  const variant = (metadata.variant as string) ?? "single";
  const columns = metadata.columns as string | undefined;

  const regionNames: string[] = variant === "stack"
    ? Object.keys(regions)
    : [...(LAYOUT_VARIANTS[variant] ?? ["main"])];

  const style: Record<string, string> = {};
  if (variant === "left-main" || variant === "right-main" || variant === "left-center-right") {
    style.display = "grid";
    style.gridTemplateColumns = columns ?? (variant === "left-main" ? "220px 1fr" : "1fr 220px");
    style.height = "100%";
  } else if (variant === "top-main" || variant === "main-bottom") {
    style.display = "grid";
    style.gridTemplateRows = columns ?? "auto 1fr";
    style.height = "100%";
  } else if (variant === "stack") {
    style.display = "flex";
    style.flexDirection = "column";
    style.height = "100%";
  }

  return (
    <div data-component="layout" data-variant={variant} style={style}>
      {regionNames.map((name) => (
        <div key={name} data-region={name} style={{ overflow: "auto" }}>
          {regions[name] ?? null}
        </div>
      ))}
    </div>
  );
}
