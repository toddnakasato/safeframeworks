/**
 * SafeRenderer (vue/2) — mechanical translator of the contract's RenderPlan.
 * Same walk as every framework (buildRenderPlan in safecontracts); Vue 2
 * options-API translation.
 */
import Vue, { type PropType } from "vue";
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

const SafeRenderer = Vue.extend({
  name: "SafeRenderer",
  components: {},
  props: {
    config: { type: Object as PropType<ConfigBase>, default: undefined },
    plan: { type: Object as PropType<RenderPlan>, default: undefined },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  computed: {
    resolvedPlan(): RenderPlan {
      return (this.plan as RenderPlan) ?? buildRenderPlan(this.config as ConfigBase, KNOWN);
    },
    stamped(): OnSafeEvent | undefined {
      const handler = this.resolvedPlan.handler;
      const onEvent = this.onEvent as OnSafeEvent | undefined;
      if (!onEvent) return undefined;
      return (event) => onEvent(stampHandler(event, handler));
    },
  },
  render(h): any {
    const plan = this.resolvedPlan;
    if (plan.kind === "unknown") {
      return h("div", { attrs: { "data-component": "unknown" }, style: { padding: "var(--sd-space-md)", color: "var(--sd-text-dim)" } }, `Unknown component: ${plan.component}`);
    }
    const childNodes = (extraAttr: string) =>
      plan.children.map((c) =>
        h("div", { key: c.key, attrs: { [extraAttr]: c.key } }, [
          h("SafeRenderer", { props: { plan: c.plan, onEvent: this.onEvent } }),
        ]),
      );
    const columns = (plan.config.metadata?.columns as string) ?? "1fr";
    if (plan.component === "layout") {
      return h("div", { attrs: { "data-component": "layout", "data-variant": plan.config.metadata?.variant as string }, style: { display: "grid", gridTemplateColumns: columns, minHeight: "100vh" } }, childNodes("data-region"));
    }
    if (plan.component === "columns") {
      return h("div", { attrs: { "data-component": "columns" }, style: { display: "grid", gridTemplateColumns: columns, gap: "var(--sd-space-md)" } }, childNodes("data-child"));
    }
    const leaf = h(LEAVES[plan.component], { props: { config: plan.config, onEvent: this.stamped } });
    if (plan.children.length === 0) return leaf;
    return h("div", [leaf, h("div", { attrs: { "data-role": "children" } }, childNodes("data-child"))]);
  },
});
export default SafeRenderer;
