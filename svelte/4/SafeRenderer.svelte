<script lang="ts">
  /**
   * SafeRenderer (svelte/4) — mechanical translator of the contract's
   * RenderPlan. Same walk as every framework; svelte 4 legacy syntax.
   */
  import type { ConfigBase, OnSafeEvent, RenderPlan } from "safecontracts";
  import { buildRenderPlan, stampHandler } from "safecontracts";
  import SafeCard from "./SafeCard.svelte";
  import SafeButton from "./SafeButton.svelte";
  import SafeTable from "./SafeTable.svelte";
  import SafeTree from "./SafeTree.svelte";
  import SafeSheet from "./SafeSheet.svelte";
  import SafeChart from "./SafeChart.svelte";
  import SafeHeatmap from "./SafeHeatmap.svelte";
  import SafeGauge from "./SafeGauge.svelte";
  import SafeFunnel from "./SafeFunnel.svelte";
  import SafeFlow from "./SafeFlow.svelte";
  import SafeHierarchy from "./SafeHierarchy.svelte";
  import SafeTimeline from "./SafeTimeline.svelte";
  import SafeMap from "./SafeMap.svelte";
  import SafeCalendar from "./SafeCalendar.svelte";
  import SafeToggle from "./SafeToggle.svelte";
  import SafeWeek from "./SafeWeek.svelte";
  import SafeChat from "./SafeChat.svelte";
  import SafeTabs from "./SafeTabs.svelte";
  import SafeCallout from "./SafeCallout.svelte";
  import SafeDragDrop from "./SafeDragDrop.svelte";
  import SafeGrid from "./SafeGrid.svelte";
  import SafeInput from "./SafeInput.svelte";
  import SafeList from "./SafeList.svelte";
  import SafePicker from "./SafePicker.svelte";
  import SafeNav from "./SafeNav.svelte";

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

  export let config: ConfigBase | undefined = undefined;
  export let plan: RenderPlan | undefined = undefined;
  export let onEvent: OnSafeEvent | undefined = undefined;

  $: p = plan ?? buildRenderPlan(config!, KNOWN);
  $: stamped = onEvent ? ((event: any) => onEvent!(stampHandler(event, p.handler))) : undefined;
  $: columns = (p.config.metadata?.columns as string) ?? "1fr";
</script>

{#if p.kind === "unknown"}
  <div data-component="unknown" style="padding: var(--sd-space-md); color: var(--sd-text-dim)">
    Unknown component: {p.component}
  </div>
{:else if p.component === "layout"}
  <div data-component="layout" data-variant={p.config.metadata?.variant} style="display:grid; grid-template-columns:{columns}; min-height:100vh">
    {#each p.children as c (c.key)}
      <div data-region={c.key}><svelte:self plan={c.plan} {onEvent} /></div>
    {/each}
  </div>
{:else if p.component === "columns"}
  <div data-component="columns" style="display:grid; grid-template-columns:{columns}; gap:var(--sd-space-md)">
    {#each p.children as c (c.key)}
      <div data-child={c.key}><svelte:self plan={c.plan} {onEvent} /></div>
    {/each}
  </div>
{:else}
  <svelte:component this={LEAVES[p.component]} config={p.config} onEvent={stamped} />
  {#if p.childMode !== "component" && p.children.length > 0}
    <div data-role="children">
      {#each p.children as c (c.key)}
        <svelte:self plan={c.plan} {onEvent} />
      {/each}
    </div>
  {/if}
{/if}
