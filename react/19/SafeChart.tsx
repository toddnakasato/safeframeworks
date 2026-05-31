/**
 * SafeChart — config-driven chart component.
 *
 * Reads ConfigBase for chart type, fields, colors.
 * Renders via Recharts. Data-attributes for host CSS. Zero Tailwind.
 */
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, ScatterChart, Scatter,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";
import type { ConfigBase, OnSafeEvent } from "safecomponents";
import { createSafeEvent } from "safecomponents";

import { resolveColors } from "safecomponents";

export interface SafeChartProps {
  config: ConfigBase;
  data: Record<string, any>[];
  onEvent?: OnSafeEvent;
}

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "var(--sd-surface-raised)",
    border: "1px solid var(--sd-border)",
    borderRadius: "var(--sd-radius-lg)",
    fontSize: "var(--sd-font-md)",
  },
  labelStyle: { color: "var(--sd-text)" },
  itemStyle: { color: "var(--sd-text)" },
};

function getYFields(yField: string | string[] | undefined): string[] {
  if (!yField) return [];
  return Array.isArray(yField) ? yField : [yField];
}

function RenderArea({ data, config, colors, yFields }: { data: any[]; config: ConfigBase; colors: string[]; yFields: string[] }) {
  const { metadata } = config;
  return (
    <AreaChart data={data} margin={{ top: 18, right: 18, left: 0, bottom: 8 }}>
      <defs>
        {yFields.map((f, i) => (
          <linearGradient key={f} id={`grad-${f}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity={0.9} />
            <stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity={0.0} />
          </linearGradient>
        ))}
      </defs>
      {metadata.grid !== false && <CartesianGrid strokeDasharray="3 3" stroke="var(--sd-border)" />}
      <XAxis dataKey={metadata.xField} stroke="var(--sd-text-dim)" fontSize={10} tickLine={false} />
      <YAxis stroke="var(--sd-text-dim)" fontSize={10} tickLine={false} />
      <Tooltip {...TOOLTIP_STYLE} />
      {metadata.legend && <Legend />}
      {yFields.map((f, i) => (
        <Area key={f} type="monotone" dataKey={f} stroke={colors[i % colors.length]} strokeWidth={2} fill={`url(#grad-${f})`} isAnimationActive animationDuration={900 + i * 200} />
      ))}
    </AreaChart>
  );
}

function RenderBar({ data, config, colors, yFields }: { data: any[]; config: ConfigBase; colors: string[]; yFields: string[] }) {
  const { metadata } = config;
  return (
    <BarChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
      {metadata.grid !== false && <CartesianGrid strokeDasharray="3 3" stroke="var(--sd-border)" />}
      <XAxis dataKey={metadata.xField} stroke="var(--sd-text-dim)" fontSize={10} tickLine={false} axisLine={false} />
      <YAxis stroke="var(--sd-text-dim)" fontSize={10} tickLine={false} />
      <Tooltip {...TOOLTIP_STYLE} />
      {metadata.legend && <Legend />}
      {yFields.map((f, i) => (
        <Bar key={f} dataKey={f} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} isAnimationActive animationDuration={900} />
      ))}
    </BarChart>
  );
}

function RenderLine({ data, config, colors, yFields }: { data: any[]; config: ConfigBase; colors: string[]; yFields: string[] }) {
  const { metadata } = config;
  return (
    <LineChart data={data} margin={{ top: 18, right: 18, left: 0, bottom: 8 }}>
      {metadata.grid !== false && <CartesianGrid strokeDasharray="3 3" stroke="var(--sd-border)" />}
      <XAxis dataKey={metadata.xField} stroke="var(--sd-text-dim)" fontSize={10} tickLine={false} />
      <YAxis stroke="var(--sd-text-dim)" fontSize={10} tickLine={false} />
      <Tooltip {...TOOLTIP_STYLE} />
      {metadata.legend && <Legend />}
      {yFields.map((f, i) => (
        <Line key={f} type="monotone" dataKey={f} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} isAnimationActive animationDuration={900 + i * 200} />
      ))}
    </LineChart>
  );
}

function RenderPie({ data, config, colors }: { data: any[]; config: ConfigBase; colors: string[] }) {
  const { metadata } = config;
  const yFields = getYFields(metadata.yField);
  const dataKey = yFields[0] ?? "value";
  return (
    <PieChart>
      <Pie data={data} dataKey={dataKey} nameKey={metadata.xField ?? "name"} innerRadius="50%" outerRadius="85%" paddingAngle={3} isAnimationActive animationDuration={900}>
        {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} stroke="none" />)}
      </Pie>
      <Tooltip {...TOOLTIP_STYLE} />
      {metadata.legend && <Legend />}
    </PieChart>
  );
}

function RenderScatter({ data, config, colors }: { data: any[]; config: ConfigBase; colors: string[] }) {
  const { metadata } = config;
  const yFields = getYFields(metadata.yField);
  return (
    <ScatterChart margin={{ top: 18, right: 18, left: 0, bottom: 8 }}>
      {metadata.grid !== false && <CartesianGrid strokeDasharray="3 3" stroke="var(--sd-border)" />}
      <XAxis dataKey={metadata.xField} stroke="var(--sd-text-dim)" fontSize={10} tickLine={false} />
      <YAxis dataKey={yFields[0]} stroke="var(--sd-text-dim)" fontSize={10} tickLine={false} />
      <Tooltip {...TOOLTIP_STYLE} />
      {metadata.legend && <Legend />}
      <Scatter data={data} fill={colors[0]} isAnimationActive animationDuration={900} />
    </ScatterChart>
  );
}

function RenderRadar({ data, config, colors, yFields }: { data: any[]; config: ConfigBase; colors: string[]; yFields: string[] }) {
  const { metadata } = config;
  return (
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
      <PolarGrid stroke="var(--sd-border)" />
      <PolarAngleAxis dataKey={metadata.xField} stroke="var(--sd-text-dim)" fontSize={10} />
      <PolarRadiusAxis stroke="var(--sd-text-dim)" fontSize={9} />
      <Tooltip {...TOOLTIP_STYLE} />
      {metadata.legend && <Legend />}
      {yFields.map((f, i) => (
        <Radar key={f} dataKey={f} stroke={colors[i % colors.length]} fill={colors[i % colors.length]} fillOpacity={0.25} isAnimationActive animationDuration={900 + i * 200} />
      ))}
    </RadarChart>
  );
}

function RenderComposed({ data, config, colors, yFields }: { data: any[]; config: ConfigBase; colors: string[]; yFields: string[] }) {
  const { metadata } = config;
  const composedTypes = (metadata.composedTypes as string[]) ?? yFields.map((_, i) => i === 0 ? "bar" : "line");
  return (
    <ComposedChart data={data} margin={{ top: 18, right: 18, left: 0, bottom: 8 }}>
      {metadata.grid !== false && <CartesianGrid strokeDasharray="3 3" stroke="var(--sd-border)" />}
      <XAxis dataKey={metadata.xField} stroke="var(--sd-text-dim)" fontSize={10} tickLine={false} />
      <YAxis stroke="var(--sd-text-dim)" fontSize={10} tickLine={false} />
      <Tooltip {...TOOLTIP_STYLE} />
      {metadata.legend && <Legend />}
      {yFields.map((f, i) => {
        const type = composedTypes[i] ?? "line";
        if (type === "bar") return <Bar key={f} dataKey={f} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} isAnimationActive animationDuration={900} />;
        if (type === "area") return <Area key={f} type="monotone" dataKey={f} stroke={colors[i % colors.length]} fill={colors[i % colors.length]} fillOpacity={0.15} isAnimationActive animationDuration={900} />;
        return <Line key={f} type="monotone" dataKey={f} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} isAnimationActive animationDuration={900} />;
      })}
    </ComposedChart>
  );
}

export function SafeChart({ config, data, onEvent }: SafeChartProps) {
  const { metadata } = config;
  const colors = resolveColors(metadata);
  const yFields = getYFields(metadata.yField);
  const variant = (metadata.variant as string) ?? "default";

  const height = variant === "dense" ? 192 : variant === "minimal" ? 224 : 288;

  return (
    <div data-component="chart" data-variant={variant} data-chart-type={metadata.chartType} style={{ width: "100%", height }}>
      {metadata.title && (
        <div data-role="title">{metadata.title as string}</div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        {metadata.chartType === "area" ? <RenderArea data={data} config={config} colors={colors} yFields={yFields} />
        : metadata.chartType === "bar" ? <RenderBar data={data} config={config} colors={colors} yFields={yFields} />
        : metadata.chartType === "line" ? <RenderLine data={data} config={config} colors={colors} yFields={yFields} />
        : metadata.chartType === "pie" ? <RenderPie data={data} config={config} colors={colors} />
        : metadata.chartType === "scatter" ? <RenderScatter data={data} config={config} colors={colors} />
        : metadata.chartType === "radar" ? <RenderRadar data={data} config={config} colors={colors} yFields={yFields} />
        : metadata.chartType === "composed" ? <RenderComposed data={data} config={config} colors={colors} yFields={yFields} />
        : <RenderArea data={data} config={config} colors={colors} yFields={yFields} />}
      </ResponsiveContainer>
    </div>
  );
}