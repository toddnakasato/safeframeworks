<script>
  import { onMount, untrack } from 'svelte';
  import { SAMPLES } from '../../../../samples';
  import { createSafeProofViewer } from '../../../../dev/proof-viewer';
  import { craveRun, pushCraveEvent, treeLines, treeCount } from '../../../../dev/crave-station';
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
  const DEFAULT_COMP = componentNames.includes("briefing") ? "briefing" : componentNames[0];
  let activeStyle = $state("vanilla");
  let activeTheme = $state("default");
  let activeComponent = $state(DEFAULT_COMP);
  let activeVariation = $state(Object.keys(SAMPLES[DEFAULT_COMP] ?? {}).sort()[0] ?? null);
  let tickets = $state([]);
  let ticketView = $state(null);
  let proofView = $state(false);
  let activeProof = $state(null);
  let proofResults = $state({});
  let proofRunning = $state(false);
  let runningCommands = $state(new Set());
  let proofProgress = $state(null);
  let proofToast = $state(null);
  let orbitorView = $state(false);
  let activeOrbitor = $state(null);
  let orbitorTail = $state(null);
  let orbitorLoading = $state(false);

  // Orbitor categories — alpha order (TICKET_CATEGORIES)
  const ORBITOR_NAMES = ["alive", "crave", "drive", "enforce", "learn", "orbit", "pulse", "safeagents", "safeapp", "safebuilds", "safecli", "safeconfig", "safecontracts", "safeframeworks", "safelibs", "safestyles"];
  const ORBITOR_GOALS = {
    alive: "goal-alive", crave: "goal-crave", drive: "goal-drive", enforce: "goal-enforce",
    learn: "goal-learn", orbit: "goal-orbit", pulse: "goal-pulse",
    safeagents: "goal-safeagents-structure", safeapp: "goal-safeapp-structure",
    safebuilds: "goal-safebuilds-structure", safecli: "goal-safecli-structure",
    safeconfig: "goal-safeconfig-structure", safecontracts: "goal-safecontracts",
    safeframeworks: "goal-safeframeworks-builders", safelibs: "goal-safelibs", safestyles: "goal-safestyles-structure",
  };

  async function loadOrbitorTail(orbitor) {
    orbitorLoading = true;
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const args = ["orbit", "tail", "--limit", "100"];
      if (orbitor) args.push("--goal", ORBITOR_GOALS[orbitor]);
      const out = await invoke("safecli_run", { name: "safezero", args });
      const parsed = JSON.parse(out);
      orbitorTail = { entries: parsed.entries ?? [], ts: parsed.ts };
    } catch (e) {
      console.error("[orbitor] tail failed", e);
      orbitorTail = { entries: [], ts: new Date().toISOString() };
    } finally {
      orbitorLoading = false;
    }
  }

  function showOrbitors(orbitor) {
    activeOrbitor = orbitor;
    orbitorView = true;
    proofView = false;
    activeProof = null;
    ticketView = null;
    loadOrbitorTail(orbitor);
  }

    async function wakeOrbitor(goalId) {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        const args = goalId ? ["orbit", "wake", "--goal", goalId] : ["orbit", "wake-all"];
        await invoke("safecli_run", { name: "safezero", args });
      } catch (e) { console.error("[orbitor] wake failed", e); }
    }

  const fmtEst = (ts) => new Date(ts).toLocaleTimeString("en-US", { timeZone: "America/New_York", hour12: true });

  // Bottom-anchored auto-scroll — pin scrollTop to scrollHeight after render/update.
  function scrollBottom(node) {
    node.scrollTop = node.scrollHeight;
    return { update() { node.scrollTop = node.scrollHeight; } };
  }

  // ── CRAVE five-station panel ──────────────────────────────────────────────
  let craveMount = $state(null);
  let craveOverride = $state(null);
  let craveResult = $state(null);
  let craveEvents = $state([]);
  let configText = $state("");
  let configErr = $state(null);

  const craveVerdictColor = (v) => v === "GREEN" ? "var(--sd-success, #15803d)" : v === "RED" ? "var(--sd-danger, #dc2626)" : "var(--sd-warn, #d97706)";

  // effective config — user override wins, else the selected sample
  const craveConfig = $derived(craveOverride ?? ((activeComponent && activeVariation && SAMPLES[activeComponent]?.[activeVariation]) || null));

  // reset override + ticker when the selected sample changes
  $effect(() => {
    void activeComponent; void activeVariation;
    craveOverride = null;
    craveEvents = [];
  });

  // keep the C-card textarea in sync with the effective config
  $effect(() => {
    if (craveConfig) {
      configText = JSON.stringify(craveConfig, null, 2);
      configErr = null;
    }
  });

  // C→R→A→V→E: one pipeline run per effective config + mount
  $effect(() => {
    const cfg = craveConfig;
    const el = craveMount;
    if (!cfg || !el) return;
    craveResult = craveRun(cfg, el, (ev) => {
      craveEvents = pushCraveEvent(untrack(() => craveEvents), ev);
      handleEvent(ev);
    });
  });

  function applyConfigText(text) {
    configText = text;
    try {
      const parsed = JSON.parse(text);
      configErr = null;
      craveOverride = parsed;
    } catch (e) {
      configErr = e.message?.split("\n")[0] ?? "invalid JSON";
    }
  }

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
  function selectComponent(name) {
    activeComponent = name;
    activeVariation = Object.keys(SAMPLES[name] ?? {}).sort()[0] ?? null;
    ticketView = null; proofView = false; activeProof = null; orbitorView = false;
  }
  function selectVariation(comp, v) { activeComponent = comp; activeVariation = v; ticketView = null; proofView = false; activeProof = null; orbitorView = false; }
  function showTickets(view) { ticketView = view; activeComponent = null; activeVariation = null; proofView = false; activeProof = null; orbitorView = false; }
  function showProofs(label) { activeProof = label; proofView = true; ticketView = null; orbitorView = false; }

  function refreshTickets() {
    listAllTickets().then(t => { tickets = t; }).catch(e => console.error("[tickets] load failed", e));
  }

  onMount(() => { refreshTickets(); });

  // Live orbitor view — watch safeagent/heartbeats/ and re-tail on change.
  onMount(() => {
    const HEARTBEATS_DIR = "/Users/toddnakasato/Documents/FF/VSCODE/FFPROD/safeconfig/safeagent/heartbeats";
    let timer = null;
    let unlisten = null;
    let disposed = false;
    (async () => {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        invoke("watch_dir", { path: HEARTBEATS_DIR }).catch(() => {});
        const { listen } = await import("@tauri-apps/api/event");
        const fn = await listen("fs-change", (event) => {
          const path = event?.payload ?? event;
          if (typeof path !== "string" || !path.includes("heartbeats")) return;
          if (!orbitorView) return;
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => loadOrbitorTail(activeOrbitor), 1000);
        });
        if (disposed) fn(); else unlisten = fn;
      } catch {}
    })();
    return () => { disposed = true; if (unlisten) unlisten(); if (timer) clearTimeout(timer); };
  });

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

  // svelte 5: derived values computed inline in template
</script>

<div class="viewer">
  <div class="sidebar">
    <div class="brand"><img src="/shield.png" alt="SafeDesk" /><span>svelte/5</span></div>
    <div class="section-label">STYLE</div>
    <div class="style-dropdowns">
      <label class="dropdown-label">Framework</label>
      <select class="dropdown" value={activeStyle} onchange={(e) => switchStyle(e.target.value)}>
        {#each STYLES as s}<option value={s}>{s}</option>{/each}
      </select>
      <label class="dropdown-label">Theme</label>
      <select class="dropdown" value={activeTheme} onchange={(e) => switchTheme(e.target.value)}>
        {#each (THEMES[activeStyle] ?? ["default"]) as t}<option value={t}>{t}</option>{/each}
      </select>
    </div>

    <div style="display:flex;align-items:center;gap:8px;margin-top:16px">
      <button class="section-label" style="margin-top:0;background:none;border:none;padding:0;cursor:pointer;text-align:left;flex:1;text-decoration:{orbitorView ? 'none' : 'underline'}" onclick={() => showOrbitors(activeOrbitor)}>ORBITORS</button>
      <button style="font-size:10px;font-weight:600;padding:1px 8px;border-radius:3px;border:1px solid var(--sd-border, #d1d5db);background:var(--sd-surface-base, #fff);color:var(--sd-text, #1a1a1a);cursor:pointer" onclick={() => wakeOrbitor(null)}>Wake All</button>
    </div>
    <select class="dropdown" value={orbitorView ? (activeOrbitor ?? "All") : "All"} onchange={(e) => showOrbitors(e.target.value === "All" ? null : e.target.value)}>
      <option value="All">All</option>
      {#each ORBITOR_NAMES as n}<option value={n}>{n}</option>{/each}
    </select>

    <div class="section-label" style="margin-top:16px">PROOFS</div>
    <select class="dropdown" value={activeProof && activeProof !== "__none__" ? activeProof : "All"} onchange={(e) => showProofs(e.target.value === "All" ? null : e.target.value)}>
      <option value="All">All</option>
      {#each PROOF_DOMAINS as d}<option value={d.label}>{d.label}</option>{/each}
    </select>

    <div class="section-label" style="margin-top:16px">TICKETS</div>
    <button class="comp-btn" class:active={ticketView === "open"} onclick={() => showTickets("open")}>
      Open {tickets.filter(t => t.status === "open" || t.status === "in-progress").length > 0 ? `(${tickets.filter(t => t.status === "open" || t.status === "in-progress").length})` : ""}
    </button>
    <button class="comp-btn" class:active={ticketView === "closed"} onclick={() => showTickets("closed")}>
      Closed {tickets.filter(t => t.status === "closed" || t.status === "proved").length > 0 ? `(${tickets.filter(t => t.status === "closed" || t.status === "proved").length})` : ""}
    </button>

    <div style="display:flex;flex-direction:column;gap:6px;padding:0 2px;margin-top:16px">
      <div>
        <button class="dropdown-label" style="background:none;border:none;padding:0;cursor:pointer;text-align:left;width:100%;text-decoration:{(!proofView && !ticketView && !orbitorView) ? 'none' : 'underline'}" onclick={() => activeComponent && (activeVariation ? selectVariation(activeComponent, activeVariation) : selectComponent(activeComponent))}>Component</button>
        <select class="dropdown" value={activeComponent} onchange={(e) => selectComponent(e.target.value)}>
          {#each componentNames as n}<option value={n}>{n}</option>{/each}
        </select>
      </div>
      <div>
        <label class="dropdown-label">Variation</label>
        <select class="dropdown" value={activeVariation} onchange={(e) => selectVariation(activeComponent, e.target.value)} disabled={!activeComponent}>
          {#if activeComponent}
            {#each Object.keys(SAMPLES[activeComponent]).sort() as v}<option value={v}>{v}</option>{/each}
          {/if}
        </select>
      </div>
    </div>
  </div>
  <div class="main">
    <h3>svelte/5 — {activeStyle}{#if activeTheme !== "default"}/{activeTheme}{/if}{#if orbitorView}<span class="active-comp"> — orbitors{activeOrbitor ? ` / ${activeOrbitor}` : " / all"}</span>{:else if proofView}<span class="active-comp"> — proofs{activeProof ? ` / ${activeProof}` : ""}</span>{:else if ticketView}<span class="active-comp"> — tickets/{ticketView}</span>{:else if activeComponent}<span class="active-comp"> — {activeVariation ?? activeComponent}</span>{/if}</h3>

    {#if orbitorView}
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          {#if orbitorTail}<span style="font-size:11px;color:var(--sd-text-muted, #6b7280)">live — as of {fmtEst(orbitorTail.ts)} ET</span>{/if}
        </div>
        <div style="display:grid;grid-template-columns:{activeOrbitor ? '1fr' : 'repeat(3, 1fr)'};grid-template-rows:{activeOrbitor ? 'auto' : 'repeat(8, 1fr)'};gap:12px;height:{activeOrbitor ? 'auto' : 'calc(100vh - 140px)'}">
          {#each (activeOrbitor ? (orbitorTail?.entries ?? []) : [...(orbitorTail?.entries ?? [])].concat(Array(Math.max(0, 24 - (orbitorTail?.entries?.length ?? 0))).fill(null))) as entry, idx (entry ? entry.goal_id : `empty-${idx}`)}
            {#if !entry}
              <div style="border:1px dashed var(--sd-border,#e5e7eb);border-radius:6px;opacity:0.4"></div>
            {:else}
              {@const name = entry.category ?? entry.goal_id.replace(/^goal-/, "")}
              {@const dot = entry.liveness === "alive" ? "var(--sd-success, #15803d)" : entry.liveness === "stale" ? "var(--sd-warn, #d97706)" : "var(--sd-text-muted, #9ca3af)"}
              <div style="border:1px solid var(--sd-border, #e5e7eb);border-radius:6px;overflow:hidden;display:flex;flex-direction:column;min-height:0">
                <div style="padding:8px 12px;display:flex;align-items:center;gap:8px;background:var(--sd-surface-raised, #fafafa);border-bottom:1px solid var(--sd-border, #e5e7eb)">
                  <span class:blink={entry.liveness === "alive"} style="width:8px;height:8px;border-radius:50%;background:{dot};display:inline-block"></span>
                  <span style="font-size:12px;font-weight:700">{name}</span>
                  <button style="margin-left:auto;font-size:10px;font-weight:600;padding:1px 8px;border-radius:3px;border:1px solid var(--sd-border, #d1d5db);background:var(--sd-surface-base, #fff);color:var(--sd-text, #1a1a1a);cursor:pointer" onclick={() => wakeOrbitor(entry.goal_id)}>Wake</button>
                </div>
                <div use:scrollBottom={entry.lines} style="padding:8px 12px;font-family:monospace;font-size:10px;line-height:1.6;flex:1;overflow:auto;min-height:0">
                  {#if entry.lines.length === 0}<div style="color:var(--sd-text-muted, #9ca3af)">no data</div>{/if}
                  {#each entry.lines as l}
                    <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                      <span style="color:var(--sd-text-muted, #9ca3af)">{fmtEst(l.ts)} </span>
                      <span style="color:{l.verdict === 'GREEN' ? 'var(--sd-success, #15803d)' : 'var(--sd-danger, #dc2626)'}" title={l.output}>{l.output}</span>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {:else if proofView}
      <div style="display:flex;flex-direction:column;gap:16px">
        <div style="display:flex;align-items:center;gap:12px">
          <button class="btn-prove" style="padding:6px 16px;font-size:13px;font-weight:600;border-radius:4px;cursor:{proofRunning?'wait':'pointer'};background:{proofRunning?'var(--sd-text-muted,#6b7280)':'var(--sd-accent,#2563eb)'}" disabled={proofRunning}
            onclick={() => runProofs(activeProof ? (PROOF_DOMAINS.find(d => d.label === activeProof)?.commands ?? []) : ALL_PROVE_COMMANDS)}>
            {proofRunning ? `⟳ Running${proofProgress ? ` ${proofProgress.done}/${proofProgress.total}` : "..."}` : `▶ ${activeProof ? `Run ${activeProof}` : "Run All"}`}
          </button>
          {#if (() => { const cmds = activeProof ? (PROOF_DOMAINS.find(d => d.label === activeProof)?.commands ?? []) : ALL_PROVE_COMMANDS; const t = cmds.reduce((s,c) => s+(proofResults[c]?.total??0),0); const p = cmds.reduce((s,c) => s+(proofResults[c]?.passed??0),0); const f = cmds.reduce((s,c) => s+(proofResults[c]?.failed??0),0); return t > 0 ? {t,p,f} : null; })() !== null}
            {@const summary = (() => { const cmds = activeProof ? (PROOF_DOMAINS.find(d => d.label === activeProof)?.commands ?? []) : ALL_PROVE_COMMANDS; const t = cmds.reduce((s,c) => s+(proofResults[c]?.total??0),0); const p = cmds.reduce((s,c) => s+(proofResults[c]?.passed??0),0); const f = cmds.reduce((s,c) => s+(proofResults[c]?.failed??0),0); return {t,p,f}; })()}
            <span style="font-size:13px;font-weight:600;color:{summary.f===0?'var(--sd-success,#15803d)':'var(--sd-danger,#dc2626)'}">{summary.p}/{summary.t} {summary.f===0?'PASS':`(${summary.f} failed)`}</span>
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
      {#if activeComponent && activeVariation && SAMPLES[activeComponent]?.[activeVariation]}
        <!-- Component card — the live E mount -->
        <div class="component-card" style="margin-bottom:4px">
          <div class="component-label" style="display:flex;align-items:center">
            <span>{activeVariation}</span>
            {#if craveResult}
              <span style="margin-left:auto;font-size:10px;font-weight:600;color:{craveVerdictColor(craveResult.verdict)}">
                CRAVE {craveResult.verdict} — {craveResult.renderMs}ms — {fmtEst(craveResult.ts)} ET
              </span>
            {/if}
          </div>
          <div style="padding:16px">
            <div bind:this={craveMount}></div>
          </div>
          <div class="ticket-create">
            <select class="ticket-type-select" id={`ticket-type-${activeComponent}`}>
              <option value="bug">bug</option><option value="event">event</option><option value="paint">paint</option>
              <option value="style">style</option><option value="data">data</option><option value="structure">structure</option>
              <option value="variation">variation</option><option value="new-component">new-component</option>
            </select>
            <input class="ticket-title-input" id={`ticket-title-${activeComponent}`} placeholder="Describe the issue..." />
            <button class="btn-prove" onclick={() => {
              const titleEl = document.getElementById(`ticket-title-${activeComponent}`);
              const typeEl = document.getElementById(`ticket-type-${activeComponent}`);
              handleCreateTicket(activeComponent, typeEl, titleEl);
            }}>+ Ticket</button>
          </div>
        </div>

        <!-- Five-station strip -->
        <div style="display:grid;grid-template-columns:repeat(5, 1fr);gap:10px;height:38vh;margin-top:4px">
          <!-- C — Config -->
          <div class="crave-card">
            <div class="crave-head">
              <span>C — Config</span>
              <span style="margin-left:auto;font-weight:400;text-transform:none">
                {#if configErr}<span style="color:var(--sd-danger, #dc2626)">{configErr}</span>{:else}editable{/if}
              </span>
            </div>
            <textarea
              class="crave-body"
              value={configText}
              oninput={(e) => applyConfigText(e.target.value)}
              spellcheck="false"
              style="border:none;outline:none;resize:none;background:var(--sd-surface-base, #fff);color:var(--sd-text, #1a1a1a);width:100%"
            ></textarea>
          </div>

          <!-- R — Render -->
          <div class="crave-card">
            <div class="crave-head">
              <span>R — Render</span>
              <span style="margin-left:auto;font-weight:400;text-transform:none">{treeCount(craveResult?.actual ?? null)} nodes — {craveResult?.renderMs ?? 0}ms</span>
            </div>
            <div class="crave-body">{treeLines(craveResult?.actual ?? null).join("\n") || "no output"}</div>
          </div>

          <!-- A — Assert -->
          <div class="crave-card">
            <div class="crave-head">
              <span>A — Assert</span>
              <span style="margin-left:auto;font-weight:400;text-transform:none">{treeCount(craveResult?.expected ?? null)} nodes expected</span>
            </div>
            <div class="crave-body">{treeLines(craveResult?.expected ?? null).join("\n") || "no expectation"}</div>
          </div>

          <!-- V — Verify -->
          <div class="crave-card">
            <div class="crave-head">
              <span>V — Verify</span>
              <span style="margin-left:auto;font-weight:700;text-transform:none;color:{craveVerdictColor(craveResult?.verdict)}">{craveResult?.verdict ?? "—"}</span>
            </div>
            <div class="crave-body">
              {#if craveResult?.error}
                <div style="color:var(--sd-danger, #dc2626)">{craveResult.error}</div>
              {/if}
              {#if craveResult && !craveResult.error && craveResult.mismatches.length === 0}
                <div style="color:var(--sd-success, #15803d)">{"diffRenderedTrees: 0 mismatches\nexpected ≡ actual"}</div>
              {/if}
              {#each craveResult?.mismatches ?? [] as m}
                <div style="color:var(--sd-danger, #dc2626);margin-bottom:4px">{`${m.path}\n  expected: ${String(m.expected)}\n  actual:   ${String(m.actual)}`}</div>
              {/each}
            </div>
          </div>

          <!-- E — Execute -->
          <div class="crave-card">
            <div class="crave-head">
              <span>E — Execute</span>
              <span style="margin-left:auto;font-weight:400;text-transform:none">{craveEvents.length} events</span>
            </div>
            <div class="crave-body" use:scrollBottom={craveEvents}>
              {#if craveEvents.length === 0}<span style="color:var(--sd-text-muted, #9ca3af)">interact with the component above…</span>{/if}
              {#each craveEvents as ev}
                <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                  <span style="color:var(--sd-text-muted, #9ca3af)">{fmtEst(ev.ts)} </span>
                  <span style="color:var(--sd-accent, #2563eb)">{ev.origin}</span>
                  <span>{` ${ev.name}`}</span>
                  {#if ev.detail}<span style="color:var(--sd-text-muted, #6b7280)">{` ${ev.detail}`}</span>{/if}
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}
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
  @keyframes orbitor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
  .blink { animation: orbitor-blink 1.5s ease-in-out infinite; }
  .crave-card { border: 1px solid var(--sd-border, #e5e7eb); border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; min-height: 0; }
  .crave-head { padding: 6px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sd-text-muted, #6b7280); border-bottom: 1px solid var(--sd-border, #e5e7eb); background: var(--sd-surface-raised, #fafafa); display: flex; align-items: center; gap: 6px; }
  .crave-body { padding: 8px 10px; font-family: monospace; font-size: 9.5px; line-height: 1.55; flex: 1; overflow: auto; min-height: 0; white-space: pre; }
</style>
