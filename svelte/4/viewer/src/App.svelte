<script>
  import { onMount } from 'svelte';
  import { SAMPLES } from '../../../../samples';
  import { createSafeProofViewer } from '../../../../dev/proof-viewer';
  import { listAllTickets, createTicket, updateTicket } from './ticket-service';

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
  const themeGlob = import.meta.glob("/public/styles/*/themes/*.css", { query: "?url" });
  for (const p of Object.keys(themeGlob)) {
    const m = p.match(/styles\/([^/]+)\/themes\/([^/]+)\.css$/);
    if (!m) continue;
    (THEMES[m[1]] ??= []).push(m[2]);
  }
  for (const k of Object.keys(THEMES)) THEMES[k].sort((a, b) => a === "default" ? -1 : b === "default" ? 1 : a.localeCompare(b));

  const componentNames = Object.keys(SAMPLES).sort();
  let activeStyle = "vanilla";
  let activeTheme = "default";
  let activeComponent = null;
  let activeVariation = null;
  let tickets = [];
  let ticketView = null;

  function loadStyle(name, theme) {
    document.getElementById("safestyle-link")?.remove();
    document.getElementById("safestyle-paint")?.remove();
    document.getElementById("safestyle-theme")?.remove();
    const link = document.createElement("link");
    link.id = "safestyle-link"; link.rel = "stylesheet";
    link.href = `/styles/${name}/components.css`;
    document.head.appendChild(link);
    const paintLink = document.createElement("link");
    paintLink.id = "safestyle-paint"; paintLink.rel = "stylesheet";
    paintLink.href = `/styles/${name}/paint.css`;
    document.head.appendChild(paintLink);
    const themeLink = document.createElement("link");
    themeLink.id = "safestyle-theme"; themeLink.rel = "stylesheet";
    themeLink.href = `/styles/${name}/themes/${theme}.css`;
    document.head.appendChild(themeLink);
  }

  function switchStyle(s) { activeStyle = s; activeTheme = "default"; loadStyle(s, "default"); }
  function switchTheme(t) { activeTheme = t; loadStyle(activeStyle, t); }
  function selectComponent(name) { activeComponent = name; activeVariation = null; ticketView = null; }
  function selectVariation(comp, v) { activeComponent = comp; activeVariation = v; ticketView = null; }
  function showTickets(view) { ticketView = view; activeComponent = null; activeVariation = null; }

  function refreshTickets() {
    listAllTickets().then(t => { tickets = t; }).catch(e => console.error("[tickets] load failed", e));
  }

  onMount(() => { refreshTickets(); });

  async function handleCreateTicket(comp, typeEl, titleEl) {
    if (!titleEl?.value.trim()) return;
    await createTicket(comp, typeEl.value, titleEl.value.trim(), titleEl.value.trim());
    titleEl.value = "";
    refreshTickets();
  }

  async function handleProveTicket(t, btn, resultEl) {
    btn.textContent = "Proving..."; btn.disabled = true;
    resultEl.textContent = "";
    try {
      if (t.test) {
        const { invoke } = await import("@tauri-apps/api/core");
        const parseCmd = (cmd) => {
          const args = []; let current = ""; let inQuote = false; let quoteChar = "";
          for (const ch of cmd) {
            if (!inQuote && (ch === '"' || ch === "'")) { inQuote = true; quoteChar = ch; continue; }
            if (inQuote && ch === quoteChar) { inQuote = false; continue; }
            if (!inQuote && ch === " ") { if (current) args.push(current); current = ""; continue; }
            current += ch;
          }
          if (current) args.push(current);
          return args;
        };
        const out = await invoke("safecli_run", { name: "safedesk", args: parseCmd(t.test.command) });
        const output = JSON.parse(out);
        const failures = [];
        for (const [path, expected] of Object.entries(t.test.assert)) {
          const actual = path.split(".").reduce((o, k) => o?.[k], output);
          if (actual !== expected) failures.push(`${path}: ${JSON.stringify(actual)} != ${JSON.stringify(expected)}`);
        }
        const pass = failures.length === 0;
        const total = Object.keys(t.test.assert).length;
        resultEl.textContent = pass ? `${total}/${total} PASS` : `${total - failures.length}/${total} FAIL ${failures[0]}`;
        resultEl.style.color = pass ? "var(--sd-success, #15803d)" : "var(--sd-danger, #dc2626)";
      } else {
        resultEl.textContent = "no test defined";
        resultEl.style.color = "var(--sd-text-muted, #475569)";
      }
    } catch (e) {
      resultEl.textContent = `error: ${e.message?.slice(0, 60) ?? e}`;
      resultEl.style.color = "var(--sd-danger, #dc2626)";
    }
    btn.textContent = "Prove"; btn.disabled = false;
  }

  $: openTickets = tickets.filter(t => t.status === "open" || t.status === "in-progress");
  $: closedTickets = tickets.filter(t => t.status === "closed" || t.status === "proved").sort((a, b) => b.updated.localeCompare(a.updated));
  $: activeTickets = ticketView === "open" ? openTickets : closedTickets;
  $: currentThemes = THEMES[activeStyle] ?? ["default"];
</script>

<div class="viewer">
  <div class="sidebar">
    <div class="brand"><img src="/shield.png" alt="SafeDesk" /><span>svelte/4</span></div>
    <div class="section-label">STYLE</div>
    <div class="style-dropdowns">
      <label class="dropdown-label">Framework</label>
      <select class="dropdown" value={activeStyle} on:change={(e) => switchStyle(e.target.value)}>
        {#each STYLES as s}<option value={s}>{s}</option>{/each}
      </select>
      <label class="dropdown-label">Theme</label>
      <select class="dropdown" value={activeTheme} on:change={(e) => switchTheme(e.target.value)}>
        {#each currentThemes as t}<option value={t}>{t}</option>{/each}
      </select>
    </div>

    <div class="section-label" style="margin-top:16px">TICKETS</div>
    <button class="comp-btn" class:active={ticketView === "open"} on:click={() => showTickets("open")}>
      Open {openTickets.length > 0 ? `(${openTickets.length})` : ""}
    </button>
    <button class="comp-btn" class:active={ticketView === "closed"} on:click={() => showTickets("closed")}>
      Closed {closedTickets.length > 0 ? `(${closedTickets.length})` : ""}
    </button>

    <div class="section-label" style="margin-top:16px">COMPONENTS</div>
    <button class="comp-btn" class:active={activeComponent === null && !ticketView} on:click={() => selectComponent(null)}>All</button>
    {#each componentNames as name}
      <button class="comp-btn" class:active={activeComponent === name && !activeVariation && !ticketView} on:click={() => selectComponent(name)}>{name}</button>
      {#if activeComponent === name}
        {#each Object.keys(SAMPLES[name]).sort() as v}
          <button class="var-btn" class:active={activeVariation === v} on:click={() => selectVariation(name, v)}>{v}</button>
        {/each}
      {/if}
    {/each}
  </div>
  <div class="main">
    <h3>svelte/4 — {activeStyle}{#if activeTheme !== "default"}/{activeTheme}{/if}{#if ticketView}<span class="active-comp"> — tickets/{ticketView}</span>{:else if activeComponent}<span class="active-comp"> — {activeVariation ?? activeComponent}</span>{/if}</h3>

    {#if ticketView}
      <div class="ticket-list">
        {#each activeTickets as t (t.id)}
          <div class="ticket-card">
            <div class="ticket-header">
              <div>
                <span class="ticket-id">{t.id}</span>
                <span class="ticket-type">{t.type}</span>
              </div>
              <span class="ticket-status" class:status-open={t.status === "open"} class:status-closed={t.status === "closed"}>{t.status}</span>
            </div>
            <div class="ticket-body">
              <div class="ticket-title">{t.title}</div>
              <div class="ticket-desc">{t.description}</div>
            </div>
            <div class="ticket-meta">
              <span>proves: {t.proves.join(", ")}</span>
              {#if t.params}<span>scope: {Object.entries(t.params).map(([k,v]) => `${k}=${v}`).join(" ")}</span>{/if}
              {#if t.resolution}<span>resolution: {t.resolution}</span>{/if}
            </div>
            <div class="ticket-actions">
              <button class="btn-prove" on:click={(e) => { const btn = e.currentTarget; const res = btn.parentElement.querySelector('.prove-result'); handleProveTicket(t, btn, res); }}>Prove</button>
              <span class="prove-result"></span>
              {#if t.status === "open"}
                <button class="btn-action" on:click={async () => { await updateTicket({ ...t, status: "in-progress" }); refreshTickets(); }}>Start</button>
                <button class="btn-action" on:click={async () => { await updateTicket({ ...t, status: "closed", resolution: "Closed without resolution" }); refreshTickets(); }}>Close</button>
              {/if}
            </div>
          </div>
        {:else}
          <div class="ticket-empty">No {ticketView} tickets.</div>
        {/each}
      </div>
    {:else}
      {#each (activeComponent ? [activeComponent] : componentNames) as comp (comp + (activeVariation ?? ""))}
        {#each (activeVariation ? [activeVariation] : Object.keys(SAMPLES[comp]).sort()) as v (v)}
          <div class="component-card">
            <div class="component-label">{v}</div>
            <div class="component-body">
              <svelte:component this={comps[comp]} config={SAMPLES[comp][v]} onEvent={handleEvent} />
            </div>
            <div style="border-top: 1px solid var(--sd-border, #e5e7eb)" use:proofMount={comp}></div>
            <div class="ticket-create">
              <select class="ticket-type-select" id={`ticket-type-${comp}`}>
                <option value="bug">bug</option><option value="event">event</option><option value="paint">paint</option>
                <option value="style">style</option><option value="data">data</option><option value="structure">structure</option>
                <option value="variation">variation</option><option value="new-component">new-component</option>
              </select>
              <input class="ticket-title-input" id={`ticket-title-${comp}`} placeholder="Describe the issue..." />
              <button class="btn-prove" on:click={() => {
                const titleEl = document.getElementById(`ticket-title-${comp}`);
                const typeEl = document.getElementById(`ticket-type-${comp}`);
                handleCreateTicket(comp, typeEl, titleEl);
              }}>+ Ticket</button>
            </div>
          </div>
        {/each}
      {/each}
    {/if}
  </div>
</div>

<style>
  .viewer { display: flex; height: 100vh; font-family: system-ui, sans-serif; background: var(--sd-surface-base, #fff); color: var(--sd-text, #1a1a1a); }
  .sidebar { width: 220px; border-right: 1px solid var(--sd-border, #e5e7eb); padding: 12px; overflow-y: auto; flex-shrink: 0; background: var(--sd-surface-raised, #f9fafb); }
  .brand { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid var(--sd-border, #e5e7eb); font-size: 13px; font-weight: 600; }
  .brand img { width: 18px; height: 21px; }
  .section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sd-text-muted, #6b7280); margin-bottom: 8px; }
  .comp-btn, .var-btn { display: block; width: 100%; text-align: left; padding: 4px 8px; font-size: 13px; border: none; border-radius: 4px; cursor: pointer; background: transparent; color: var(--sd-text, #1a1a1a); margin-bottom: 2px; }
  .style-dropdowns { padding: 0 8px; display: flex; flex-direction: column; gap: 6px; }
  .dropdown-label { font-size: 11px; font-weight: 500; color: var(--sd-text-muted, #6b7280); }
  .dropdown { width: 100%; padding: 4px 8px; font-size: 13px; border-radius: 4px; border: 1px solid var(--sd-border, #d1d5db); background: var(--sd-surface-base, #fff); color: var(--sd-text, #1a1a1a); }
  .var-btn { padding-left: 22px; }
  .comp-btn.active, .var-btn.active { background: var(--sd-accent, #3b82f6); color: var(--sd-text-inverse, white); }
  .comp-btn:hover, .var-btn:hover { background: var(--sd-surface-raised, #f3f4f6); }
  .comp-btn.active:hover, .var-btn.active:hover { background: var(--sd-accent, #3b82f6); }
  .main { flex: 1; overflow-y: auto; padding: 24px; }
  h3 { font-size: 14px; margin: 0 0 16px; }
  .active-comp { font-weight: 400; color: var(--sd-text-muted, #6b7280); }
  .component-card { border: 1px solid var(--sd-border, #e5e7eb); border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
  .component-label { padding: 8px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sd-text-muted, #6b7280); border-bottom: 1px solid var(--sd-border, #e5e7eb); background: var(--sd-surface-raised, #fafafa); }
  .component-body { padding: 16px; }
  .ticket-list { display: flex; flex-direction: column; gap: 12px; }
  .ticket-card { border: 1px solid var(--sd-border, #e5e7eb); border-radius: 6px; overflow: hidden; }
  .ticket-header { padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; background: var(--sd-surface-raised, #fafafa); }
  .ticket-id { font-size: 11px; font-weight: 700; color: var(--sd-accent, #2563eb); margin-right: 8px; }
  .ticket-type { font-size: 11px; padding: 1px 6px; border-radius: 3px; background: var(--sd-surface-sunken, #f1f5f9); color: var(--sd-text-dim, #475569); }
  .ticket-status { font-size: 11px; font-weight: 600; }
  .status-open { color: var(--sd-accent, #2563eb); }
  .status-closed { color: var(--sd-success, #15803d); }
  .ticket-body { padding: 8px 12px; }
  .ticket-title { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .ticket-desc { font-size: 11px; color: var(--sd-text-dim, #475569); line-height: 1.5; }
  .ticket-meta { padding: 6px 12px; border-top: 1px solid var(--sd-border, #e5e7eb); font-size: 10px; color: var(--sd-text-muted, #475569); display: flex; gap: 12px; flex-wrap: wrap; }
  .ticket-actions { padding: 6px 12px; border-top: 1px solid var(--sd-border, #e5e7eb); display: flex; gap: 8px; align-items: center; }
  .ticket-empty { color: var(--sd-text-muted, #6b7280); font-size: 13px; }
  .btn-prove { padding: 2px 8px; font-size: 10px; font-weight: 600; border-radius: 3px; border: none; background: var(--sd-accent, #2563eb); color: var(--sd-text-inverse, #fff); cursor: pointer; }
  .btn-action { padding: 2px 8px; font-size: 10px; border-radius: 3px; border: 1px solid var(--sd-border, #d1d5db); background: var(--sd-surface-base, #fff); color: var(--sd-text, #0f172a); cursor: pointer; }
  .prove-result { font-size: 10px; font-weight: 600; }
  .ticket-create { padding: 8px 12px; border-top: 1px solid var(--sd-border, #e5e7eb); display: flex; gap: 6px; align-items: center; }
  .ticket-type-select { padding: 3px 6px; font-size: 10px; border-radius: 3px; border: 1px solid var(--sd-border, #d1d5db); background: var(--sd-surface-base, #fff); color: var(--sd-text, #0f172a); }
  .ticket-title-input { flex: 1; padding: 3px 6px; font-size: 11px; border-radius: 3px; border: 1px solid var(--sd-border, #d1d5db); background: var(--sd-surface-base, #fff); color: var(--sd-text, #0f172a); }
</style>
