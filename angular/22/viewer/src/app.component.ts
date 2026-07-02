/**
 * Viewer App — renders all components/variations with style + theme switching.
 * Full feature parity with react/19 viewer: Proofs, Tickets, Components,
 * EPRPP paint state, style/theme picklists, mutual exclusion.
 */
import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { SAMPLES } from '../../../../samples';
import { createSafeProofViewer } from '../../../../dev/proof-viewer';
import { NgFor, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeLayoutComponent } from '../../SafeLayout';
import { SafeColumnsComponent } from '../../SafeColumns';
import { SafeCardComponent } from '../../SafeCard';
import { SafeButtonComponent } from '../../SafeButton';
import { SafeTableComponent } from '../../SafeTable';
import { SafeTreeComponent } from '../../SafeTree';
import { SafeSheetComponent } from '../../SafeSheet';
import { SafeChartComponent } from '../../SafeChart';
import { SafeHeatmapComponent } from '../../SafeHeatmap';
import { SafeGaugeComponent } from '../../SafeGauge';
import { SafeFunnelComponent } from '../../SafeFunnel';
import { SafeFlowComponent } from '../../SafeFlow';
import { SafeHierarchyComponent } from '../../SafeHierarchy';
import { SafeTimelineComponent } from '../../SafeTimeline';
import { SafeMapComponent } from '../../SafeMap';
import { SafeCalendarComponent } from '../../SafeCalendar';
import { SafeToggleComponent } from '../../SafeToggle';
import { SafeWeekComponent } from '../../SafeWeek';
import { SafeChatComponent } from '../../SafeChat';
import { SafeTabsComponent } from '../../SafeTabs';
import { SafeCalloutComponent } from '../../SafeCallout';
import { SafeDragDropComponent } from '../../SafeDragDrop';
import { SafeGridComponent } from '../../SafeGrid';
import { SafeInputComponent } from '../../SafeInput';
import { SafeListComponent } from '../../SafeList';
import { SafePickerComponent } from '../../SafePicker';
import { SafeNavComponent } from '../../SafeNav';
import { SafeParserComponent } from '../../SafeParser';
import { SafePlanComponent } from '../../SafePlan';
import { SafeSkillUpComponent } from '../../SafeSkillUp';
import { SafeDispatchComponent } from '../../SafeDispatch';
import { SafeBriefingComponent } from '../../SafeBriefing';
import { listAllTickets, createTicket, updateTicket } from './ticket-service';
import type { Ticket, TicketType } from 'safecontracts';
import type { SafeEvent, ConfigBase } from 'safecontracts';

/** Tauri invoke — safe no-op when not in Tauri context */
async function invoke<T>(cmd: string, args?: Record<string, any>): Promise<T> {
  const { invoke: tauriInvoke } = await import('@tauri-apps/api/core');
  return tauriInvoke<T>(cmd, args);
}

/** Listen for Tauri events */
async function listen(event: string, handler: (payload: any) => void): Promise<() => void> {
  const { listen: tauriListen } = await import('@tauri-apps/api/event');
  const unlisten = await tauriListen(event, (e) => handler(e.payload));
  return unlisten;
}

const STATE_DIR = 'runtime';
const STATE_FILE = 'runtime/state.json';
const HEARTBEATS_DIR = '/Users/toddnakasato/Documents/FF/VSCODE/FFPROD/safeconfig/safeagent/heartbeats';
const STYLES = ['vanilla', 'tailwind', 'tailwind-daisy', 'material'] as const;
const COMPONENT_NAMES = Object.keys(SAMPLES).sort();

// Themes per implementation — discovered from safestyles at build time
const THEME_FILES: Record<string, () => Promise<any>> = import.meta.glob('../public/styles/*/themes/*.css', { query: '?url' });
const THEMES: Record<string, string[]> = {};
for (const path of Object.keys(THEME_FILES)) {
  const m = path.match(/styles\/([^/]+)\/themes\/([^/]+)\.css$/);
  if (!m) continue;
  (THEMES[m[1]] ??= []).push(m[2]);
}
for (const k of Object.keys(THEMES)) THEMES[k].sort((a, b) => a === 'default' ? -1 : b === 'default' ? 1 : a.localeCompare(b));

interface ProofResult {
  passed: number;
  total: number;
  failed: number;
  checks?: any[];
  failures?: any[];
}

interface ProofDomain {
  label: string;
  commands: string[];
}

const PROOF_DOMAINS: ProofDomain[] = [
  { label: 'builder', commands: ['builder-dumb', 'builder-reconcile', 'builder-structure'] },
  { label: 'event', commands: ['event-coverage', 'event-declared', 'event-payload'] },
  { label: 'framework', commands: ['framework-boot', 'framework-delegation'] },
  { label: 'paint', commands: ['paint-chain', 'paint-contrast', 'paint-cssonly', 'paint-definition', 'paint-parity', 'paint-unopinionated'] },
  { label: 'ticket', commands: ['ticket'] },
];
const ALL_PROVE_COMMANDS = PROOF_DOMAINS.flatMap(d => d.commands);

// Orbitor categories — alpha order (TICKET_CATEGORIES)
const ORBITOR_NAMES = ['alive', 'crave', 'drive', 'enforce', 'learn', 'orbit', 'pulse', 'safeagents', 'safeapp', 'safebuilds', 'safecli', 'safeconfig', 'safecontracts', 'safeframeworks', 'safelibs', 'safestyles'];
const ORBITOR_GOALS: Record<string, string> = {
  alive: 'goal-alive', crave: 'goal-crave', drive: 'goal-drive', enforce: 'goal-enforce',
  learn: 'goal-learn', orbit: 'goal-orbit', pulse: 'goal-pulse',
  safeagents: 'goal-safeagents-structure', safeapp: 'goal-safeapp-structure',
  safebuilds: 'goal-safebuilds-structure', safecli: 'goal-safecli-structure',
  safeconfig: 'goal-safeconfig-structure', safecontracts: 'goal-safecontracts',
  safeframeworks: 'goal-safeframeworks-builders', safelibs: 'goal-safelibs', safestyles: 'goal-safestyles-structure',
};

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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle, NgSwitch, NgSwitchCase, FormsModule, SafeLayoutComponent, SafeColumnsComponent, SafeCardComponent, SafeButtonComponent, SafeTableComponent, SafeTreeComponent, SafeSheetComponent, SafeChartComponent, SafeHeatmapComponent, SafeGaugeComponent, SafeFunnelComponent, SafeFlowComponent, SafeHierarchyComponent, SafeTimelineComponent, SafeMapComponent, SafeCalendarComponent, SafeToggleComponent, SafeWeekComponent, SafeChatComponent, SafeTabsComponent, SafeCalloutComponent, SafeDragDropComponent, SafeGridComponent, SafeInputComponent, SafeListComponent, SafePickerComponent, SafeNavComponent, SafeParserComponent, SafePlanComponent, SafeSkillUpComponent, SafeDispatchComponent, SafeBriefingComponent],
  template: `
    <div [ngStyle]="{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', background: 'var(--sd-surface-base, #fff)', color: 'var(--sd-text, #1a1a1a)' }">
      <!-- Sidebar -->
      <div [ngStyle]="{ width: '220px', borderRight: '1px solid var(--sd-border, #e5e7eb)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--sd-surface-raised, #f9fafb)' }">
        <!-- Brand -->
        <div [ngStyle]="{ padding: '12px', borderBottom: '1px solid var(--sd-border, #e5e7eb)', display: 'flex', alignItems: 'center', gap: '8px' }">
          <img src="/shield.png" alt="SafeDesk" [ngStyle]="{ width: '18px', height: '21px' }" />
          <span [ngStyle]="{ fontSize: '13px', fontWeight: '600' }">angular/22</span>
        </div>

        <!-- Style switcher — two picklists -->
        <div [ngStyle]="{ padding: '12px', borderBottom: '1px solid var(--sd-border, #e5e7eb)', display: 'flex', flexDirection: 'column', gap: '8px' }">
          <div>
            <label [ngStyle]="labelStyle">Framework</label>
            <select [ngModel]="activeStyle" (ngModelChange)="selectStyle($event)" [ngStyle]="dropdownStyle">
              <option *ngFor="let s of styles" [value]="s">{{s}}</option>
            </select>
          </div>
          <div>
            <label [ngStyle]="labelStyle">Theme</label>
            <select [ngModel]="activeTheme" (ngModelChange)="activeTheme = $event; onStyleChange()" [ngStyle]="dropdownStyle">
              <option *ngFor="let t of getThemes()" [value]="t">{{t}}</option>
            </select>
          </div>
        </div>

        <!-- Orbitors section -->
        <div [ngStyle]="{ padding: '8px', borderBottom: '1px solid var(--sd-border, #e5e7eb)' }">
          <div [ngStyle]="{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }">
            <button (click)="showOrbitors(activeOrbitor)" [ngStyle]="{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sd-text-muted, #6b7280)', padding: '0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', flex: '1', textDecoration: orbitorView ? 'none' : 'underline' }">Orbitors</button>
            <button (click)="wakeOrbitor(null)" [ngStyle]="{ fontSize: '10px', fontWeight: '600', padding: '1px 8px', borderRadius: '3px', border: '1px solid var(--sd-border, #d1d5db)', background: 'var(--sd-surface-base, #fff)', color: 'var(--sd-text, #1a1a1a)', cursor: 'pointer' }">Wake All</button>
          </div>
          <select [ngModel]="orbitorView ? (activeOrbitor ?? 'All') : 'All'" (ngModelChange)="showOrbitors($event === 'All' ? null : $event)" [ngStyle]="dropdownStyle">
            <option value="All">All</option>
            <option *ngFor="let n of orbitorNames" [value]="n">{{n}}</option>
          </select>
        </div>

        <!-- Proofs section -->
        <div [ngStyle]="{ padding: '8px', borderBottom: '1px solid var(--sd-border, #e5e7eb)' }">
          <div [ngStyle]="sectionLabel">Proofs</div>
          <select [ngModel]="activeProof && activeProof !== '__none__' ? activeProof : 'All'" (ngModelChange)="openProofs($event === 'All' ? null : $event)" [ngStyle]="dropdownStyle">
            <option value="All">All</option>
            <option *ngFor="let d of proofDomains" [value]="d.label">{{d.label}}</option>
          </select>
        </div>

        <!-- Scrollable area: Tickets + Components -->
        <div [ngStyle]="{ flex: '1', overflow: 'auto', padding: '8px' }">
          <!-- Tickets -->
          <div [ngStyle]="{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sd-text-muted, #6b7280)', marginBottom: '8px', padding: '0 4px', marginTop: '4px' }">Tickets</div>
          <button (click)="openTickets('open')" [ngStyle]="itemStyle(ticketView === 'open' && !proofView)">
            Open <span *ngIf="openTicketCount > 0">({{openTicketCount}})</span>
          </button>
          <button (click)="openTickets('closed')" [ngStyle]="itemStyle(ticketView === 'closed' && !proofView)">
            Closed <span *ngIf="closedTicketCount > 0">({{closedTicketCount}})</span>
          </button>

          <!-- Components -->
          <div [ngStyle]="{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }">
            <div>
              <button (click)="activeComponent && (activeVariation ? selectVariation(activeComponent!, activeVariation!) : selectComponent(activeComponent!))" [ngStyle]="{ fontSize: '10px', fontWeight: '600', color: 'var(--sd-text-muted, #6b7280)', padding: '0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', textDecoration: (!proofView && !ticketView && !orbitorView) ? 'none' : 'underline' }">Component</button>
              <select [ngModel]="activeComponent" (ngModelChange)="selectComponent($event)" [ngStyle]="dropdownStyle">
                <option *ngFor="let n of componentNames" [value]="n">{{n}}</option>
              </select>
            </div>
            <div>
              <label [ngStyle]="labelStyle">Variation</label>
              <select [ngModel]="activeVariation" (ngModelChange)="selectVariation(activeComponent!, $event)" [ngStyle]="dropdownStyle" [disabled]="!activeComponent">
                <option *ngFor="let v of allVariations(activeComponent!)" [value]="v">{{v}}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Main area -->
      <div [ngStyle]="{ flex: '1', overflow: 'auto', padding: '24px', background: 'var(--sd-surface-base, #fff)' }">
        <div [ngStyle]="{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--sd-text, #1a1a1a)' }">
          angular/22 — {{activeStyle}}{{activeTheme !== 'default' ? '/' + activeTheme : ''}}
          <span *ngIf="orbitorView" [ngStyle]="{ fontWeight: '400', color: 'var(--sd-text-muted, #6b7280)' }"> — orbitors{{activeOrbitor ? ' / ' + activeOrbitor : ' / all'}}</span>
          <span *ngIf="!orbitorView && proofView" [ngStyle]="{ fontWeight: '400', color: 'var(--sd-text-muted, #6b7280)' }"> — proofs{{activeProof && activeProof !== '__none__' ? ' / ' + activeProof : ''}}</span>
          <span *ngIf="ticketView" [ngStyle]="{ fontWeight: '400', color: 'var(--sd-text-muted, #6b7280)' }"> — tickets / {{ticketView}}</span>
          <span *ngIf="!orbitorView && !proofView && !ticketView && activeComponent" [ngStyle]="{ fontWeight: '400', color: 'var(--sd-text-muted, #6b7280)' }"> — {{activeVariation ?? activeComponent}}</span>
        </div>

        <!-- ORBITOR VIEW -->
        <ng-container *ngIf="orbitorView">
          <div>
            <div [ngStyle]="{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }">
              <span *ngIf="orbitorTail" [ngStyle]="{ fontSize: '11px', color: 'var(--sd-text-muted, #6b7280)' }">live — as of {{fmtEst(orbitorTail.ts)}} ET</span>
            </div>
            <div [ngStyle]="{ display: 'grid', gridTemplateColumns: activeOrbitor ? '1fr' : 'repeat(3, 1fr)', gridTemplateRows: activeOrbitor ? 'auto' : 'repeat(8, 1fr)', height: activeOrbitor ? 'auto' : 'calc(100vh - 140px)', gap: '12px' }">
              <ng-container *ngFor="let e of paddedEntries()">
                <div *ngIf="!e" [ngStyle]="{ border: '1px dashed var(--sd-border, #e5e7eb)', borderRadius: '6px', opacity: '0.4' }"></div>
                <div *ngIf="e" [ngStyle]="{ border: '1px solid var(--sd-border, #e5e7eb)', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '0' }">
                  <div [ngStyle]="{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--sd-surface-raised, #fafafa)', borderBottom: '1px solid var(--sd-border, #e5e7eb)' }">
                    <span [class.orbitor-dot-blink]="e.liveness === 'alive'" [ngStyle]="{ width: '8px', height: '8px', borderRadius: '50%', background: e.liveness === 'alive' ? 'var(--sd-success, #15803d)' : e.liveness === 'stale' ? 'var(--sd-warn, #d97706)' : 'var(--sd-text-muted, #9ca3af)', display: 'inline-block' }"></span>
                    <span [ngStyle]="{ fontSize: '12px', fontWeight: '700' }">{{orbitorName(e)}}</span>
                    <button (click)="wakeOrbitor(e.goal_id)" [ngStyle]="{ marginLeft: 'auto', fontSize: '10px', fontWeight: '600', padding: '1px 8px', borderRadius: '3px', border: '1px solid var(--sd-border, #d1d5db)', background: 'var(--sd-surface-base, #fff)', color: 'var(--sd-text, #1a1a1a)', cursor: 'pointer' }">Wake</button>
                  </div>
                  <div class="orbitor-lines" [ngStyle]="{ padding: '8px 12px', fontFamily: 'monospace', fontSize: '10px', lineHeight: '1.6', flex: '1', overflow: 'auto', minHeight: '0' }">
                    <div *ngIf="e.lines.length === 0" [ngStyle]="{ color: 'var(--sd-text-muted, #9ca3af)' }">no data</div>
                    <div *ngFor="let l of e.lines" [ngStyle]="{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }">
                      <span [ngStyle]="{ color: 'var(--sd-text-muted, #9ca3af)' }">{{fmtEst(l.ts)}} </span>
                      <span [title]="l.output" [ngStyle]="{ color: l.verdict === 'GREEN' ? 'var(--sd-success, #15803d)' : 'var(--sd-danger, #dc2626)' }">{{l.output}}</span>
                    </div>
                  </div>
                </div>
              </ng-container>
            </div>
          </div>
        </ng-container>

        <!-- TICKET VIEW -->
        <ng-container *ngIf="ticketView && !orbitorView">
          <div [ngStyle]="{ display: 'flex', flexDirection: 'column', gap: '12px' }">
            <div *ngIf="filteredTickets().length === 0" [ngStyle]="{ color: 'var(--sd-text-muted, #6b7280)', fontSize: '13px' }">No {{ticketView}} tickets.</div>
            <div *ngFor="let t of filteredTickets()" [ngStyle]="{ border: '1px solid var(--sd-border, #e5e7eb)', borderRadius: '6px', overflow: 'hidden' }">
              <!-- Ticket header -->
              <div [ngStyle]="{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--sd-surface-raised, #fafafa)' }">
                <div>
                  <span [ngStyle]="{ fontSize: '11px', fontWeight: '700', color: 'var(--sd-accent, #2563eb)', marginRight: '8px' }">{{t.id}}</span>
                  <span [ngStyle]="{ fontSize: '11px', padding: '1px 6px', borderRadius: '3px', background: 'var(--sd-surface-sunken, #f1f5f9)', color: 'var(--sd-text-dim, #475569)' }">{{t.type}}</span>
                </div>
                <span [ngStyle]="{ fontSize: '11px', fontWeight: '600', color: ticketStatusColor(t.status) }">{{t.status}}</span>
              </div>
              <!-- Ticket body -->
              <div [ngStyle]="{ padding: '8px 12px' }">
                <div [ngStyle]="{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }">{{t.title}}</div>
                <div [ngStyle]="{ fontSize: '11px', color: 'var(--sd-text-dim, #475569)', lineHeight: '1.5' }">{{t.description}}</div>
              </div>
              <!-- Ticket metadata -->
              <div [ngStyle]="{ padding: '6px 12px', borderTop: '1px solid var(--sd-border, #e5e7eb)', fontSize: '10px', color: 'var(--sd-text-muted, #475569)', display: 'flex', gap: '12px', flexWrap: 'wrap' }">
                <span>proves: {{t.proves?.join(', ')}}</span>
                <span *ngIf="t.params">scope: {{formatParams(t.params)}}</span>
                <span *ngIf="t.event && !t.params?.event">event: {{t.event}}</span>
                <span *ngIf="t.resolution">resolution: {{t.resolution}}</span>
              </div>
              <!-- Ticket actions -->
              <div [ngStyle]="{ padding: '6px 12px', borderTop: '1px solid var(--sd-border, #e5e7eb)', display: 'flex', gap: '8px', alignItems: 'center' }">
                <button [id]="'prove-' + t.id" (click)="proveTicket(t)"
                  [ngStyle]="{ padding: '2px 8px', fontSize: '10px', fontWeight: '600', borderRadius: '3px', border: 'none', background: 'var(--sd-accent, #2563eb)', color: 'var(--sd-text-inverse, #fff)', cursor: 'pointer' }">
                  Prove
                </button>
                <span [id]="'prove-result-' + t.id" [ngStyle]="{ fontSize: '10px', fontWeight: '600' }"></span>
                <ng-container *ngIf="t.status === 'open'">
                  <button (click)="startTicket(t)"
                    [ngStyle]="{ padding: '2px 8px', fontSize: '10px', borderRadius: '3px', border: '1px solid var(--sd-border, #d1d5db)', background: 'var(--sd-surface-base, #fff)', color: 'var(--sd-text, #0f172a)', cursor: 'pointer' }">
                    Start
                  </button>
                  <button (click)="closeTicket(t)"
                    [ngStyle]="{ padding: '2px 8px', fontSize: '10px', borderRadius: '3px', border: '1px solid var(--sd-border, #d1d5db)', background: 'var(--sd-surface-base, #fff)', color: 'var(--sd-text, #0f172a)', cursor: 'pointer' }">
                    Close
                  </button>
                </ng-container>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- PROOF VIEW -->
        <ng-container *ngIf="proofView && !ticketView && !orbitorView">
          <div [ngStyle]="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
            <!-- Run button + progress -->
            <div [ngStyle]="{ display: 'flex', alignItems: 'center', gap: '12px' }">
              <button (click)="runProofs(getActiveCommands())" [disabled]="proofRunning"
                [ngStyle]="{ padding: '6px 16px', fontSize: '13px', fontWeight: '600', borderRadius: '4px', border: 'none', cursor: proofRunning ? 'wait' : 'pointer', background: proofRunning ? 'var(--sd-text-muted, #6b7280)' : 'var(--sd-accent, #2563eb)', color: 'var(--sd-text-inverse, #fff)', transition: 'background 0.2s' }">
                {{proofRunning ? '⟳' : '▶'}}
                {{proofRunning ? 'Running' + (proofProgress ? ' ' + proofProgress.done + '/' + proofProgress.total : '...') : (activeProof ? 'Run ' + activeProof : 'Run All')}}
              </button>
              <span *ngIf="getActiveTotals().total > 0" [ngStyle]="{ fontSize: '13px', fontWeight: '600', color: getActiveTotals().failed === 0 ? 'var(--sd-success, #15803d)' : 'var(--sd-danger, #dc2626)' }">
                {{getActiveTotals().passed}}/{{getActiveTotals().total}} {{getActiveTotals().failed === 0 ? 'PASS' : '(' + getActiveTotals().failed + ' failed)'}}
              </span>
            </div>

            <!-- Domain groups -->
            <div *ngFor="let domain of getVisibleDomains()">
              <div [ngStyle]="{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }">
                <span [ngStyle]="{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sd-text-muted, #6b7280)' }">{{domain.label}}</span>
                <button *ngIf="!activeProof" (click)="runProofs(domain.commands)" [disabled]="proofRunning"
                  [ngStyle]="{ padding: '2px 8px', fontSize: '10px', fontWeight: '600', borderRadius: '3px', border: '1px solid var(--sd-border, #d1d5db)', cursor: proofRunning ? 'wait' : 'pointer', background: 'var(--sd-surface-base, #fff)', color: 'var(--sd-text, #0f172a)' }">
                  Run
                </button>
                <span *ngIf="getDomainTotals(domain).total > 0" [ngStyle]="{ fontSize: '11px', fontWeight: '600', color: getDomainTotals(domain).passed === getDomainTotals(domain).total ? 'var(--sd-success, #15803d)' : 'var(--sd-danger, #dc2626)' }">
                  {{getDomainTotals(domain).passed}}/{{getDomainTotals(domain).total}}
                </span>
              </div>

              <!-- Command cards -->
              <div *ngFor="let cmd of domain.commands" [ngStyle]="{ border: '1px solid var(--sd-border, #e5e7eb)', borderRadius: '6px', marginBottom: '8px', overflow: 'hidden', opacity: isCommandRunning(cmd) ? '0.6' : '1', transition: 'opacity 0.2s' }">
                <div [ngStyle]="{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--sd-surface-raised, #fafafa)' }">
                  <span [ngStyle]="{ fontSize: '13px', fontWeight: '600' }">{{cmd}}</span>
                  <span *ngIf="isCommandRunning(cmd)" [ngStyle]="{ fontSize: '11px', color: 'var(--sd-text-muted, #6b7280)', display: 'inline-flex', alignItems: 'center', gap: '4px' }">
                    <span [ngStyle]="{ display: 'inline-block', animation: 'spin 1s linear infinite' }">⟳</span> running
                  </span>
                  <span *ngIf="!isCommandRunning(cmd) && proofResults[cmd] && proofResults[cmd].total > 0"
                    [ngStyle]="{ fontSize: '12px', fontWeight: '600', color: proofResults[cmd].failed === 0 ? 'var(--sd-success, #15803d)' : 'var(--sd-danger, #dc2626)' }">
                    {{proofResults[cmd].passed}}/{{proofResults[cmd].total}} {{proofResults[cmd].failed === 0 ? 'PASS' : 'FAIL'}}
                  </span>
                </div>
                <!-- Failures -->
                <div *ngIf="proofResults[cmd]?.failures?.length" [ngStyle]="{ padding: '8px 12px', borderTop: '1px solid var(--sd-border, #e5e7eb)' }">
                  <div *ngFor="let f of proofResults[cmd].failures" [ngStyle]="{ fontSize: '11px', color: 'var(--sd-danger, #dc2626)', padding: '2px 0', fontFamily: 'monospace' }">
                    {{f.error?.slice(0, 120)}}
                  </div>
                </div>
                <!-- Checks grouped -->
                <div *ngIf="proofResults[cmd]?.checks?.length" [ngStyle]="{ padding: '8px 12px', borderTop: '1px solid var(--sd-border, #e5e7eb)', fontSize: '11px', color: 'var(--sd-text-dim, #475569)' }">
                  <div *ngFor="let group of getCheckGroups(cmd)" [ngStyle]="{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }">
                    <span>{{group.name}}</span>
                    <span [ngStyle]="{ color: group.passed === group.total ? 'var(--sd-success, #15803d)' : 'var(--sd-danger, #dc2626)', fontWeight: '600' }">
                      {{group.passed}}/{{group.total}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- COMPONENT VIEW -->
        <ng-container *ngIf="!ticketView && !proofView && !orbitorView">
          <div [ngStyle]="{ display: 'flex', flexDirection: 'column', gap: '24px' }">
            <ng-container *ngFor="let pair of toShow()">
              <div [ngStyle]="{ border: '1px solid var(--sd-border, #e5e7eb)', borderRadius: '8px', overflow: 'hidden' }">
                <div [ngStyle]="{ padding: '8px 12px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sd-text-muted, #6b7280)', borderBottom: '1px solid var(--sd-border, #e5e7eb)', background: 'var(--sd-surface-raised, #fafafa)' }">
                  {{pair[1]}}
                </div>
                <div [ngStyle]="{ padding: '16px' }">
                  <ng-container [ngSwitch]="pair[0]">
                    <safe-layout *ngSwitchCase="'layout'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-layout>
                    <safe-columns *ngSwitchCase="'columns'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-columns>
                    <safe-card *ngSwitchCase="'card'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-card>
                    <safe-button *ngSwitchCase="'button'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-button>
                    <safe-table *ngSwitchCase="'table'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-table>
                    <safe-tree *ngSwitchCase="'tree'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-tree>
                    <safe-sheet *ngSwitchCase="'sheet'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-sheet>
                    <safe-chart *ngSwitchCase="'chart'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-chart>
                    <safe-heatmap *ngSwitchCase="'heatmap'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-heatmap>
                    <safe-gauge *ngSwitchCase="'gauge'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-gauge>
                    <safe-funnel *ngSwitchCase="'funnel'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-funnel>
                    <safe-flow *ngSwitchCase="'flow'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-flow>
                    <safe-hierarchy *ngSwitchCase="'hierarchy'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-hierarchy>
                    <safe-timeline *ngSwitchCase="'timeline'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-timeline>
                    <safe-map *ngSwitchCase="'map'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-map>
                    <safe-calendar *ngSwitchCase="'calendar'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-calendar>
                    <safe-toggle *ngSwitchCase="'toggle'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-toggle>
                    <safe-week *ngSwitchCase="'week'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-week>
                    <safe-chat *ngSwitchCase="'chat'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-chat>
                    <safe-tabs *ngSwitchCase="'tabs'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-tabs>
                    <safe-callout *ngSwitchCase="'callout'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-callout>
                    <safe-drag-drop *ngSwitchCase="'drag-drop'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-drag-drop>
                    <safe-grid *ngSwitchCase="'grid'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-grid>
                    <safe-input *ngSwitchCase="'input'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-input>
                    <safe-list *ngSwitchCase="'list'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-list>
                    <safe-picker *ngSwitchCase="'picker'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-picker>
                    <safe-nav *ngSwitchCase="'nav'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-nav>
                    <safe-parser *ngSwitchCase="'parser'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-parser>
                    <safe-plan *ngSwitchCase="'plan'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-plan>
                    <safe-skillup *ngSwitchCase="'skillup'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-skillup>
                    <safe-dispatch *ngSwitchCase="'dispatch'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-dispatch>
                    <safe-briefing *ngSwitchCase="'briefing'" [config]="cfg(pair[0], pair[1])" [onEvent]="handleEvent"></safe-briefing>
                  </ng-container>
                </div>
                <!-- Ticket creation row -->
                <div [ngStyle]="{ padding: '8px 12px', borderTop: '1px solid var(--sd-border, #e5e7eb)', display: 'flex', gap: '6px', alignItems: 'center' }">
                  <select [id]="'ticket-type-' + pair[0]" [ngStyle]="{ padding: '3px 6px', fontSize: '10px', borderRadius: '3px', border: '1px solid var(--sd-border, #d1d5db)', background: 'var(--sd-surface-base, #fff)', color: 'var(--sd-text, #0f172a)' }">
                    <option value="bug">bug</option><option value="event">event</option><option value="paint">paint</option>
                    <option value="style">style</option><option value="data">data</option><option value="structure">structure</option>
                    <option value="variation">variation</option><option value="new-component">new-component</option>
                  </select>
                  <input [id]="'ticket-title-' + pair[0]" placeholder="Describe the issue..." [ngStyle]="{ flex: '1', padding: '3px 6px', fontSize: '11px', borderRadius: '3px', border: '1px solid var(--sd-border, #d1d5db)', background: 'var(--sd-surface-base, #fff)', color: 'var(--sd-text, #0f172a)' }" />
                  <button (click)="createTicketForComponent(pair[0])"
                    [ngStyle]="{ padding: '3px 8px', fontSize: '10px', fontWeight: '600', borderRadius: '3px', border: 'none', background: 'var(--sd-accent, #2563eb)', color: 'var(--sd-text-inverse, #fff)', cursor: 'pointer' }">
                    + Ticket
                  </button>
                </div>
              </div>
            </ng-container>
          </div>
        </ng-container>
      </div>

      <!-- Toast -->
      <div *ngIf="proofToast" [ngStyle]="{ position: 'fixed', bottom: '24px', right: '24px', padding: '10px 20px', borderRadius: '6px', background: 'var(--sd-surface-deep, #1e293b)', color: proofToast.color, fontSize: '13px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.25)', zIndex: '9999', transition: 'opacity 0.3s' }">
        {{proofToast.message}}
      </div>
    </div>
  `,
  styles: [`
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes orbitor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
    .orbitor-dot-blink { animation: orbitor-blink 1.5s ease-in-out infinite; }
    :host { display: block; height: 100vh; }
  `]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  constructor(private el: ElementRef, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  // Style/Theme state
  styles = [...STYLES];
  activeStyle = 'vanilla';
  activeTheme = 'default';

  // Component state
  activeComponent: string | null = COMPONENT_NAMES.includes('briefing') ? 'briefing' : COMPONENT_NAMES[0];
  activeVariation: string | null = Object.keys((SAMPLES as any)[COMPONENT_NAMES.includes('briefing') ? 'briefing' : COMPONENT_NAMES[0]] ?? {}).sort()[0] ?? null;
  componentNames = COMPONENT_NAMES;

  // Paint state (EPRPP)
  paintState: Record<string, any> = {};
  private unlisten: (() => void) | null = null;

  // Proof state
  proofView = false;
  activeProof: string | null = '__none__';
  proofResults: Record<string, ProofResult> = {};
  proofRunning = false;
  proofProgress: { done: number; total: number } | null = null;
  proofToast: { message: string; color: string } | null = null;
  runningCommands = new Set<string>();
  proofDomains = PROOF_DOMAINS;

  // Ticket state
  tickets: Ticket[] = [];
  ticketView: 'open' | 'closed' | null = null;

  // Orbitor state
  orbitorView = false;
  activeOrbitor: string | null = null;
  orbitorTail: { entries: any[]; ts: string } | null = null;
  orbitorLoading = false;
  orbitorNames = ORBITOR_NAMES;
  private orbitorDebounce: any = null;

  // Shared inline styles
  labelStyle = { fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sd-text-muted, #6b7280)', display: 'block', marginBottom: '4px' };
  dropdownStyle = { width: '100%', padding: '4px 8px', fontSize: '13px', borderRadius: '4px', border: '1px solid var(--sd-border, #d1d5db)', background: 'var(--sd-surface-base, #fff)', color: 'var(--sd-text, #1a1a1a)' };
  sectionLabel = { fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sd-text-muted, #6b7280)', marginBottom: '8px', padding: '0 4px' };

  get openTicketCount() { return this.tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length; }
  get closedTicketCount() { return this.tickets.filter(t => t.status === 'closed' || t.status === 'proved').length; }

  ngOnInit() {
    loadStyle(this.activeStyle, this.activeTheme);
    this.refreshTickets();
    this.initFileWatcher();
  }

  ngOnDestroy() {
    if (this.unlisten) this.unlisten();
    if (this.orbitorDebounce) clearTimeout(this.orbitorDebounce);
  }

  ngAfterViewChecked() {
    // Bottom-anchor orbitor cell logs (newest at bottom)
    this.el.nativeElement.querySelectorAll('.orbitor-lines').forEach((n: HTMLElement) => { n.scrollTop = n.scrollHeight; });
  }

  // --- EPRPP File watcher ---
  private async initFileWatcher() {
    try {
      await invoke('write_state', { path: STATE_FILE, content: JSON.stringify(this.paintState) });
    } catch {}
    try {
      await invoke('watch_dir', { path: STATE_DIR });
    } catch {}
    try {
      await invoke('watch_dir', { path: HEARTBEATS_DIR });
    } catch {}
    try {
      this.unlisten = await listen('fs-change', async (payload: any) => {
        if (typeof payload === 'string' && payload.includes('heartbeats')) {
          if (this.orbitorView) {
            if (this.orbitorDebounce) clearTimeout(this.orbitorDebounce);
            this.orbitorDebounce = setTimeout(() => this.loadOrbitorTail(this.activeOrbitor), 1000);
          }
          return;
        }
        try {
          const raw = await invoke<string>('read_file_content', { path: STATE_FILE });
          this.paintState = JSON.parse(raw);
        } catch {}
      });
    } catch {}
  }

  // --- Style/Theme ---
  getThemes(): string[] {
    return THEMES[this.activeStyle] ?? ['default'];
  }

  selectStyle(s: string) {
    this.activeStyle = s;
    this.activeTheme = 'default';
    this.onStyleChange();
  }

  onStyleChange() {
    loadStyle(this.activeStyle, this.activeTheme);
  }

  // --- Sidebar item style ---
  itemStyle(active: boolean, indent = 0): Record<string, string> {
    return {
      display: 'block', width: '100%', textAlign: 'left', padding: '4px 8px',
      paddingLeft: (8 + indent * 14) + 'px',
      fontSize: '13px', border: 'none', borderRadius: '4px', cursor: 'pointer',
      background: active ? 'var(--sd-accent, #3b82f6)' : 'transparent',
      color: active ? 'var(--sd-text-inverse, #fff)' : 'var(--sd-text, #1a1a1a)',
      marginBottom: '2px',
    };
  }

  // --- Component navigation ---
  selectComponent(name: string) {
    const firstVar = Object.keys((SAMPLES as any)[name] ?? {}).sort()[0] ?? null;
    this.activeComponent = name;
    this.activeVariation = firstVar;
    this.proofView = false;
    this.activeProof = '__none__';
    this.ticketView = null;
    this.orbitorView = false;
  }

  selectVariation(comp: string, v: string) {
    this.activeComponent = comp;
    this.activeVariation = v;
    this.proofView = false;
    this.activeProof = '__none__';
    this.ticketView = null;
    this.orbitorView = false;
  }

  allVariations(comp: string): string[] {
    return Object.keys((SAMPLES as any)[comp] ?? {}).sort();
  }

  toShow(): [string, string][] {
    if (this.activeComponent && this.activeVariation && (SAMPLES as any)[this.activeComponent]?.[this.activeVariation]) {
      return [[this.activeComponent, this.activeVariation]];
    }
    if (this.activeComponent) {
      const firstVar = Object.keys((SAMPLES as any)[this.activeComponent] ?? {}).sort()[0];
      if (firstVar) return [[this.activeComponent, firstVar]];
    }
    return [];
  }

  cfg(comp: string, v: string): any {
    const config = (SAMPLES as any)[comp][v];
    return this.paintConfig(config);
  }

  /** Merge paint state into a ConfigBase's metadata */
  private paintConfig(config: any): any {
    if (!this.paintState || Object.keys(this.paintState).length === 0) return config;
    return { ...config, metadata: { ...config.metadata, ...this.paintState } };
  }

  // --- Event handling (EPRPP) ---
  handleEvent = async (event: SafeEvent) => {
    console.log('[event]', event.origin?.id, event.name, event.data);
    // Push to proof-viewer Events tabs
    document.querySelectorAll('[data-component="proof-viewer"]').forEach((pv) => {
      if ((pv as any).pushEvent) (pv as any).pushEvent(event);
    });
    // Skip file cycle for transient CSS-only events
    const cssOnlyEvents = new Set(['row:hover', 'row:leave', 'hover']);
    if (cssOnlyEvents.has(event.name)) return;
    // Call safedesk paint apply
    const component = event.component ?? '';
    try {
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
      await invoke<string>('safecli_run', { name: 'safezero', args });
    } catch (e) {
      console.warn('[paint]', e);
    }
  };

  // --- Orbitors ---
  showOrbitors(orbitor: string | null) {
    this.activeOrbitor = orbitor;
    this.orbitorView = true;
    this.proofView = false;
    this.activeProof = '__none__';
    this.ticketView = null;
    this.loadOrbitorTail(orbitor);
  }

  async wakeOrbitor(goalId: string | null) {
    try {
      const args = goalId ? ['orbit', 'wake', '--goal', goalId] : ['orbit', 'wake-all'];
      await invoke<string>('safecli_run', { name: 'safezero', args });
    } catch (e) { console.error('[orbitor] wake failed', e); }
  }

  async loadOrbitorTail(orbitor: string | null) {
    this.orbitorLoading = true;
    this.cdr.markForCheck();
    try {
      const args = ['orbit', 'tail', '--limit', '100'];
      if (orbitor) args.push('--goal', ORBITOR_GOALS[orbitor]);
      const { invoke: tauriInvoke } = await import('@tauri-apps/api/core');
      const out = await tauriInvoke<string>('safecli_run', { name: 'safezero', args });
      const parsed = JSON.parse(out);
      this.ngZone.run(() => {
        this.orbitorTail = { entries: parsed.entries ?? [], ts: parsed.ts };
        this.cdr.markForCheck();
      });
    } catch (e) {
      console.error('[orbitor] tail failed', e);
      this.ngZone.run(() => {
        this.orbitorTail = { entries: [], ts: new Date().toISOString() };
        this.cdr.markForCheck();
      });
    } finally {
      this.ngZone.run(() => {
        this.orbitorLoading = false;
        this.cdr.markForCheck();
      });
    }
  }

  orbitorName(e: any): string {
    return e.category ?? String(e.goal_id ?? '').replace(/^goal-/, '');
  }

  paddedEntries(): any[] {
    const e = this.orbitorTail?.entries ?? [];
    if (this.activeOrbitor) return e;
    return [...e, ...Array(Math.max(0, 24 - e.length)).fill(null)];
  }

  fmtEst(ts: string): string {
    return new Date(ts).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: true });
  }

  // --- Proofs ---
  openProofs(domain: string | null) {
    this.activeProof = domain;
    this.proofView = true;
    this.ticketView = null;
    this.orbitorView = false;
  }

  getActiveCommands(): string[] {
    if (this.activeProof) {
      return PROOF_DOMAINS.find(d => d.label === this.activeProof)?.commands ?? [];
    }
    return ALL_PROVE_COMMANDS;
  }

  getVisibleDomains(): ProofDomain[] {
    if (this.activeProof) return PROOF_DOMAINS.filter(d => d.label === this.activeProof);
    return PROOF_DOMAINS;
  }

  getActiveTotals() {
    const cmds = this.getActiveCommands();
    const total = cmds.reduce((s, c) => s + (this.proofResults[c]?.total ?? 0), 0);
    const passed = cmds.reduce((s, c) => s + (this.proofResults[c]?.passed ?? 0), 0);
    const failed = cmds.reduce((s, c) => s + (this.proofResults[c]?.failed ?? 0), 0);
    return { total, passed, failed };
  }

  getDomainTotals(domain: ProofDomain) {
    const total = domain.commands.reduce((s, c) => s + (this.proofResults[c]?.total ?? 0), 0);
    const passed = domain.commands.reduce((s, c) => s + (this.proofResults[c]?.passed ?? 0), 0);
    return { total, passed };
  }

  isCommandRunning(cmd: string): boolean {
    return this.runningCommands.has(cmd);
  }

  getCheckGroups(cmd: string): { name: string; passed: number; total: number }[] {
    const checks = this.proofResults[cmd]?.checks;
    if (!checks) return [];
    const groups = [...new Set(checks.map((c: any) => c.group))];
    return groups.map(group => {
      const groupChecks = checks.filter((c: any) => c.group === group);
      const passed = groupChecks.filter((c: any) => c.status === 'pass').length;
      return { name: group, passed, total: groupChecks.length };
    });
  }

  async runProofs(commands: string[]) {
    this.proofRunning = true;
    this.proofProgress = { done: 0, total: commands.length };
    // Clear previous results for these commands
    for (const c of commands) delete this.proofResults[c];
    this.runningCommands = new Set(commands);
    let doneCount = 0;
    try {
      const results = await Promise.all(
        commands.map(async cmd => {
          try {
            const { invoke: tauriInvoke } = await import('@tauri-apps/api/core');
            const out = await tauriInvoke<string>('safecli_run', { name: 'safezero', args: ['prove', cmd] });
            const parsed = JSON.parse(out);
            const entry: ProofResult = { passed: parsed.passed ?? 0, total: parsed.total ?? 0, failed: parsed.failed ?? 0, checks: parsed.checks, failures: parsed.failures };
            this.ngZone.run(() => {
              this.proofResults = { ...this.proofResults, [cmd]: entry };
              this.runningCommands = new Set([...this.runningCommands].filter(c => c !== cmd));
              doneCount++;
              this.proofProgress = { done: doneCount, total: commands.length };
              this.cdr.markForCheck();
            });
            return [cmd, entry] as [string, ProofResult];
          } catch {
            const entry: ProofResult = { passed: 0, total: 1, failed: 1 };
            this.ngZone.run(() => {
              this.proofResults = { ...this.proofResults, [cmd]: entry };
              this.runningCommands = new Set([...this.runningCommands].filter(c => c !== cmd));
              doneCount++;
              this.proofProgress = { done: doneCount, total: commands.length };
              this.cdr.markForCheck();
            });
            return [cmd, entry] as [string, ProofResult];
          }
        })
      );
      // Toast summary
      const totalP = results.reduce((s, [, v]) => s + (v.passed ?? 0), 0);
      const totalT = results.reduce((s, [, v]) => s + (v.total ?? 0), 0);
      const totalF = results.reduce((s, [, v]) => s + (v.failed ?? 0), 0);
      const pass = totalF === 0;
      this.proofToast = { message: `${totalP}/${totalT} checks ${pass ? 'passed PASS' : `— ${totalF} failed FAIL`}`, color: pass ? 'var(--sd-success, #15803d)' : 'var(--sd-danger, #dc2626)' };
      this.cdr.markForCheck();
      setTimeout(() => { this.proofToast = null; this.cdr.markForCheck(); }, 4000);
    } finally {
      this.proofRunning = false;
      this.runningCommands = new Set();
      this.proofProgress = null;
      this.cdr.markForCheck();
    }
  }

  // --- Tickets ---
  openTickets(view: 'open' | 'closed') {
    this.ticketView = view;
    this.proofView = false;
    this.activeProof = '__none__';
    this.orbitorView = false;
  }

  filteredTickets(): Ticket[] {
    if (this.ticketView === 'open') {
      return this.tickets.filter(t => t.status === 'open' || t.status === 'in-progress');
    }
    return this.tickets.filter(t => t.status === 'closed' || t.status === 'proved')
      .sort((a, b) => b.updated.localeCompare(a.updated));
  }

  ticketStatusColor(status: string): string {
    if (status === 'open') return 'var(--sd-accent, #2563eb)';
    if (status === 'closed') return 'var(--sd-success, #15803d)';
    return 'var(--sd-text-muted, #475569)';
  }

  formatParams(params: Record<string, any>): string {
    return Object.entries(params).map(([k, v]) => `${k}=${v}`).join(' ');
  }

  async refreshTickets() {
    try {
      const t = await listAllTickets();
      console.log('[tickets] loaded', t.length);
      this.tickets = t;
    } catch (e) {
      console.error('[tickets] load failed', e);
    }
  }

  async proveTicket(t: Ticket) {
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
        const out = await tauriInvoke<string>('safecli_run', { name: 'safezero', args: parseCmd(t.test.command) });
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

  async startTicket(t: Ticket) {
    await updateTicket({ ...t, status: 'in-progress' });
    this.refreshTickets();
  }

  async closeTicket(t: Ticket) {
    await updateTicket({ ...t, status: 'closed', resolution: 'Closed without resolution' });
    this.refreshTickets();
  }

  async createTicketForComponent(comp: string) {
    const titleEl = document.getElementById(`ticket-title-${comp}`) as HTMLInputElement;
    const typeEl = document.getElementById(`ticket-type-${comp}`) as HTMLSelectElement;
    if (!titleEl?.value.trim()) return;
    await createTicket(comp, typeEl.value as TicketType, titleEl.value.trim(), titleEl.value.trim());
    titleEl.value = '';
    this.refreshTickets();
  }
}
