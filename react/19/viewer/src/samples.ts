/**
 * Sample ConfigBase data for all 26 components.
 * Used by the viewer to render each component with realistic data.
 */
import type { ConfigBase } from "safecontracts";

export const SAMPLES: Record<string, ConfigBase> = {
  button: {
    component: "button",
    metadata: { variant: "primary", label: "Click Me", size: "md" },
  },
  card: {
    component: "card",
    metadata: { variant: "outline", surface: "raised", spacing: "normal", radius: "md", density: "comfortable" },
    data: [{ name: "info", type: "record", source: "inline", schema: { fields: [{ name: "title", label: "Title", type: "text" }] }, inline: { title: "Sample Card" } }],
  },
  table: {
    component: "table",
    metadata: { variant: "default", spacing: "normal", headerStyle: "uppercase", rowDivider: "thin", zebra: "even" },
    data: [{ name: "rows", type: "list", source: "inline", schema: { fields: [{ name: "name", label: "Name", type: "text" }, { name: "value", label: "Value", type: "text" }] }, inline: [{ name: "Alpha", value: "100" }, { name: "Beta", value: "200" }, { name: "Gamma", value: "300" }] }],
  },
  nav: {
    component: "nav",
    metadata: { navStyle: "classic", title: "Viewer", search: true },
    children: {
      home: { component: "nav", metadata: { label: "Home", icon: "home" } },
      settings: { component: "nav", metadata: { label: "Settings", icon: "settings", section: "bottom" } },
    },
  },
  layout: {
    component: "layout",
    metadata: { variant: "stack" },
  },
  columns: {
    component: "columns",
    metadata: { spacing: "normal", radius: "md", surface: "base" },
  },
  tree: {
    component: "tree",
    metadata: { variant: "default", spacing: "normal" },
    data: [{ name: "nodes", type: "list", source: "inline", schema: { fields: [{ name: "id", label: "ID", type: "text" }, { name: "label", label: "Label", type: "text" }] }, inline: [{ id: "1", label: "Root", parentId: null }, { id: "2", label: "Child A", parentId: "1" }, { id: "3", label: "Child B", parentId: "1" }] }],
  },
  sheet: {
    component: "sheet",
    metadata: { variant: "default", spacing: "normal", surface: "base" },
  },
  chart: {
    component: "chart",
    metadata: { variant: "default", chartType: "bar" },
    data: [{ name: "series", type: "list", source: "inline", schema: { fields: [{ name: "label", label: "Label", type: "text" }, { name: "value", label: "Value", type: "number" }] }, inline: [{ label: "A", value: 40 }, { label: "B", value: 70 }, { label: "C", value: 30 }] }],
  },
  heatmap: {
    component: "heatmap",
    metadata: { variant: "default" },
  },
  gauge: {
    component: "gauge",
    metadata: { variant: "default" },
  },
  funnel: {
    component: "funnel",
    metadata: { variant: "default" },
  },
  sankey: {
    component: "sankey",
    metadata: { variant: "default" },
  },
  treemap: {
    component: "treemap",
    metadata: { variant: "default" },
  },
  timeline: {
    component: "timeline",
    metadata: { variant: "default" },
    data: [{ name: "events", type: "list", source: "inline", schema: { fields: [{ name: "date", label: "Date", type: "date" }, { name: "label", label: "Label", type: "text" }] }, inline: [{ date: "2025-01-01", label: "Start" }, { date: "2025-06-01", label: "Milestone" }] }],
  },
  map: {
    component: "map",
    metadata: { variant: "default" },
  },
  calendar: {
    component: "calendar",
    metadata: { variant: "default", size: "md" },
  },
  toggle: {
    component: "toggle",
    metadata: { variant: "switch", disabled: false, labelPosition: "right", label: "Enable feature" },
  },
  week: {
    component: "week",
    metadata: { variant: "default" },
  },
  chat: {
    component: "chat",
    metadata: { title: "Chat" },
  },
  tabs: {
    component: "tabs",
    metadata: { variant: "default", position: "top", tabs: [{ key: "one", label: "Tab One", child: "" }, { key: "two", label: "Tab Two", child: "" }] },
  },
  callout: {
    component: "callout",
    metadata: { variant: "info", position: "top", message: "This is a callout." },
  },
  "drag-drop": {
    component: "drag-drop",
    metadata: { variant: "default" },
    data: [{ name: "items", type: "list", source: "inline", schema: { fields: [{ name: "id", label: "ID", type: "text" }, { name: "label", label: "Label", type: "text" }] }, inline: [{ id: "1", label: "Item A" }, { id: "2", label: "Item B" }] }],
  },
  grid: {
    component: "grid",
    metadata: { spacing: "normal", radius: "md", surface: "base", collapsible: false },
  },
  input: {
    component: "input",
    metadata: { inputType: "text", align: "left", valign: "center", placeholder: "Type here..." },
  },
  picker: {
    component: "picker",
    metadata: { variant: "default" },
  },
};
