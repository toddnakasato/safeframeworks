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
  let activeComponent = null;

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
      <button class="comp-btn" class:active={activeComponent === "layout"} on:click={() => activeComponent = "layout"}>layout</button>
      <button class="comp-btn" class:active={activeComponent === "columns"} on:click={() => activeComponent = "columns"}>columns</button>
      <button class="comp-btn" class:active={activeComponent === "card"} on:click={() => activeComponent = "card"}>card</button>
      <button class="comp-btn" class:active={activeComponent === "button"} on:click={() => activeComponent = "button"}>button</button>
      <button class="comp-btn" class:active={activeComponent === "table"} on:click={() => activeComponent = "table"}>table</button>
      <button class="comp-btn" class:active={activeComponent === "tree"} on:click={() => activeComponent = "tree"}>tree</button>
      <button class="comp-btn" class:active={activeComponent === "sheet"} on:click={() => activeComponent = "sheet"}>sheet</button>
      <button class="comp-btn" class:active={activeComponent === "chart"} on:click={() => activeComponent = "chart"}>chart</button>
      <button class="comp-btn" class:active={activeComponent === "heatmap"} on:click={() => activeComponent = "heatmap"}>heatmap</button>
      <button class="comp-btn" class:active={activeComponent === "gauge"} on:click={() => activeComponent = "gauge"}>gauge</button>
      <button class="comp-btn" class:active={activeComponent === "funnel"} on:click={() => activeComponent = "funnel"}>funnel</button>
      <button class="comp-btn" class:active={activeComponent === "sankey"} on:click={() => activeComponent = "sankey"}>sankey</button>
      <button class="comp-btn" class:active={activeComponent === "treemap"} on:click={() => activeComponent = "treemap"}>treemap</button>
      <button class="comp-btn" class:active={activeComponent === "timeline"} on:click={() => activeComponent = "timeline"}>timeline</button>
      <button class="comp-btn" class:active={activeComponent === "map"} on:click={() => activeComponent = "map"}>map</button>
      <button class="comp-btn" class:active={activeComponent === "calendar"} on:click={() => activeComponent = "calendar"}>calendar</button>
      <button class="comp-btn" class:active={activeComponent === "toggle"} on:click={() => activeComponent = "toggle"}>toggle</button>
      <button class="comp-btn" class:active={activeComponent === "week"} on:click={() => activeComponent = "week"}>week</button>
      <button class="comp-btn" class:active={activeComponent === "chat"} on:click={() => activeComponent = "chat"}>chat</button>
      <button class="comp-btn" class:active={activeComponent === "tabs"} on:click={() => activeComponent = "tabs"}>tabs</button>
      <button class="comp-btn" class:active={activeComponent === "callout"} on:click={() => activeComponent = "callout"}>callout</button>
      <button class="comp-btn" class:active={activeComponent === "drag-drop"} on:click={() => activeComponent = "drag-drop"}>drag-drop</button>
      <button class="comp-btn" class:active={activeComponent === "grid"} on:click={() => activeComponent = "grid"}>grid</button>
      <button class="comp-btn" class:active={activeComponent === "input"} on:click={() => activeComponent = "input"}>input</button>
      <button class="comp-btn" class:active={activeComponent === "picker"} on:click={() => activeComponent = "picker"}>picker</button>
      <button class="comp-btn" class:active={activeComponent === "nav"} on:click={() => activeComponent = "nav"}>nav</button>
  </div>
  <div class="main">
    <h3>svelte/5 — {activeStyle}{#if activeComponent}<span class="active-comp"> — {activeComponent}</span>{/if}</h3>
    {#if activeComponent === null || activeComponent === "layout"}
    <div class="component-card">
      <div class="component-label">layout</div>
      <div class="component-body">
        <SafeLayout config={{ component: "layout", metadata: {"variant": "default"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "columns"}
    <div class="component-card">
      <div class="component-label">columns</div>
      <div class="component-body">
        <SafeColumns config={{ component: "columns", metadata: {"spacing": "normal", "radius": "normal", "surface": "normal"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "card"}
    <div class="component-card">
      <div class="component-label">card</div>
      <div class="component-body">
        <SafeCard config={{ component: "card", metadata: {"variant": "default", "surface": "normal", "spacing": "normal", "radius": "normal", "density": "normal", "title": "Sample Card", "subtitle": "Subtitle"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "button"}
    <div class="component-card">
      <div class="component-label">button</div>
      <div class="component-body">
        <SafeButton config={{ component: "button", metadata: {"variant": "primary", "size": "md", "disabled": false, "loading": "normal", "fullWidth": "normal", "iconOnly": "normal", "selected": "normal", "status": "normal", "groupVariant": "normal", "groupDirection": "normal", "label": "Click Me"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "table"}
    <div class="component-card">
      <div class="component-label">table</div>
      <div class="component-body">
        <SafeTable config={{ component: "table", metadata: {"variant": "default", "spacing": "normal", "headerStyle": "normal", "rowDivider": "normal", "rowNumbers": "normal", "truncate": "normal", "columnLines": "normal", "headerDivider": "normal", "zebra": "normal", "selectable": "normal"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "tree"}
    <div class="component-card">
      <div class="component-label">tree</div>
      <div class="component-body">
        <SafeTree config={{ component: "tree", metadata: {"variant": "default", "spacing": "normal"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "sheet"}
    <div class="component-card">
      <div class="component-label">sheet</div>
      <div class="component-body">
        <SafeSheet config={{ component: "sheet", metadata: {"variant": "default", "spacing": "normal", "surface": "normal"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "chart"}
    <div class="component-card">
      <div class="component-label">chart</div>
      <div class="component-body">
        <SafeChart config={{ component: "chart", metadata: {"variant": "default", "chartType": "bar", "title": "Revenue"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "heatmap"}
    <div class="component-card">
      <div class="component-label">heatmap</div>
      <div class="component-body">
        <SafeHeatmap config={{ component: "heatmap", metadata: {"variant": "default"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "gauge"}
    <div class="component-card">
      <div class="component-label">gauge</div>
      <div class="component-body">
        <SafeGauge config={{ component: "gauge", metadata: {"variant": "default"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "funnel"}
    <div class="component-card">
      <div class="component-label">funnel</div>
      <div class="component-body">
        <SafeFunnel config={{ component: "funnel", metadata: {"variant": "default"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "sankey"}
    <div class="component-card">
      <div class="component-label">sankey</div>
      <div class="component-body">
        <SafeSankey config={{ component: "sankey", metadata: {"variant": "default"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "treemap"}
    <div class="component-card">
      <div class="component-label">treemap</div>
      <div class="component-body">
        <SafeTreemap config={{ component: "treemap", metadata: {"variant": "default"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "timeline"}
    <div class="component-card">
      <div class="component-label">timeline</div>
      <div class="component-body">
        <SafeTimeline config={{ component: "timeline", metadata: {"variant": "default"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "map"}
    <div class="component-card">
      <div class="component-label">map</div>
      <div class="component-body">
        <SafeMap config={{ component: "map", metadata: {"variant": "default"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "calendar"}
    <div class="component-card">
      <div class="component-label">calendar</div>
      <div class="component-body">
        <SafeCalendar config={{ component: "calendar", metadata: {"variant": "default", "size": "normal"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "toggle"}
    <div class="component-card">
      <div class="component-label">toggle</div>
      <div class="component-body">
        <SafeToggle config={{ component: "toggle", metadata: {"variant": "default", "disabled": false, "labelPosition": "right", "label": "Enable feature", "checked": false} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "week"}
    <div class="component-card">
      <div class="component-label">week</div>
      <div class="component-body">
        <SafeWeek config={{ component: "week", metadata: {"variant": "default"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "chat"}
    <div class="component-card">
      <div class="component-label">chat</div>
      <div class="component-body">
        <SafeChat config={{ component: "chat", metadata: {"title": "Chat", "placeholder": "Type a message..."} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "tabs"}
    <div class="component-card">
      <div class="component-label">tabs</div>
      <div class="component-body">
        <SafeTabs config={{ component: "tabs", metadata: {"variant": "default", "position": "top", "tabs": [{"key": "one", "label": "Tab One"}, {"key": "two", "label": "Tab Two"}]} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "callout"}
    <div class="component-card">
      <div class="component-label">callout</div>
      <div class="component-body">
        <SafeCallout config={{ component: "callout", metadata: {"variant": "info", "position": "top", "message": "This is a callout."} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "drag-drop"}
    <div class="component-card">
      <div class="component-label">drag-drop</div>
      <div class="component-body">
        <SafeDragDrop config={{ component: "drag-drop", metadata: {"variant": "default"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "grid"}
    <div class="component-card">
      <div class="component-label">grid</div>
      <div class="component-body">
        <SafeGrid config={{ component: "grid", metadata: {"spacing": "normal", "radius": "normal", "surface": "normal", "collapsible": false} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "input"}
    <div class="component-card">
      <div class="component-label">input</div>
      <div class="component-body">
        <SafeInput config={{ component: "input", metadata: {"inputType": "text", "align": "normal", "valign": "normal", "placeholder": "Type here..."} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "picker"}
    <div class="component-card">
      <div class="component-label">picker</div>
      <div class="component-body">
        <SafePicker config={{ component: "picker", metadata: {"variant": "default"} }} />
      </div>
    </div>
    {/if}
    {#if activeComponent === null || activeComponent === "nav"}
    <div class="component-card">
      <div class="component-label">nav</div>
      <div class="component-body">
        <SafeNav config={{ component: "nav", metadata: {"navStyle": "classic", "title": "Viewer"} }} />
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
