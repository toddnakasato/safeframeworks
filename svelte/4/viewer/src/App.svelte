<script>
  import SafeLayout from "../../SafeLayout.svelte";
  import SafeColumns from "../../SafeColumns.svelte";
  import SafeCard from "../../SafeCard.svelte";
  import SafeButton from "../../SafeButton.svelte";
  import SafeTable from "../../SafeTable.svelte";
  import SafeTree from "../../SafeTree.svelte";
  import SafeSheet from "../../SafeSheet.svelte";
  import SafeChart from "../../SafeChart.svelte";
  import SafeHeatmap from "../../SafeHeatmap.svelte";
  import SafeGauge from "../../SafeGauge.svelte";
  import SafeFunnel from "../../SafeFunnel.svelte";
  import SafeSankey from "../../SafeSankey.svelte";
  import SafeTreemap from "../../SafeTreemap.svelte";
  import SafeTimeline from "../../SafeTimeline.svelte";
  import SafeMap from "../../SafeMap.svelte";
  import SafeCalendar from "../../SafeCalendar.svelte";
  import SafeToggle from "../../SafeToggle.svelte";
  import SafeWeek from "../../SafeWeek.svelte";
  import SafeChat from "../../SafeChat.svelte";
  import SafeTabs from "../../SafeTabs.svelte";
  import SafeCallout from "../../SafeCallout.svelte";
  import SafeDragDrop from "../../SafeDragDrop.svelte";
  import SafeGrid from "../../SafeGrid.svelte";
  import SafeInput from "../../SafeInput.svelte";
  import SafePicker from "../../SafePicker.svelte";
  import SafeNav from "../../SafeNav.svelte";

  const STYLES = ["vanilla", "tailwind", "tailwind-daisy", "material"];
  let activeStyle = "vanilla";

  function switchStyle(s) {
    activeStyle = s;
    const link = document.getElementById("safestyle-link");
    if (link) link.setAttribute("href", "/styles/" + s + "/components.css");
  }
</script>

<div class="viewer">
  <div class="sidebar">
    <div class="section-label">STYLE</div>
    {#each STYLES as s}
      <button class="style-btn" class:active={s === activeStyle} on:click={() => switchStyle(s)}>{s}</button>
    {/each}
    <div class="section-label" style="margin-top:12px">svelte/4</div>
  </div>
  <div class="main">
    <h3>svelte/4 — {activeStyle}</h3>
    <div class="component-card">
      <div class="component-label">layout</div>
      <div class="component-body">
        <SafeLayout config={{ component: "layout", metadata: { "variant": "default" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">columns</div>
      <div class="component-body">
        <SafeColumns config={{ component: "columns", metadata: { "spacing": "normal", "radius": "normal", "surface": "normal" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">card</div>
      <div class="component-body">
        <SafeCard config={{ component: "card", metadata: { "variant": "default", "surface": "normal", "spacing": "normal", "radius": "normal", "density": "normal" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">button</div>
      <div class="component-body">
        <SafeButton config={{ component: "button", metadata: { "variant": "default", "size": "normal", "disabled": false, "loading": "normal", "fullWidth": "normal", "iconOnly": "normal", "selected": "normal", "status": "normal", "groupVariant": "normal", "groupDirection": "normal" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">table</div>
      <div class="component-body">
        <SafeTable config={{ component: "table", metadata: { "variant": "default", "spacing": "normal", "headerStyle": "normal", "rowDivider": "normal", "rowNumbers": "normal", "truncate": "normal", "columnLines": "normal", "headerDivider": "normal", "zebra": "normal", "selectable": "normal" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">tree</div>
      <div class="component-body">
        <SafeTree config={{ component: "tree", metadata: { "variant": "default", "spacing": "normal" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">sheet</div>
      <div class="component-body">
        <SafeSheet config={{ component: "sheet", metadata: { "variant": "default", "spacing": "normal", "surface": "normal" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">chart</div>
      <div class="component-body">
        <SafeChart config={{ component: "chart", metadata: { "variant": "default", "chartType": "bar" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">heatmap</div>
      <div class="component-body">
        <SafeHeatmap config={{ component: "heatmap", metadata: { "variant": "default" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">gauge</div>
      <div class="component-body">
        <SafeGauge config={{ component: "gauge", metadata: { "variant": "default" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">funnel</div>
      <div class="component-body">
        <SafeFunnel config={{ component: "funnel", metadata: { "variant": "default" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">sankey</div>
      <div class="component-body">
        <SafeSankey config={{ component: "sankey", metadata: { "variant": "default" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">treemap</div>
      <div class="component-body">
        <SafeTreemap config={{ component: "treemap", metadata: { "variant": "default" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">timeline</div>
      <div class="component-body">
        <SafeTimeline config={{ component: "timeline", metadata: { "variant": "default" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">map</div>
      <div class="component-body">
        <SafeMap config={{ component: "map", metadata: { "variant": "default" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">calendar</div>
      <div class="component-body">
        <SafeCalendar config={{ component: "calendar", metadata: { "variant": "default", "size": "normal" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">toggle</div>
      <div class="component-body">
        <SafeToggle config={{ component: "toggle", metadata: { "variant": "default", "disabled": false, "labelPosition": "normal" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">week</div>
      <div class="component-body">
        <SafeWeek config={{ component: "week", metadata: { "variant": "default" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">chat</div>
      <div class="component-body">
        <SafeChat config={{ component: "chat", metadata: {  } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">tabs</div>
      <div class="component-body">
        <SafeTabs config={{ component: "tabs", metadata: { "variant": "default", "position": "normal" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">callout</div>
      <div class="component-body">
        <SafeCallout config={{ component: "callout", metadata: { "variant": "default", "position": "normal" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">drag-drop</div>
      <div class="component-body">
        <SafeDragDrop config={{ component: "drag-drop", metadata: { "variant": "default" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">grid</div>
      <div class="component-body">
        <SafeGrid config={{ component: "grid", metadata: { "spacing": "normal", "radius": "normal", "surface": "normal", "collapsible": false } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">input</div>
      <div class="component-body">
        <SafeInput config={{ component: "input", metadata: { "inputType": "text", "align": "normal", "valign": "normal" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">picker</div>
      <div class="component-body">
        <SafePicker config={{ component: "picker", metadata: { "variant": "default" } }} />
      </div>
    </div>
    <div class="component-card">
      <div class="component-label">nav</div>
      <div class="component-body">
        <SafeNav config={{ component: "nav", metadata: { "navStyle": "classic" } }} />
      </div>
    </div>
  </div>
</div>

<style>
  .viewer { display: flex; height: 100vh; font-family: system-ui, sans-serif; }
  .sidebar { width: 200px; border-right: 1px solid #e5e7eb; padding: 12px; overflow-y: auto; }
  .section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 8px; }
  .style-btn { display: block; width: 100%; text-align: left; padding: 4px 8px; font-size: 13px; border: none; border-radius: 4px; cursor: pointer; background: transparent; color: #1a1a1a; margin-bottom: 2px; }
  .style-btn.active { background: #3b82f6; color: white; }
  .main { flex: 1; overflow-y: auto; padding: 24px; }
  .main h3 { font-size: 14px; font-weight: 600; margin-bottom: 16px; }
  .component-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
  .component-label { padding: 8px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; background: #fafafa; }
  .component-body { padding: 16px; }
</style>
