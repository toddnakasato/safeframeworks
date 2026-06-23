<script setup lang="ts">
/**
 * Viewer App (vue/2) — renders all components/variations with style switching.
 * Full feature parity with react/19 viewer: Style/Theme picklists, Proofs sidebar,
 * Tickets sidebar, Components sidebar with variations, EPRPP paint state, mutual exclusion.
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { SAMPLES } from '../../../../samples';
import { createSafeProofViewer } from '../../../../dev/proof-viewer';
import type { SafeEvent, ConfigBase, TicketType, Ticket } from 'safecontracts';
import { listAllTickets, createTicket, updateTicket } from './ticket-service';
import SafeLayout from '../../SafeLayout.vue';
import SafeColumns from '../../SafeColumns.vue';
import SafeCard from '../../SafeCard.vue';
import SafeButton from '../../SafeButton.vue';
import SafeTable from '../../SafeTable.vue';
import SafeTree from '../../SafeTree.vue';
import SafeSheet from '../../SafeSheet.vue';
import SafeChart from '../../SafeChart.vue';
import SafeHeatmap from '../../SafeHeatmap.vue';
import SafeGauge from '../../SafeGauge.vue';
import SafeFunnel from '../../SafeFunnel.vue';
import SafeFlow from '../../SafeFlow.vue';
import SafeHierarchy from '../../SafeHierarchy.vue';
import SafeTimeline from '../../SafeTimeline.vue';
import SafeMap from '../../SafeMap.vue';
import SafeCalendar from '../../SafeCalendar.vue';
import SafeToggle from '../../SafeToggle.vue';
import SafeWeek from '../../SafeWeek.vue';
import SafeChat from '../../SafeChat.vue';
import SafeTabs from '../../SafeTabs.vue';
import SafeCallout from '../../SafeCallout.vue';
import SafeDragDrop from '../../SafeDragDrop.vue';
import SafeGrid from '../../SafeGrid.vue';
import SafeInput from '../../SafeInput.vue';
import SafeList from '../../SafeList.vue';
import SafePicker from '../../SafePicker.vue';
import SafeNav from '../../SafeNav.vue';
import SafeParser from '../../SafeParser.vue';
import SafePlan from '../../SafePlan.vue';
import SafeSkillUp from '../../SafeSkillUp.vue';
import SafeDispatch from '../../SafeDispatch.vue';
import SafeBriefing from '../../SafeBriefing.vue';

const comps: Record<string, any> = {
  layout: SafeLayout, columns: SafeColumns, card: SafeCard, button: SafeButton,
  table: SafeTable, tree: SafeTree, sheet: SafeSheet, chart: SafeChart,
  heatmap: SafeHeatmap, gauge: SafeGauge, funnel: SafeFunnel, flow: SafeFlow,
  hierarchy: SafeHierarchy, timeline: SafeTimeline, map: SafeMap, calendar: SafeCalendar,
  toggle: SafeToggle, week: SafeWeek, chat: SafeChat, tabs: SafeTabs,
  callout: SafeCallout, 'drag-drop': SafeDragDrop, grid: SafeGrid, input: SafeInput,
  list: SafeList, picker: SafePicker, nav: SafeNav, parser: SafeParser,
  plan: SafePlan, skillup: SafeSkillUp, dispatch: SafeDispatch, briefing: SafeBriefing,
};

/** Tauri invoke — safe no-op when not in Tauri context */
async function invoke<T>(cmd: string, args?: Record<string, any>): Promise<T> {
  const { invoke: tauriInvoke } = await import('@tauri-apps/api/core');
  return tauriInvoke<T>(cmd, args);
}

/** Listen for Tauri events */
async function listen(event: string, handler: (payload: any) => void): Promise<() => void> {
  const { listen: tauriListen } = await import('@tauri-apps/api/event');
  const unlisten = await tauriListen(event, (e: any) => handler(e.payload));
  return unlisten;
}

const STATE_DIR = 'runtime';
const STATE_FILE = 'runtime/state.json';

const STYLES = ['vanilla', 'tailwind', 'tailwind-daisy', 'material'] as const;
const COMPONENT_NAMES = Object.keys(SAMPLES).sort();

// Themes per implementation — discovered from safestyles at build time
const THEME_FILES = import.meta.glob('../public/styles/*/themes/*.css', { query: '?url' });
const THEMES: Record<string, string[]> = {};
for (const path of Object.keys(THEME_FILES)) {
  const m = path.match(/styles\/([^/]+)\/themes\/([^/]+)\.css$/);
  if (!m) continue;
  (THEMES[m[1]] ??= []).push(m[2]);
}
for (const k of Object.keys(THEMES)) THEMES[k].sort((a, b) => a === 'default' ? -1 : b === 'default' ? 1 : a.localeCompare(b));

/** Load a safestyles implementation + theme dynamically. */
function loadStyle(name: string, theme: string) {
  document.getElementById('safestyle-link')?.remove();
  document.getElementById('safestyle-paint')?.remove();
  document.getElementById('safestyle-theme')?.remove();
  const link = document.createElement('link');
  link.id = 'safestyle-link';
  link.rel = 'stylesheet';
  link.href = `/styles/${name}/components.css`;
  document.head.appendChild(link);
  const paintLink = document.createElement('link');
  paintLink.id = 'safestyle-paint';
  paintLink.rel = 'stylesheet';
  paintLink.href = `/styles/${name}/paint.css`;
  document.head.appendChild(paintLink);
  const themeLink = document.createElement('link');
  themeLink.id = 'safestyle-theme';
  themeLink.rel = 'stylesheet';
  themeLink.href = `/styles/${name}/themes/${theme}.css`;
  document.head.appendChild(themeLink);
}

// --- State ---
const activeStyle = ref<string>('vanilla');
const activeTheme = ref<string>('default');
const activeComponent = ref<string | null>(null);
const activeVariation = ref<string | null>(null);
const paintState = ref<Record<string, any>>({});
const activeProof = ref<string | null>(null);
const proofResults = ref<Record<string, { passed: number; total: number; failed: number; checks?: any[]; failures?: any[] }>>({});
const proofRunning = ref(false);
const proofView = ref(false);
const proofToast = ref<{ message: string; color: string } | null>(null);
const runningCommands = ref<Set<string>>(new Set());
const proofProgress = ref<{ done: number; total: number } | null>(null);
const tickets = ref<Ticket[]>([]);
const ticketView = ref<'open' | 'closed' | null>(null);

const PROOF_DOMAINS: { label: string; commands: string[] }[] = [
  { label: 'builder', commands: ['builder-dumb', 'builder-reconcile', 'builder-structure'] },
  { label: 'event', commands: ['event-coverage', 'event-declared', 'event-payload'] },
  { label: 'framework', commands: ['framework-boot', 'framework-delegation'] },
  { label: 'paint', commands: ['paint-chain', 'paint-contrast', 'paint-cssonly', 'paint-definition', 'paint-parity', 'paint-unopinionated'] },
  { label: 'ticket', commands: ['ticket'] },
];
const ALL_PROVE_COMMANDS = PROOF_DOMAINS.flatMap(d => d.commands);

// Watch style/theme and load CSS
watch([activeStyle, activeTheme], ([s, t]) => loadStyle(s, t), { immediate: true });

// Load tickets on mount
function refreshTickets() {
  listAllTickets().then(t => { console.log('[tickets] loaded', t.length); tickets.value = t; }).catch(e => console.error('[tickets] load failed', e));
}
onMounted(() => refreshTickets());

// EPRPP: start file watcher + listen for changes
let unlistenFn: (() => void) | null = null;
onMounted(() => {
  invoke('write_state', { path: STATE_FILE, content: JSON.stringify(paintState.value) }).catch(() => {});
  invoke('watch_dir', { path: STATE_DIR }).catch(() => {});
  listen('fs-change', async (_path: string) => {
    try {
      const raw = await invoke<string>('read_file_content', { path: STATE_FILE });
      paintState.value = JSON.parse(raw);
    } catch {}
  }).then(fn => { unlistenFn = fn; });
});
onUnmounted(() => { if (unlistenFn) unlistenFn(); });

// --- Actions ---
function selectStyle(s: string) {
  activeStyle.value = s;
  activeTheme.value = 'default';
}

function selectComponent(name: string | null) {
  activeComponent.value = name;
  activeVariation.value = null;
  proofView.value = false;
  activeProof.value = '__none__';
  ticketView.value = null;
}

function selectVariation(comp: string, variation: string) {
  activeComponent.value = comp;
  activeVariation.value = variation;
  proofView.value = false;
  activeProof.value = '__none__';
  ticketView.value = null;
}

function selectProof(label: string | null) {
  activeProof.value = label;
  proofView.value = true;
  ticketView.value = null;
}

function selectTicketView(view: 'open' | 'closed') {
  ticketView.value = view;
  proofView.value = false;
  activeProof.value = '__none__';
}

/** Merge paint state into a ConfigBase's metadata */
function paintConfig(config: ConfigBase): ConfigBase {
  if (!paintState.value || Object.keys(paintState.value).length === 0) return config;
  return { ...config, metadata: { ...config.metadata, ...paintState.value } };
}

// EPRPP: event → safedesk paint apply → writes state.json → watcher fires → re-render
function handleEvent(event: SafeEvent) {
  console.log('[event]', event.origin?.id, event.name, event.data);
  document.querySelectorAll('[data-component="proof-viewer"]').forEach((pv: any) => {
    if (pv.pushEvent) pv.pushEvent(event);
  });
  const cssOnlyEvents = new Set(['row:hover', 'row:leave', 'hover']);
  if (cssOnlyEvents.has(event.name)) return;
  const component = event.component ?? '';
  const args = ['paint', 'apply', '--component', component, '--event', event.name, '--state', STATE_FILE];
  if (event.data?.index !== undefined) args.push('--index', String(event.data.index));
  if (event.data?.field) args.push('--field', String(event.data.field));
  if (event.data?.dir) args.push('--dir', String(event.data.dir));
  if (event.data?.page !== undefined) args.push('--page', String(event.data.page));
  if (event.data?.selected) args.push('--selected', String(event.data.selected));
  if (event.data?.value !== undefined) args.push('--value', String(event.data.value));
  if (event.data?.year !== undefined) args.push('--year', String(event.data.year));
  if (event.data?.month !== undefined) args.push('--month', String(event.data.month));
  if (event.data?.day !== undefined) args.push('--day', String(event.data.day));
  if (event.data?.date) args.push('--date', String(event.data.date));
  invoke<string>('safecli_run', { name: 'safedesk', args }).catch(e => console.warn('[paint]', e));
}

async function runProofs(commands: string[]) {
  proofRunning.value = true;
  proofProgress.value = { done: 0, total: commands.length };
  // Clear previous results for these commands
  const next = { ...proofResults.value };
  commands.forEach(c => delete next[c]);
  proofResults.value = next;
  runningCommands.value = new Set(commands);
  let doneCount = 0;
  try {
    const results = await Promise.all(
      commands.map(async cmd => {
        try {
          const { invoke: tauriInvoke } = await import('@tauri-apps/api/core');
          const out = await tauriInvoke<string>('safecli_run', { name: 'safedesk', args: ['prove', cmd] });
          const parsed = JSON.parse(out);
          const entry = { passed: parsed.passed ?? 0, total: parsed.total ?? 0, failed: parsed.failed ?? 0, checks: parsed.checks, failures: parsed.failures };
          proofResults.value = { ...proofResults.value, [cmd]: entry };
          const rc = new Set(runningCommands.value); rc.delete(cmd); runningCommands.value = rc;
          doneCount++;
          proofProgress.value = { done: doneCount, total: commands.length };
          return [cmd, entry] as [string, any];
        } catch {
          const entry = { passed: 0, total: 0, failed: -1 };
          proofResults.value = { ...proofResults.value, [cmd]: entry };
          const rc = new Set(runningCommands.value); rc.delete(cmd); runningCommands.value = rc;
          doneCount++;
          proofProgress.value = { done: doneCount, total: commands.length };
          return [cmd, entry] as [string, any];
        }
      })
    );
    const totalP = results.reduce((s, [, v]) => s + (v.passed ?? 0), 0);
    const totalT = results.reduce((s, [, v]) => s + (v.total ?? 0), 0);
    const totalF = results.reduce((s, [, v]) => s + (v.failed ?? 0), 0);
    const pass = totalF === 0;
    proofToast.value = { message: `${totalP}/${totalT} checks ${pass ? 'passed PASS' : `— ${totalF} failed FAIL`}`, color: pass ? 'var(--sd-success, #15803d)' : 'var(--sd-danger, #dc2626)' };
    setTimeout(() => { proofToast.value = null; }, 4000);
  } finally {
    proofRunning.value = false;
    runningCommands.value = new Set();
    proofProgress.value = null;
  }
}

async function proveTicket(t: Ticket) {
  const btn = document.getElementById(`prove-${t.id}`) as HTMLButtonElement;
  const result = document.getElementById(`prove-result-${t.id}`)!;
  btn.textContent = '⟳ Proving...'; btn.disabled = true;
  result.textContent = '';
  try {
    if (t.test) {
      const { invoke: tauriInvoke } = await import('@tauri-apps/api/core');
      const parseCmd = (cmd: string): string[] => {
        const args: string[] = [];
        let current = '';
        let inQuote = false;
        let quoteChar = '';
        for (const ch of cmd) {
          if (!inQuote && (ch === '"' || ch === "'")) { inQuote = true; quoteChar = ch; continue; }
          if (inQuote && ch === quoteChar) { inQuote = false; continue; }
          if (!inQuote && ch === ' ') { if (current) args.push(current); current = ''; continue; }
          current += ch;
        }
        if (current) args.push(current);
        return args;
      };
      const out = await tauriInvoke<string>('safecli_run', { name: 'safedesk', args: parseCmd(t.test.command) });
      const output = JSON.parse(out);
      const failures: string[] = [];
      for (const [path, expected] of Object.entries(t.test.assert)) {
        const actual = path.split('.').reduce((o: any, k) => o?.[k], output);
        if (actual !== expected) failures.push(`${path}: ${JSON.stringify(actual)} ≠ ${JSON.stringify(expected)}`);
      }
      const pass = failures.length === 0;
      const total = Object.keys(t.test.assert).length;
      result.textContent = pass ? `${total}/${total} PASS` : `${total - failures.length}/${total} FAIL ${failures[0]}`;
      result.style.color = pass ? 'var(--sd-success, #15803d)' : 'var(--sd-danger, #dc2626)';
    } else {
      result.textContent = 'no test defined';
      result.style.color = 'var(--sd-text-muted, #475569)';
    }
    btn.textContent = 'Prove'; btn.disabled = false;
  } catch (e: any) {
    result.textContent = `error: ${e.message?.slice(0, 60) ?? e}`;
    result.style.color = 'var(--sd-danger, #dc2626)';
    btn.textContent = 'Prove'; btn.disabled = false;
  }
}

async function startTicket(t: Ticket) {
  await updateTicket({ ...t, status: 'in-progress' });
  refreshTickets();
}

async function closeTicket(t: Ticket) {
  await updateTicket({ ...t, status: 'closed', resolution: 'Closed without resolution' });
  refreshTickets();
}

async function submitTicket(comp: string) {
  const titleEl = document.getElementById(`ticket-title-${comp}`) as HTMLInputElement;
  const typeEl = document.getElementById(`ticket-type-${comp}`) as HTMLSelectElement;
  if (!titleEl?.value.trim()) return;
  await createTicket(comp, typeEl.value as TicketType, titleEl.value.trim(), titleEl.value.trim());
  titleEl.value = '';
  refreshTickets();
}

// Computed: [component, variation] pairs to render
const toShow = computed<[string, string][]>(() => {
  const result: [string, string][] = [];
  for (const comp of activeComponent.value ? [activeComponent.value] : COMPONENT_NAMES) {
    const variations = Object.keys(SAMPLES[comp] ?? {}).sort();
    for (const v of activeVariation.value ? [activeVariation.value] : variations) {
      if (SAMPLES[comp]?.[v]) result.push([comp, v]);
    }
  }
  return result;
});

// Filtered tickets
const openTickets = computed(() => tickets.value.filter(t => t.status === 'open' || t.status === 'in-progress'));
const closedTickets = computed(() => tickets.value.filter(t => t.status === 'closed' || t.status === 'proved').sort((a, b) => b.updated.localeCompare(a.updated)));
const filteredTickets = computed(() => ticketView.value === 'open' ? openTickets.value : closedTickets.value);

// Proof summary for active domain
function domainSummary(commands: string[]) {
  const t = commands.reduce((s, c) => s + (proofResults.value[c]?.total ?? 0), 0);
  const p = commands.reduce((s, c) => s + (proofResults.value[c]?.passed ?? 0), 0);
  const f = commands.reduce((s, c) => s + (proofResults.value[c]?.failed ?? 0), 0);
  return { total: t, passed: p, failed: f };
}

const activeDomainCommands = computed(() => {
  if (activeProof.value && activeProof.value !== '__none__') {
    return PROOF_DOMAINS.find(d => d.label === activeProof.value)?.commands ?? [];
  }
  return ALL_PROVE_COMMANDS;
});

const activeSummary = computed(() => domainSummary(activeDomainCommands.value));

const visibleDomains = computed(() => {
  if (activeProof.value && activeProof.value !== '__none__') {
    return PROOF_DOMAINS.filter(d => d.label === activeProof.value);
  }
  return PROOF_DOMAINS;
});

// Header subtitle
const headerSubtitle = computed(() => {
  if (proofView.value) return ` — proofs${activeProof.value && activeProof.value !== '__none__' ? ` / ${activeProof.value}` : ''}`;
  if (ticketView.value) return ` — tickets / ${ticketView.value}`;
  if (activeComponent.value) return ` — ${activeVariation.value ?? activeComponent.value}`;
  return '';
});

function mountProof(el: any, comp: string) {
  if (!el || el.dataset.mounted === comp) return;
  el.innerHTML = '';
  el.dataset.mounted = comp;
  el.style.borderTop = '1px solid var(--sd-border, #e5e7eb)';
  createSafeProofViewer(el, { component: 'proof-viewer', metadata: { target: comp } }, handleEvent);
}

function groupChecks(checks: any[]): { group: string; total: number; passed: number }[] {
  const groups = [...new Set(checks.map((c: any) => c.group))];
  return groups.map(group => {
    const gc = checks.filter((c: any) => c.group === group);
    return { group, total: gc.length, passed: gc.filter((c: any) => c.status === 'pass').length };
  });
}
</script>

<template>
  <div class="viewer">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Brand -->
      <div class="brand">
        <img src="/shield.png" alt="SafeDesk" />
        <span>vue/2</span>
      </div>

      <!-- Style/Theme switcher -->
      <div class="style-section">
        <div>
          <label class="label-text">Framework</label>
          <select :value="activeStyle" @change="selectStyle($event.target.value)" class="dropdown">
            <option v-for="s in STYLES" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div>
          <label class="label-text">Theme</label>
          <select :value="activeTheme" @change="activeTheme = $event.target.value" class="dropdown">
            <option v-for="t in (THEMES[activeStyle] ?? ['default'])" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>

      <!-- Proofs -->
      <div class="proofs-section">
        <div class="section-label">Proofs</div>
        <button
          class="sidebar-btn"
          :class="{ active: activeProof === null && proofView }"
          @click="selectProof(null)"
        >All</button>
        <button
          v-for="d in PROOF_DOMAINS" :key="d.label"
          class="sidebar-btn"
          :class="{ active: activeProof === d.label && proofView }"
          @click="selectProof(d.label)"
        >{{ d.label }}</button>
      </div>

      <!-- Scrollable: Tickets + Components -->
      <div class="scroll-area">
        <!-- Tickets -->
        <div class="section-label" style="margin-top: 4px">Tickets</div>
        <button
          class="sidebar-btn"
          :class="{ active: ticketView === 'open' && !proofView }"
          @click="selectTicketView('open')"
        >Open{{ openTickets.length > 0 ? ` (${openTickets.length})` : '' }}</button>
        <button
          class="sidebar-btn"
          :class="{ active: ticketView === 'closed' && !proofView }"
          @click="selectTicketView('closed')"
        >Closed{{ closedTickets.length > 0 ? ` (${closedTickets.length})` : '' }}</button>

        <!-- Components -->
        <div class="section-label" style="margin-top: 12px">Components</div>
        <button class="sidebar-btn" :class="{ active: activeComponent === null && !proofView && !ticketView }" @click="selectComponent(null)">All</button>
        <template v-for="name in COMPONENT_NAMES">
          <button :key="name" class="sidebar-btn" :class="{ active: name === activeComponent && !activeVariation && !proofView && !ticketView }" @click="selectComponent(name)">{{ name }}</button>
          <template v-if="name === activeComponent">
            <button
              v-for="v in Object.keys(SAMPLES[name]).sort()" :key="v"
              class="sidebar-btn var-btn"
              :class="{ active: v === activeVariation }"
              @click="selectVariation(name, v)"
            >{{ v }}</button>
          </template>
        </template>
      </div>
    </div>

    <!-- Main area -->
    <div class="main">
      <div class="header-title">
        vue/2 — {{ activeStyle }}{{ activeTheme !== 'default' ? `/${activeTheme}` : '' }}
        <span v-if="headerSubtitle" class="header-subtitle">{{ headerSubtitle }}</span>
      </div>

      <!-- Ticket view -->
      <div v-if="ticketView" class="content-column">
        <div v-if="filteredTickets.length === 0" class="empty-text">No {{ ticketView }} tickets.</div>
        <div v-for="t in filteredTickets" :key="t.id" class="ticket-card">
          <div class="ticket-header">
            <div>
              <span class="ticket-id">{{ t.id }}</span>
              <span class="ticket-type">{{ t.type }}</span>
            </div>
            <span class="ticket-status" :style="{ color: t.status === 'open' ? 'var(--sd-accent, #2563eb)' : t.status === 'closed' ? 'var(--sd-success, #15803d)' : 'var(--sd-text-muted, #475569)' }">{{ t.status }}</span>
          </div>
          <div class="ticket-body">
            <div class="ticket-title">{{ t.title }}</div>
            <div class="ticket-desc">{{ t.description }}</div>
          </div>
          <div class="ticket-meta">
            <span>proves: {{ t.proves.join(', ') }}</span>
            <span v-if="t.params">scope: {{ Object.entries(t.params).map(([k,v]) => `${k}=${v}`).join(' ') }}</span>
            <span v-if="t.event && !t.params?.event">event: {{ t.event }}</span>
            <span v-if="t.resolution">resolution: {{ t.resolution }}</span>
          </div>
          <div class="ticket-actions">
            <button :id="`prove-${t.id}`" class="btn-prove" @click="proveTicket(t)">Prove</button>
            <span :id="`prove-result-${t.id}`" class="prove-result"></span>
            <template v-if="t.status === 'open'">
              <button class="btn-action" @click="startTicket(t)">Start</button>
              <button class="btn-action" @click="closeTicket(t)">Close</button>
            </template>
          </div>
        </div>
      </div>

      <!-- Proof view -->
      <div v-else-if="proofView" class="content-column">
        <div class="proof-controls">
          <button
            class="btn-run"
            :disabled="proofRunning"
            :style="{ background: proofRunning ? 'var(--sd-text-muted, #6b7280)' : 'var(--sd-accent, #2563eb)', cursor: proofRunning ? 'wait' : 'pointer' }"
            @click="runProofs(activeDomainCommands)"
          >
            {{ proofRunning ? '⟳' : '▶' }}
            {{ proofRunning ? `Running${proofProgress ? ` ${proofProgress.done}/${proofProgress.total}` : '...'}` : (activeProof && activeProof !== '__none__') ? `Run ${activeProof}` : 'Run All' }}
          </button>
          <span v-if="activeSummary.total > 0" class="proof-summary" :style="{ color: activeSummary.failed === 0 ? 'var(--sd-success, #15803d)' : 'var(--sd-danger, #dc2626)' }">
            {{ activeSummary.passed }}/{{ activeSummary.total }} {{ activeSummary.failed === 0 ? 'PASS' : `(${activeSummary.failed} failed)` }}
          </span>
        </div>

        <div v-for="domain in visibleDomains" :key="domain.label">
          <div class="domain-header">
            <span class="domain-label">{{ domain.label }}</span>
            <button v-if="!activeProof || activeProof === '__none__'" class="btn-domain-run" :disabled="proofRunning" @click="runProofs(domain.commands)">Run</button>
            <span v-if="domainSummary(domain.commands).total > 0" class="domain-summary" :style="{ color: domainSummary(domain.commands).passed === domainSummary(domain.commands).total ? 'var(--sd-success, #15803d)' : 'var(--sd-danger, #dc2626)' }">
              {{ domainSummary(domain.commands).passed }}/{{ domainSummary(domain.commands).total }}
            </span>
          </div>
          <div v-for="cmd in domain.commands" :key="cmd" class="proof-card" :style="{ opacity: runningCommands.has(cmd) ? 0.6 : 1 }">
            <div class="proof-card-header">
              <span class="proof-cmd-name">{{ cmd }}</span>
              <span v-if="runningCommands.has(cmd)" class="proof-running"><span class="spin">⟳</span> running</span>
              <span v-else-if="proofResults[cmd] && proofResults[cmd].total > 0" class="proof-result-badge" :style="{ color: proofResults[cmd].failed === 0 ? 'var(--sd-success, #15803d)' : 'var(--sd-danger, #dc2626)' }">
                {{ proofResults[cmd].passed }}/{{ proofResults[cmd].total }} {{ proofResults[cmd].failed === 0 ? 'PASS' : 'FAIL' }}
              </span>
            </div>
            <div v-if="proofResults[cmd] && proofResults[cmd].total > 0 && proofResults[cmd].failures && proofResults[cmd].failures!.length > 0" class="proof-failures">
              <div v-for="(f, i) in proofResults[cmd].failures" :key="i" class="failure-line">{{ f.error?.slice(0, 120) }}</div>
            </div>
            <div v-if="proofResults[cmd] && proofResults[cmd].total > 0 && proofResults[cmd].checks" class="proof-checks">
              <div v-for="g in groupChecks(proofResults[cmd].checks!)" :key="g.group" class="check-group">
                <span>{{ g.group }}</span>
                <span :style="{ color: g.passed === g.total ? 'var(--sd-success, #15803d)' : 'var(--sd-danger, #dc2626)', fontWeight: 600 }">{{ g.passed }}/{{ g.total }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Component view -->
      <div v-else class="content-column" style="gap: 24px">
        <div v-for="[comp, v] in toShow" :key="`${comp}-${v}`" class="component-card">
          <div class="component-label">{{ v }}</div>
          <div class="component-body">
            <component :is="comps[comp]" :config="paintConfig(SAMPLES[comp][v])" :on-event="handleEvent" />
          </div>
          <div class="proof-panel" :ref="(el: any) => mountProof(el, comp)"></div>
          <!-- Ticket creation -->
          <div class="ticket-create">
            <select :id="`ticket-type-${comp}`" class="ticket-type-select">
              <option value="bug">bug</option><option value="event">event</option><option value="paint">paint</option>
              <option value="style">style</option><option value="data">data</option><option value="structure">structure</option>
              <option value="variation">variation</option><option value="new-component">new-component</option>
            </select>
            <input :id="`ticket-title-${comp}`" placeholder="Describe the issue..." class="ticket-input" />
            <button class="btn-ticket-create" @click="submitTicket(comp)">+ Ticket</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="proofToast" class="toast" :style="{ color: proofToast.color }">{{ proofToast.message }}</div>
  </div>
</template>

<style>
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.viewer { display: flex; height: 100vh; font-family: system-ui, sans-serif; background: var(--sd-surface-base, #fff); color: var(--sd-text, #1a1a1a); }
.sidebar { width: 220px; border-right: 1px solid var(--sd-border, #e5e7eb); display: flex; flex-direction: column; overflow: hidden; background: var(--sd-surface-raised, #f9fafb); flex-shrink: 0; }
.brand { padding: 12px; border-bottom: 1px solid var(--sd-border, #e5e7eb); display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; }
.brand img { width: 18px; height: 21px; }

.style-section { padding: 12px; border-bottom: 1px solid var(--sd-border, #e5e7eb); display: flex; flex-direction: column; gap: 8px; }
.label-text { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sd-text-muted, #6b7280); display: block; margin-bottom: 4px; }
.dropdown { width: 100%; padding: 4px 8px; font-size: 13px; border-radius: 4px; border: 1px solid var(--sd-border, #d1d5db); background: var(--sd-surface-base, #fff); color: var(--sd-text, #1a1a1a); }

.proofs-section { padding: 8px; border-bottom: 1px solid var(--sd-border, #e5e7eb); }
.section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sd-text-muted, #6b7280); margin-bottom: 8px; padding: 0 4px; }

.scroll-area { flex: 1; overflow: auto; padding: 8px; }

.sidebar-btn { display: block; width: 100%; text-align: left; padding: 4px 8px; font-size: 13px; border: none; border-radius: 4px; cursor: pointer; background: transparent; color: var(--sd-text, #1a1a1a); margin-bottom: 2px; }
.sidebar-btn.active { background: var(--sd-accent, #3b82f6); color: var(--sd-text-inverse, #fff); }
.sidebar-btn:hover:not(.active) { background: var(--sd-surface-sunken, #f3f4f6); }
.var-btn { padding-left: 22px; }

.main { flex: 1; overflow: auto; padding: 24px; background: var(--sd-surface-base, #fff); }
.header-title { font-size: 14px; font-weight: 600; margin-bottom: 16px; color: var(--sd-text, #1a1a1a); }
.header-subtitle { font-weight: 400; color: var(--sd-text-muted, #6b7280); }

.content-column { display: flex; flex-direction: column; gap: 12px; }
.empty-text { color: var(--sd-text-muted, #6b7280); font-size: 13px; }

/* Ticket cards */
.ticket-card { border: 1px solid var(--sd-border, #e5e7eb); border-radius: 6px; overflow: hidden; }
.ticket-header { padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; background: var(--sd-surface-raised, #fafafa); }
.ticket-id { font-size: 11px; font-weight: 700; color: var(--sd-accent, #2563eb); margin-right: 8px; }
.ticket-type { font-size: 11px; padding: 1px 6px; border-radius: 3px; background: var(--sd-surface-sunken, #f1f5f9); color: var(--sd-text-dim, #475569); }
.ticket-status { font-size: 11px; font-weight: 600; }
.ticket-body { padding: 8px 12px; }
.ticket-title { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
.ticket-desc { font-size: 11px; color: var(--sd-text-dim, #475569); line-height: 1.5; }
.ticket-meta { padding: 6px 12px; border-top: 1px solid var(--sd-border, #e5e7eb); font-size: 10px; color: var(--sd-text-muted, #475569); display: flex; gap: 12px; flex-wrap: wrap; }
.ticket-actions { padding: 6px 12px; border-top: 1px solid var(--sd-border, #e5e7eb); display: flex; gap: 8px; align-items: center; }
.btn-prove { padding: 2px 8px; font-size: 10px; font-weight: 600; border-radius: 3px; border: none; background: var(--sd-accent, #2563eb); color: var(--sd-text-inverse, #fff); cursor: pointer; }
.prove-result { font-size: 10px; font-weight: 600; }
.btn-action { padding: 2px 8px; font-size: 10px; border-radius: 3px; border: 1px solid var(--sd-border, #d1d5db); background: var(--sd-surface-base, #fff); color: var(--sd-text, #0f172a); cursor: pointer; }

/* Proof view */
.proof-controls { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
.btn-run { padding: 6px 16px; font-size: 13px; font-weight: 600; border-radius: 4px; border: none; color: var(--sd-text-inverse, #fff); transition: background 0.2s; }
.proof-summary { font-size: 13px; font-weight: 600; }
.domain-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.domain-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sd-text-muted, #6b7280); }
.btn-domain-run { padding: 2px 8px; font-size: 10px; font-weight: 600; border-radius: 3px; border: 1px solid var(--sd-border, #d1d5db); cursor: pointer; background: var(--sd-surface-base, #fff); color: var(--sd-text, #0f172a); }
.domain-summary { font-size: 11px; font-weight: 600; }

.proof-card { border: 1px solid var(--sd-border, #e5e7eb); border-radius: 6px; margin-bottom: 8px; overflow: hidden; transition: opacity 0.2s; }
.proof-card-header { padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; background: var(--sd-surface-raised, #fafafa); }
.proof-cmd-name { font-size: 13px; font-weight: 600; }
.proof-running { font-size: 11px; color: var(--sd-text-muted, #6b7280); display: inline-flex; align-items: center; gap: 4px; }
.spin { display: inline-block; animation: spin 1s linear infinite; }
.proof-result-badge { font-size: 12px; font-weight: 600; }
.proof-failures { padding: 8px 12px; border-top: 1px solid var(--sd-border, #e5e7eb); }
.failure-line { font-size: 11px; color: var(--sd-danger, #dc2626); padding: 2px 0; font-family: monospace; }
.proof-checks { padding: 8px 12px; border-top: 1px solid var(--sd-border, #e5e7eb); font-size: 11px; color: var(--sd-text-dim, #475569); }
.check-group { display: flex; justify-content: space-between; padding: 1px 0; }

/* Component cards */
.component-card { border: 1px solid var(--sd-border, #e5e7eb); border-radius: 8px; overflow: hidden; }
.component-label { padding: 8px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sd-text-muted, #6b7280); border-bottom: 1px solid var(--sd-border, #e5e7eb); background: var(--sd-surface-raised, #fafafa); }
.component-body { padding: 16px; }

/* Ticket creation in component cards */
.ticket-create { padding: 8px 12px; border-top: 1px solid var(--sd-border, #e5e7eb); display: flex; gap: 6px; align-items: center; }
.ticket-type-select { padding: 3px 6px; font-size: 10px; border-radius: 3px; border: 1px solid var(--sd-border, #d1d5db); background: var(--sd-surface-base, #fff); color: var(--sd-text, #0f172a); }
.ticket-input { flex: 1; padding: 3px 6px; font-size: 11px; border-radius: 3px; border: 1px solid var(--sd-border, #d1d5db); background: var(--sd-surface-base, #fff); color: var(--sd-text, #0f172a); }
.btn-ticket-create { padding: 3px 8px; font-size: 10px; font-weight: 600; border-radius: 3px; border: none; background: var(--sd-accent, #2563eb); color: var(--sd-text-inverse, #fff); cursor: pointer; }

/* Toast */
.toast { position: fixed; bottom: 24px; right: 24px; padding: 10px 20px; border-radius: 6px; background: var(--sd-surface-deep, #1e293b); font-size: 13px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.25); z-index: 9999; transition: opacity 0.3s; }
</style>
