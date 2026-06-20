<script>
  import { SAMPLES } from '../../../../samples';
    import { createSafeProofViewer } from '../../../../dev/proof-viewer';

  function proofMount(node, comp) {
    node.innerHTML = '';
    createSafeProofViewer(node, { component: 'proof-viewer', metadata: { target: comp } }, handleEvent);
    return { update(newComp) { node.innerHTML = ''; createSafeProofViewer(node, { component: 'proof-viewer', metadata: { target: newComp } }, handleEvent); } };
  }

  function handleEvent(event) {
    console.log('[event]', event.origin?.id, event.name, event.data);
    document.querySelectorAll('[data-component="proof-viewer"]').forEach((pv) => {
      if (pv.pushEvent) pv.pushEvent(event);
    });
  }
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
  import SafeFlow from "../../SafeFlow.svelte";
  import SafeHierarchy from "../../SafeHierarchy.svelte";
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
  import SafeList from "../../SafeList.svelte";
  import SafePicker from "../../SafePicker.svelte";
  import SafeNav from "../../SafeNav.svelte";
  import SafeParser from "../../SafeParser.svelte";
  import SafePlan from "../../SafePlan.svelte";
  import SafeSkillUp from "../../SafeSkillUp.svelte";
  import SafeDispatch from "../../SafeDispatch.svelte";
  import SafeBriefing from "../../SafeBriefing.svelte";

  const comps = { "layout": SafeLayout, "columns": SafeColumns, "card": SafeCard, "button": SafeButton, "table": SafeTable, "tree": SafeTree, "sheet": SafeSheet, "chart": SafeChart, "heatmap": SafeHeatmap, "gauge": SafeGauge, "funnel": SafeFunnel, "flow": SafeFlow, "hierarchy": SafeHierarchy, "timeline": SafeTimeline, "map": SafeMap, "calendar": SafeCalendar, "toggle": SafeToggle, "week": SafeWeek, "chat": SafeChat, "tabs": SafeTabs, "callout": SafeCallout, "drag-drop": SafeDragDrop, "grid": SafeGrid, "input": SafeInput, "list": SafeList, "picker": SafePicker, "nav": SafeNav, "parser": SafeParser, "plan": SafePlan, "skillup": SafeSkillUp, "dispatch": SafeDispatch, "briefing": SafeBriefing };
  const STYLES = ["vanilla", "tailwind", "tailwind-daisy", "material"];
  const THEMES = {};
  // Discover themes from safestyles
  const themeGlob = import.meta.glob("/public/styles/*/themes/*.css", { query: "?url" });
  for (const p of Object.keys(themeGlob)) {
    const m = p.match(/styles\/([^/]+)\/themes\/([^/]+)\.css$/);
    if (!m) continue;
    (THEMES[m[1]] ??= []).push(m[2]);
  }
  for (const k of Object.keys(THEMES)) THEMES[k].sort((a, b) => a === "default" ? -1 : b === "default" ? 1 : a.localeCompare(b));

  const componentNames = Object.keys(SAMPLES).sort();
  let activeStyle = $state("vanilla");
  let activeTheme = $state("default");
  let activeComponent = $state(null);
  let activeVariation = $state(null);

  function loadStyle(name, theme) {
    document.getElementById("safestyle-link")?.remove();
    document.getElementById("safestyle-paint")?.remove();
    document.getElementById("safestyle-theme")?.remove();
    const link = document.createElement("link");
    link.id = "safestyle-link";
    link.rel = "stylesheet";
    link.href = `/styles/${name}/components.css`;
    document.head.appendChild(link);
    const paintLink = document.createElement("link");
    paintLink.id = "safestyle-paint";
    paintLink.rel = "stylesheet";
    paintLink.href = `/styles/${name}/paint.css`;
    document.head.appendChild(paintLink);
    const themeLink = document.createElement("link");
    themeLink.id = "safestyle-theme";
    themeLink.rel = "stylesheet";
    themeLink.href = `/styles/${name}/themes/${theme}.css`;
    document.head.appendChild(themeLink);
  }

  function switchStyle(s) {
    activeStyle = s;
    activeTheme = "default";
    loadStyle(s, "default");
  }

  function switchTheme(t) {
    activeTheme = t;
    loadStyle(activeStyle, t);
  }

  function selectComponent(name) {
    activeComponent = name;
    activeVariation = null;
  }

  function selectVariation(comp, v) {
    activeComponent = comp;
    activeVariation = v;
  }
</script>

<div class="viewer">
  <div class="sidebar">
    <div class="brand"><img src="/shield.png" alt="SafeDesk" /><span>svelte/5</span></div>
      <div class="section-label">STYLE</div>
    <div class="style-dropdowns">
      <label class="dropdown-label">Framework</label>
      <select class="dropdown" bind:value={activeStyle} onchange={(e) => switchStyle(e.target.value)}>
        {#each STYLES as s}
          <option value={s}>{s}</option>
        {/each}
      </select>
      <label class="dropdown-label">Theme</label>
      <select class="dropdown" bind:value={activeTheme} onchange={(e) => switchTheme(e.target.value)}>
        {#each (THEMES[activeStyle] ?? ["default"]) as t}
          <option value={t}>{t}</option>
        {/each}
      </select>
    </div>

    <div class="section-label" style="margin-top:16px">COMPONENTS</div>
    <button class="comp-btn" class:active={activeComponent === null} onclick={() => selectComponent(null)}>All</button>
    {#each componentNames as name}
      <button class="comp-btn" class:active={activeComponent === name && !activeVariation} onclick={() => selectComponent(name)}>{name}</button>
      {#if activeComponent === name}
        {#each Object.keys(SAMPLES[name]).sort() as v}
          <button class="var-btn" class:active={activeVariation === v} onclick={() => selectVariation(name, v)}>{v}</button>
        {/each}
      {/if}
    {/each}
  </div>
  <div class="main">
    <h3>svelte/5 — {activeStyle}{#if activeTheme !== "default"}/{activeTheme}{/if}{#if activeComponent}<span class="active-comp"> — {activeVariation ?? activeComponent}</span>{/if}</h3>
    {#each (activeComponent ? [activeComponent] : componentNames) as comp (comp + (activeVariation ?? ""))}
      {#each (activeVariation ? [activeVariation] : Object.keys(SAMPLES[comp]).sort()) as v (v)}
        <div class="component-card">
          <div class="component-label">{v}</div>
          <div class="component-body">
            <svelte:component this={comps[comp]} config={SAMPLES[comp][v]} onEvent={handleEvent} />
          </div>
          <div style="border-top: 1px solid var(--sd-border, #e5e7eb)" use:proofMount={comp}></div>
        </div>
      {/each}
    {/each}
  </div>
</div>

<style>
  .viewer { display: flex; height: 100vh; font-family: system-ui, sans-serif; }
  .sidebar { width: 220px; border-right: 1px solid #e5e7eb; padding: 12px; overflow-y: auto; flex-shrink: 0; }
  .brand { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; font-size: 13px; font-weight: 600; }
  .brand img { width: 18px; height: 21px; }
  .section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 8px; }
  .style-btn, .comp-btn, .var-btn { display: block; width: 100%; text-align: left; padding: 4px 8px; font-size: 13px; border: none; border-radius: 4px; cursor: pointer; background: transparent; color: #1a1a1a; margin-bottom: 2px; }
  .style-dropdowns { padding: 0 8px; display: flex; flex-direction: column; gap: 6px; }
  .dropdown-label { font-size: 11px; font-weight: 500; color: #6b7280; }
  .dropdown { width: 100%; padding: 4px 8px; font-size: 13px; border-radius: 4px; border: 1px solid #d1d5db; background: #fff; color: #1a1a1a; }
  .var-btn { padding-left: 22px; }
  .style-btn.active, .comp-btn.active, .var-btn.active { background: #3b82f6; color: white; }
  .style-btn:hover, .comp-btn:hover, .var-btn:hover { background: #f3f4f6; }
  .style-btn.active:hover, .comp-btn.active:hover, .var-btn.active:hover { background: #3b82f6; }
  .main { flex: 1; overflow-y: auto; padding: 24px; }
  h3 { font-size: 14px; font-weight: 600; margin-bottom: 16px; }
  .active-comp { font-weight: 400; color: #6b7280; }
  .component-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
  .component-label { padding: 8px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; background: #fafafa; }
  .component-body { padding: 16px; }
</style>
