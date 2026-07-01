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
  let activeStyle = $state("vanilla");
  let activeTheme = $state("default");
  let activeComponent = $state(null);
  let activeVariation = $state(null);
  let tickets = $state([]);
  let ticketView = $state(null);
  let proofView = $state(false);
  let activeProof = $state(null);
  let proofResults = $state({});
  let proofRunning = $state(false);
  let runningCommands = $state(new Set());
  let proofProgress = $state(null);
  let proofToast = $state(null);

  const PROOF_DOMAINS = [
    { label: "builder", commands: ["builder-dumb", "builder-reconcile", "builder-structure"] },
    { label: "event", commands: ["event-coverage", "event-declared", "event-payload"] },
    { label: "framework", commands: ["framework-boot", "framework-delegation"] },
    { label: "paint", commands: ["paint-chain", "paint-contrast", "paint-cssonly", "paint-definition", "paint-parity", "paint-unopinionated"] },
    { label: "ticket", commands: ["ticket"] },
  ];
  const ALL_PROVE_COMMANDS = PROOF_DOMAINS.flatMap(d => d.commands);

  async function runProofs(commands) {
    proofRunning = true;
    proofProgress = { done: 0, total: commands.length };
    const cleared = { ...proofResults };
    commands.forEach(c => delete cleared[c]);
    proofResults = cleared;
    runningCommands = new Set(commands);
    let doneCount = 0;
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const results = await Promise.all(commands.map(async cmd => {
        try {
          const out = await invoke("safecli_run", { name: "safezero", args: ["prove", cmd] });
          const parsed = JSON.parse(out);
          const entry = { passed: parsed.passed ?? 0, total: parsed.total ?? 0, failed: parsed.failed ?? 0, checks: parsed.checks, failures: parsed.failures };
          proofResults = { ...proofResults, [cmd]: entry };
          runningCommands = new Set([...runningCommands].filter(c => c !== cmd));
          doneCount++; proofProgress = { done: doneCount, total: commands.length };
          return [cmd, entry];
        } catch {
          const entry = { passed: 0, total: 1, failed: 1 };
          proofResults = { ...proofResults, [cmd]: entry };
          runningCommands = new Set([...runningCommands].filter(c => c !== cmd));
          doneCount++; proofProgress = { done: doneCount, total: commands.length };
          return [cmd, entry];
        }
      }));
      const totalP = results.reduce((s, [,v]) => s + (v.passed ?? 0), 0);
      const totalT = results.reduce((s, [,v]) => s + (v.total ?? 0), 0);
      const totalF = results.reduce((s, [,v]) => s + (v.failed ?? 0), 0);
      const pass = totalF === 0;
      proofToast = { message: `${totalP}/${totalT} checks ${pass ? "passed PASS" : `— ${totalF} failed FAIL`}`, color: pass ? "var(--sd-success, #15803d)" : "var(--sd-danger, #dc2626)" };
      setTimeout(() => { proofToast = null; }, 4000);
    } finally {
      proofRunning = false;
      runningCommands = new Set();
      proofProgress = null;
    }
  }

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
  function selectComponent(name) { activeComponent = name; activeVariation = null; ticketView = null; proofView = false; activeProof = null; }
  function selectVariation(comp, v) { activeComponent = comp; activeVariation = v; ticketView = null; proofView = false; activeProof = null; }
  function showTickets(view) { ticketView = view; activeComponent = null; activeVariation = null; proofView = false; activeProof = null; }
  function showProofs(label) { activeProof = label; proofView = true; ticketView = null; }

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
        const out = await invoke("safecli_run", { name: "safezero", args: parseCmd(t.test.command) });
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
</script>

<div class="viewer">
  <div class="sidebar">
    <div class="brand"><img src="/shield.png" alt="SafeDesk" /><span>svelte/5</span></div>
    <div class="section-label">STYLE</div>
    <div class="style-dropdowns">
      <label class="dropdown-label">Framework</label>
      <select class="dropdown" bind:value={activeStyle} onchange={(e) => switchStyle(e.target.value)}>
        {#each STYLES as s}<option value={s}>{s}</option>{/each}
      </select>
      <label class="dropdown-label">Theme</label>
      <select class="dropdown" bind:value={activeTheme} onchange={(e) => switchTheme(e.target.value)}>
        {#each (THEMES[activeStyle] ?? ["default"]) as t}<option value={t}>{t}</option>{/each}
      </select>
    </div>

    <div class="section-label" style="margin-top:16px">PROOFS</div>
    <button class="comp-btn" class:active={proofView && activeProof === null} onclick={() => showProofs(null)}>All</button>
    {#each PROOF_DOMAINS as d}
      <button class="comp-btn" class:active={proofView && activeProof === d.label} onclick={() => showProofs(d.label)}>{d.label}</button>
    {/each}

    <div class="section-label" style="margin-top:16px">TICKETS</div>
    <button class="comp-btn" class:active={ticketView === "open"} onclick={() => showTickets("open")}>
      Open {tickets.filter(t => t.status === "open" || t.status === "in-progress").length > 0 ? `(${tickets.filter(t => t.status === "open" || t.status === "in-progress").length})` : ""}
    </button>
    <button class="comp-btn" class:active={ticketView === "closed"} onclick={() => showTickets("closed")}>
      Closed {tickets.filter(t => t.status === "closed" || t.status === "proved").length > 0 ? `(${tickets.filter(t => t.status === "closed" || t.status === "proved").length})` : ""}
    </button>

    <div class="section-label" style="margin-top:16px">COMPONENTS</div>
    <button class="comp-btn" class:active={activeComponent === null && !ticketView} onclick={() => selectComponent(null)}>All</button>
    {#each componentNames as name}
      <button class="comp-btn" class:active={activeComponent === name && !activeVariation && !ticketView} onclick={() => selectComponent(name)}>{name}</button>
      {#if activeComponent === name}
        {#each Object.keys(SAMPLES[name]).sort() as v}
          <button class="var-btn" class:active={activeVariation === v} onclick={() => selectVariation(name, v)}>{v}</button>
        {/each}
      {/if}
    {/each}
  </div>
  <div class="main">
    <h3>svelte/5 — {activeStyle}{#if activeTheme !== "default"}/{activeTheme}{/if}{#if proofView}<span class="active-comp"> — proofs{activeProof ? ` / ${activeProof}` : ""}</span>{:else if ticketView}<span class="active-comp"> — tickets/{ticketView}</span>{:else if activeComponent}<span class="active-comp"> — {activeVariation ?? activeComponent}</span>{/if}</h3>

    {#if proofView}
      <div style="display:flex;flex-direction:column;gap:16px">
        <div style="display:flex;align-items:center;gap:12px">
          <button class="btn-prove" style="padding:6px 16px;font-size:13px;font-weight:600;border-radius:4px;cursor:{proofRunning?'wait':'pointer'};background:{proofRunning?'var(--sd-text-muted,#6b7280)':'var(--sd-accent,#2563eb)'}" disabled={proofRunning}
            onclick={() => runProofs(activeProof ? (PROOF_DOMAINS.find(d => d.label === activeProof)?.commands ?? []) : ALL_PROVE_COMMANDS)}>
            {proofRunning ? `⟳ Running${proofProgress ? ` ${proofProgress.done}/${proofProgress.total}` : "..."}` : `▶ ${activeProof ? `Run ${activeProof}` : "Run All"}`}
          </button>
          {#if (() => { const cmds = activeProof ? (PROOF_DOMAINS.find(d => d.label === activeProof)?.commands ?? []) : ALL_PROVE_COMMANDS; return cmds.reduce((s,c) => s+(proofResults[c]?.total??0),0) > 0; })()}
            {@const cmds = activeProof ? (PROOF_DOMAINS.find(d => d.label === activeProof)?.commands ?? []) : ALL_PROVE_COMMANDS}
            {@const totalT = cmds.reduce((s,c) => s+(proofResults[c]?.total??0),0)}
            {@const totalP = cmds.reduce((s,c) => s+(proofResults[c]?.passed??0),0)}
            {@const totalF = cmds.reduce((s,c) => s+(proofResults[c]?.failed??0),0)}
            <span style="font-size:13px;font-weight:600;color:{totalF===0?'var(--sd-success,#15803d)':'var(--sd-danger,#dc2626)'}">{totalP}/{totalT} {totalF===0?'PASS':`(${totalF} failed)`}</span>
          {/if}
        </div>
        {#each (activeProof ? PROOF_DOMAINS.filter(d => d.label === activeProof) : PROOF_DOMAINS) as domain}
          <div>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <span style="font-size:12px;font-weight:700;text-transform:uppercase;color:var(--sd-text-muted,#6b7280)">{domain.label}</span>
              {#if !activeProof}
                <button class="btn-action" disabled={proofRunning} onclick={() => runProofs(domain.commands)}>Run</button>
              {/if}
              {#if domain.commands.reduce((s,c) => s+(proofResults[c]?.total??0),0) > 0}
                {@const dt = domain.commands.reduce((s,c) => s+(proofResults[c]?.total??0),0)}
                {@const dp = domain.commands.reduce((s,c) => s+(proofResults[c]?.passed??0),0)}
                <span style="font-size:11px;font-weight:600;color:{dp===dt?'var(--sd-success,#15803d)':'var(--sd-danger,#dc2626)'}">{dp}/{dt}</span>
              {/if}
            </div>
            {#each domain.commands as cmd}
              {@const r = proofResults[cmd]}
              {@const isRunning = runningCommands.has(cmd)}
              {@const hasResults = r && r.total > 0}
              {@const pass = r && r.failed === 0}
              <div style="border:1px solid var(--sd-border,#e5e7eb);border-radius:6px;margin-bottom:8px;overflow:hidden;opacity:{isRunning?0.6:1}">
                <div style="padding:8px 12px;display:flex;justify-content:space-between;align-items:center;background:var(--sd-surface-raised,#fafafa)">
                  <span style="font-size:13px;font-weight:600">{cmd}</span>
                  {#if isRunning}<span style="font-size:11px;color:var(--sd-text-muted,#6b7280)">⟳ running</span>{/if}
                  {#if !isRunning && hasResults}<span style="font-size:12px;font-weight:600;color:{pass?'var(--sd-success,#15803d)':'var(--sd-danger,#dc2626)'}">{r.passed}/{r.total} {pass?'PASS':'FAIL'}</span>{/if}
                </div>
                {#if hasResults && r.failures?.length > 0}
                  <div style="padding:8px 12px;border-top:1px solid var(--sd-border,#e5e7eb)">
                    {#each r.failures as f}<div style="font-size:11px;color:var(--sd-danger,#dc2626);font-family:monospace;padding:2px 0">{f.error?.slice(0,120)}</div>{/each}
                  </div>
                {/if}
                {#if hasResults && r.checks}
                  <div style="padding:8px 12px;border-top:1px solid var(--sd-border,#e5e7eb);font-size:11px;color:var(--sd-text-dim,#475569)">
                    {#each [...new Set(r.checks.map(c => c.group))] as group}
                      {@const gc = r.checks.filter(c => c.group === group)}
                      {@const gp = gc.filter(c => c.status === "pass").length}
                      <div style="display:flex;justify-content:space-between;padding:1px 0">
                        <span>{group}</span>
                        <span style="font-weight:600;color:{gp===gc.length?'var(--sd-success,#15803d)':'var(--sd-danger,#dc2626)'}">{gp}/{gc.length}</span>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/each}
      </div>
    {:else if ticketView}
      <!-- Ticket list view -->
      <div class="ticket-list">
        {#each (ticketView === "open" ? tickets.filter(t => t.status === "open" || t.status === "in-progress") : tickets.filter(t => t.status === "closed" || t.status === "proved").sort((a, b) => b.updated.localeCompare(a.updated))) as t (t.id)}
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
              <button class="btn-prove" onclick={(e) => { const btn = e.currentTarget; const res = btn.parentElement.querySelector('.prove-result'); handleProveTicket(t, btn, res); }}>Prove</button>
              <span class="prove-result"></span>
              {#if t.status === "open"}
                <button class="btn-action" onclick={async () => { await updateTicket({ ...t, status: "in-progress" }); refreshTickets(); }}>Start</button>
                <button class="btn-action" onclick={async () => { await updateTicket({ ...t, status: "closed", resolution: "Closed without resolution" }); refreshTickets(); }}>Close</button>
              {/if}
            </div>
          </div>
        {:else}
          <div class="ticket-empty">No {ticketView} tickets.</div>
        {/each}
      </div>
    {:else}
      <!-- Component view -->
      {#each (activeComponent ? [activeComponent] : componentNames) as comp (comp + (activeVariation ?? ""))}
        {#each (activeVariation ? [activeVariation] : Object.keys(SAMPLES[comp]).sort()) as v (v)}
          <div class="component-card">
            <div class="component-label">{v}</div>
            <div class="component-body">
              <svelte:component this={comps[comp]} config={SAMPLES[comp][v]} onEvent={handleEvent} />
            </div>
            <div style="border-top: 1px solid var(--sd-border, #e5e7eb)" use:proofMount={comp}></div>
            <!-- Ticket creation -->
            <div class="ticket-create">
              <select class="ticket-type-select" id={`ticket-type-${comp}`}>
                <option value="bug">bug</option><option value="event">event</option><option value="paint">paint</option>
                <option value="style">style</option><option value="data">data</option><option value="structure">structure</option>
                <option value="variation">variation</option><option value="new-component">new-component</option>
              </select>
              <input class="ticket-title-input" id={`ticket-title-${comp}`} placeholder="Describe the issue..." />
              <button class="btn-prove" onclick={() => {
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

{#if proofToast}
  <div style="position:fixed;bottom:24px;right:24px;padding:10px 20px;border-radius:6px;background:var(--sd-surface-deep,#1e293b);color:{proofToast.color};font-size:13px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.25);z-index:9999">
    {proofToast.message}
  </div>
{/if}

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
  /* Ticket styles */
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
