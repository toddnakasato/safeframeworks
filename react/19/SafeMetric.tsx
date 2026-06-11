import { useRef, useEffect } from "react";
import { fireMetric } from "../../builders/emit";
import gsap from "gsap";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import type { TrendDirection } from "safecontracts/components/metric";
import { fmtCurrency, fmtInt, fmtPercent, fmtNumber } from "safecontracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeMetricProps {
  config: ConfigBase;
  data: Record<string, any>;
  onEvent?: OnSafeEvent;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function formatByType(value: number, format: string | undefined): string {
  switch (format) {
    case "currency":
      return fmtCurrency(value);
    case "percent":
      return fmtPercent(value);
    case "compact":
      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
      if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
      return fmtInt(value);
    case "number":
    default:
      return fmtInt(value);
  }
}

function trendIcon(dir: TrendDirection): string {
  if (dir === "up") return "↑";
  if (dir === "down") return "↓";
  return "→";
}

function trendColor(dir: TrendDirection): string {
  if (dir === "up") return "var(--sd-success)";
  if (dir === "down") return "var(--sd-danger)";
  return "var(--sd-text-dim)";
}

function resolveTrend(
  data: Record<string, any>,
  config: ConfigBase,
): { dir: TrendDirection; delta: string } | null {
  const { metadata } = config;
  if (!metadata.deltaField) return null;
  const deltaVal = Number(data[metadata.deltaField]);
  if (isNaN(deltaVal)) return null;
  const dir: TrendDirection =
    metadata.trend ?? (deltaVal > 0 ? "up" : deltaVal < 0 ? "down" : "flat");
  return {
    dir,
    delta: formatByType(Math.abs(deltaVal), metadata.format),
  };
}

const SIZE_MAP: Record<string, string> = {
  compact: "var(--sd-font-2xl)",
  featured: "var(--sd-font-4xl)",
  minimal: "var(--sd-font-2xl)",
  default: "var(--sd-font-3xl)",
};

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function SafeMetric({ config, data, onEvent }: SafeMetricProps) {
  const { metadata } = config;
  const numberRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef<number | null>(null);

  const value = Number(data[metadata.valueField]) || 0;
  const trend = resolveTrend(data, config);

  useEffect(() => {
    const el = numberRef.current;
    if (!el) return;

    if (prevValue.current === null) {
      prevValue.current = value;
      el.textContent = formatByType(value, metadata.format);
      return;
    }

    if (prevValue.current === value) return;

    const obj = { v: prevValue.current };
    gsap.to(obj, {
      v: value,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = formatByType(Math.round(obj.v), metadata.format);
      },
      onComplete: () => {
        gsap.fromTo(
          el,
          { textShadow: "0 0 20px color-mix(in srgb, var(--sd-success) 80%, transparent)" },
          { textShadow: "0 0 0px transparent", duration: 1 },
        );
      },
    });

    prevValue.current = value;
  }, [value, metadata.format]);

  const fontSize = SIZE_MAP[metadata.variant as string] ?? SIZE_MAP.default;

  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", gap: "var(--sd-space-sm)",
        ...(metadata.variant === "featured" ? { padding: "var(--sd-space-xl) 0" } : {}),
      }}
      onClick={() => fireMetric(onEvent, "click", { value, field: metadata.valueField })}
    >
      {metadata.title && (
        <span style={{ fontSize: "var(--sd-font-md)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--sd-text-muted)" }}>
          {metadata.title}
        </span>
      )}
      <span
        ref={numberRef}
        style={{ fontWeight: 600, color: "var(--sd-text)", fontSize, fontVariantNumeric: "tabular-nums" }}
      >
        {formatByType(value, metadata.format)}
      </span>
      {trend && (
        <span style={{ fontSize: "var(--sd-font-md)", fontWeight: 500, color: trendColor(trend.dir) }}>
          {trendIcon(trend.dir)} {trend.delta}
        </span>
      )}
    </div>
  );
}
