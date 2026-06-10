<script>
  import { SAMPLES } from "../../../../samples";
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
  let activeComponent = null;
  const componentNames = Object.keys(SAMPLES).sort();

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

    <div class="section-label" style="margin-top:16px">COMPONENTS</div>
      <button class="comp-btn" class:active={activeComponent === null} on:click={() => activeComponent = null}>All</button>
      {#each componentNames as name}
        <button class="comp-btn" class:active={activeComponent === name} on:click={() => activeComponent = name}>{name}</button>
      {/each}
  </div>
  <div class="main">
    <h3>svelte/5 — {activeStyle}{#if activeComponent}<span class="active-comp"> — {activeComponent}</span>{/if}</h3>
    {#if activeComponent === null || activeComponent === "layout"}
    <div class="component-card">
      <div class="component-label">layout</div>
      <div class="component-body">
        <SafeLayout config={SAMPLES["layout"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "columns"}
    <div class="component-card">
      <div class="component-label">columns</div>
      <div class="component-body">
        <SafeColumns config={SAMPLES["columns"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "card"}
    <div class="component-card">
      <div class="component-label">card</div>
      <div class="component-body">
        <SafeCard config={SAMPLES["card"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "button"}
    <div class="component-card">
      <div class="component-label">button</div>
      <div class="component-body">
        <SafeButton config={SAMPLES["button"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "table"}
    <div class="component-card">
      <div class="component-label">table</div>
      <div class="component-body">
        <SafeTable config={SAMPLES["table"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "tree"}
    <div class="component-card">
      <div class="component-label">tree</div>
      <div class="component-body">
        <SafeTree config={SAMPLES["tree"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "sheet"}
    <div class="component-card">
      <div class="component-label">sheet</div>
      <div class="component-body">
        <SafeSheet config={SAMPLES["sheet"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "chart"}
    <div class="component-card">
      <div class="component-label">chart</div>
      <div class="component-body">
        <SafeChart config={SAMPLES["chart"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "heatmap"}
    <div class="component-card">
      <div class="component-label">heatmap</div>
      <div class="component-body">
        <SafeHeatmap config={SAMPLES["heatmap"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "gauge"}
    <div class="component-card">
      <div class="component-label">gauge</div>
      <div class="component-body">
        <SafeGauge config={SAMPLES["gauge"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "funnel"}
    <div class="component-card">
      <div class="component-label">funnel</div>
      <div class="component-body">
        <SafeFunnel config={SAMPLES["funnel"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "sankey"}
    <div class="component-card">
      <div class="component-label">sankey</div>
      <div class="component-body">
        <SafeSankey config={SAMPLES["sankey"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "treemap"}
    <div class="component-card">
      <div class="component-label">treemap</div>
      <div class="component-body">
        <SafeTreemap config={SAMPLES["treemap"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "timeline"}
    <div class="component-card">
      <div class="component-label">timeline</div>
      <div class="component-body">
        <SafeTimeline config={SAMPLES["timeline"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "map"}
    <div class="component-card">
      <div class="component-label">map</div>
      <div class="component-body">
        <SafeMap config={SAMPLES["map"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "calendar"}
    <div class="component-card">
      <div class="component-label">calendar</div>
      <div class="component-body">
        <SafeCalendar config={SAMPLES["calendar"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "toggle"}
    <div class="component-card">
      <div class="component-label">toggle</div>
      <div class="component-body">
        <SafeToggle config={SAMPLES["toggle"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "week"}
    <div class="component-card">
      <div class="component-label">week</div>
      <div class="component-body">
        <SafeWeek config={SAMPLES["week"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "chat"}
    <div class="component-card">
      <div class="component-label">chat</div>
      <div class="component-body">
        <SafeChat config={SAMPLES["chat"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "tabs"}
    <div class="component-card">
      <div class="component-label">tabs</div>
      <div class="component-body">
        <SafeTabs config={SAMPLES["tabs"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "callout"}
    <div class="component-card">
      <div class="component-label">callout</div>
      <div class="component-body">
        <SafeCallout config={SAMPLES["callout"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "drag-drop"}
    <div class="component-card">
      <div class="component-label">drag-drop</div>
      <div class="component-body">
        <SafeDragDrop config={SAMPLES["drag-drop"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "grid"}
    <div class="component-card">
      <div class="component-label">grid</div>
      <div class="component-body">
        <SafeGrid config={SAMPLES["grid"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "input"}
    <div class="component-card">
      <div class="component-label">input</div>
      <div class="component-body">
        <SafeInput config={SAMPLES["input"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "picker"}
    <div class="component-card">
      <div class="component-label">picker</div>
      <div class="component-body">
        <SafePicker config={SAMPLES["picker"]} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "nav"}
    <div class="component-card">
      <div class="component-label">nav</div>
      <div class="component-body">
        <SafeNav config={SAMPLES["nav"]} />
      </div>
    </div>
    {/if}
  </div>
</div>

<style>
  .viewer { display: flex; height: 100vh; font-family: system-ui, sans-serif; }
  .sidebar { width: 220px; border-right: 1px solid #e5e7eb; padding: 12px; overflow-y: auto; flex-shrink: 0; }
  .section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 8px; }
  .style-btn, .comp-btn { display: block; width: 100%; text-align: left; padding: 4px 8px; font-size: 13px; border: none; border-radius: 4px; cursor: pointer; background: transparent; color: #1a1a1a; margin-bottom: 2px; }
  .style-btn.active, .comp-btn.active { background: #3b82f6; color: white; }
  .style-btn:hover, .comp-btn:hover { background: #f3f4f6; }
  .style-btn.active:hover, .comp-btn.active:hover { background: #3b82f6; }
  .main { flex: 1; overflow-y: auto; padding: 24px; }
  h3 { font-size: 14px; font-weight: 600; margin-bottom: 16px; }
  .active-comp { font-weight: 400; color: #6b7280; }
  .component-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
  .component-label { padding: 8px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; background: #fafafa; }
  .component-body { padding: 16px; }
</style>
