<script setup lang="ts">
/**
 * SafeRenderer (vue/3) — mechanical translator of the contract's RenderPlan.
 * The walk (component resolution, handler stamping, child modes, unknown
 * fail-visibly) is decided by buildRenderPlan in safecontracts. This file
 * maps plan.component → the Vue implementation and recurses. Containers
 * (layout/columns) render natively here so children land inside regions —
 * same approach as react's SafeLayout.
 */
import { computed } from "vue";
import type { ConfigBase, OnSafeEvent, RenderPlan } from "safecontracts";
import { buildRenderPlan, stampHandler } from "safecontracts";
import SafeCard from "./SafeCard.vue";
import SafeButton from "./SafeButton.vue";
import SafeTable from "./SafeTable.vue";
import SafeTree from "./SafeTree.vue";
import SafeSheet from "./SafeSheet.vue";
import SafeChart from "./SafeChart.vue";
import SafeHeatmap from "./SafeHeatmap.vue";
import SafeGauge from "./SafeGauge.vue";
import SafeFunnel from "./SafeFunnel.vue";
import SafeFlow from "./SafeFlow.vue";
import SafeHierarchy from "./SafeHierarchy.vue";
import SafeTimeline from "./SafeTimeline.vue";
import SafeMap from "./SafeMap.vue";
import SafeCalendar from "./SafeCalendar.vue";
import SafeToggle from "./SafeToggle.vue";
import SafeWeek from "./SafeWeek.vue";
import SafeChat from "./SafeChat.vue";
import SafeTabs from "./SafeTabs.vue";
import SafeCallout from "./SafeCallout.vue";
import SafeDragDrop from "./SafeDragDrop.vue";
import SafeGrid from "./SafeGrid.vue";
import SafeInput from "./SafeInput.vue";
import SafeList from "./SafeList.vue";
import SafePicker from "./SafePicker.vue";
import SafeNav from "./SafeNav.vue";

const LEAVES: Record<string, any> = {
  card: SafeCard, button: SafeButton, table: SafeTable, tree: SafeTree,
  sheet: SafeSheet, chart: SafeChart, heatmap: SafeHeatmap, gauge: SafeGauge,
  funnel: SafeFunnel, flow: SafeFlow, hierarchy: SafeHierarchy,
  timeline: SafeTimeline, map: SafeMap, calendar: SafeCalendar,
  toggle: SafeToggle, week: SafeWeek, chat: SafeChat, tabs: SafeTabs,
  callout: SafeCallout, "drag-drop": SafeDragDrop, grid: SafeGrid,
  input: SafeInput, list: SafeList, picker: SafePicker, nav: SafeNav,
};
const KNOWN = new Set([...Object.keys(LEAVES), "layout", "columns"]);

const props = defineProps<{ config?: ConfigBase; plan?: RenderPlan; onEvent?: OnSafeEvent }>();

const plan = computed<RenderPlan>(() => props.plan ?? buildRenderPlan(props.config!, KNOWN));

const stamped = computed<OnSafeEvent | undefined>(() => {
  const handler = plan.value.handler;
  const onEvent = props.onEvent;
  if (!onEvent) return undefined;
  return (event) => onEvent(stampHandler(event, handler));
});

const impl = computed(() => LEAVES[plan.value.component]);

const gridStyle = computed(() => {
  const m = plan.value.config.metadata ?? {};
  const columns = (m.columns as string) ?? "1fr";
  return plan.value.component === "layout"
    ? { display: "grid", gridTemplateColumns: columns, minHeight: "100vh" }
    : { display: "grid", gridTemplateColumns: columns, gap: "var(--sd-space-md)" };
});
</script>

<template>
  <div v-if="plan.kind === 'unknown'" data-component="unknown" style="padding: var(--sd-space-md); color: var(--sd-text-dim)">
    Unknown component: {{ plan.component }}
  </div>

  <div v-else-if="plan.component === 'layout'" data-component="layout" :data-variant="plan.config.metadata?.variant" :style="gridStyle">
    <div v-for="c in plan.children" :key="c.key" :data-region="c.key">
      <SafeRenderer :plan="c.plan" :onEvent="props.onEvent" />
    </div>
  </div>

  <div v-else-if="plan.component === 'columns'" data-component="columns" :style="gridStyle">
    <div v-for="c in plan.children" :key="c.key" :data-child="c.key">
      <SafeRenderer :plan="c.plan" :onEvent="props.onEvent" />
    </div>
  </div>

  <template v-else>
    <component :is="impl" :config="plan.config" :onEvent="stamped" />
    <div v-if="plan.children.length > 0" data-role="children">
      <SafeRenderer v-for="c in plan.children" :key="c.key" :plan="c.plan" :onEvent="props.onEvent" />
    </div>
  </template>
</template>

<script lang="ts">
export default { name: "SafeRenderer" };
</script>
