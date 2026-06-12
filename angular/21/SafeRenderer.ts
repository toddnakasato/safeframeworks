/**
 * SafeRenderer (angular/21) — mechanical translator of the contract's
 * RenderPlan. Same walk as every framework; Angular standalone component
 * with NgComponentOutlet dispatch and template recursion.
 */
import { Component, Input, OnChanges } from "@angular/core";
import { NgFor, NgIf, NgComponentOutlet, NgStyle } from "@angular/common";
import type { ConfigBase, OnSafeEvent, RenderPlan } from "safecontracts";
import { buildRenderPlan, stampHandler } from "safecontracts";
import { SafeCardComponent } from "./SafeCard";
import { SafeButtonComponent } from "./SafeButton";
import { SafeTableComponent } from "./SafeTable";
import { SafeTreeComponent } from "./SafeTree";
import { SafeSheetComponent } from "./SafeSheet";
import { SafeChartComponent } from "./SafeChart";
import { SafeHeatmapComponent } from "./SafeHeatmap";
import { SafeGaugeComponent } from "./SafeGauge";
import { SafeFunnelComponent } from "./SafeFunnel";
import { SafeFlowComponent } from "./SafeFlow";
import { SafeHierarchyComponent } from "./SafeHierarchy";
import { SafeTimelineComponent } from "./SafeTimeline";
import { SafeMapComponent } from "./SafeMap";
import { SafeCalendarComponent } from "./SafeCalendar";
import { SafeToggleComponent } from "./SafeToggle";
import { SafeWeekComponent } from "./SafeWeek";
import { SafeChatComponent } from "./SafeChat";
import { SafeTabsComponent } from "./SafeTabs";
import { SafeCalloutComponent } from "./SafeCallout";
import { SafeDragDropComponent } from "./SafeDragDrop";
import { SafeGridComponent } from "./SafeGrid";
import { SafeInputComponent } from "./SafeInput";
import { SafeListComponent } from "./SafeList";
import { SafePickerComponent } from "./SafePicker";
import { SafeNavComponent } from "./SafeNav";

const LEAVES: Record<string, any> = {
  card: SafeCardComponent, button: SafeButtonComponent, table: SafeTableComponent,
  tree: SafeTreeComponent, sheet: SafeSheetComponent, chart: SafeChartComponent,
  heatmap: SafeHeatmapComponent, gauge: SafeGaugeComponent, funnel: SafeFunnelComponent,
  flow: SafeFlowComponent, hierarchy: SafeHierarchyComponent, timeline: SafeTimelineComponent,
  map: SafeMapComponent, calendar: SafeCalendarComponent, toggle: SafeToggleComponent,
  week: SafeWeekComponent, chat: SafeChatComponent, tabs: SafeTabsComponent,
  callout: SafeCalloutComponent, "drag-drop": SafeDragDropComponent, grid: SafeGridComponent,
  input: SafeInputComponent, list: SafeListComponent, picker: SafePickerComponent,
  nav: SafeNavComponent,
};
const KNOWN = new Set([...Object.keys(LEAVES), "layout", "columns"]);

@Component({
  selector: "safe-renderer",
  standalone: true,
  imports: [NgFor, NgIf, NgComponentOutlet, NgStyle],
  template: `
    <div *ngIf="p && p.kind === 'unknown'" data-component="unknown"
         style="padding: var(--sd-space-md); color: var(--sd-text-dim)">
      Unknown component: {{ p.component }}
    </div>

    <div *ngIf="p && p.kind === 'component' && p.component === 'layout'"
         data-component="layout" [attr.data-variant]="variant"
         [ngStyle]="{ display: 'grid', 'grid-template-columns': columns, 'min-height': '100vh' }">
      <div *ngFor="let c of p.children" [attr.data-region]="c.key">
        <safe-renderer [plan]="c.plan" [onEvent]="onEvent"></safe-renderer>
      </div>
    </div>

    <div *ngIf="p && p.kind === 'component' && p.component === 'columns'"
         data-component="columns"
         [ngStyle]="{ display: 'grid', 'grid-template-columns': columns, gap: 'var(--sd-space-md)' }">
      <div *ngFor="let c of p.children" [attr.data-child]="c.key">
        <safe-renderer [plan]="c.plan" [onEvent]="onEvent"></safe-renderer>
      </div>
    </div>

    <ng-container *ngIf="p && p.kind === 'component' && p.component !== 'layout' && p.component !== 'columns'">
      <ng-container *ngComponentOutlet="impl; inputs: implInputs"></ng-container>
      <div *ngIf="p.children.length > 0" data-role="children">
        <safe-renderer *ngFor="let c of p.children" [plan]="c.plan" [onEvent]="onEvent"></safe-renderer>
      </div>
    </ng-container>
  `,
})
export class SafeRendererComponent implements OnChanges {
  @Input() config?: ConfigBase;
  @Input() plan?: RenderPlan;
  @Input() onEvent?: OnSafeEvent;

  p?: RenderPlan;
  impl: any;
  implInputs: Record<string, any> = {};
  columns = "1fr";
  variant?: string;

  ngOnChanges() {
    this.p = this.plan ?? (this.config ? buildRenderPlan(this.config, KNOWN) : undefined);
    if (!this.p) return;
    const handler = this.p.handler;
    const onEvent = this.onEvent;
    const stamped: OnSafeEvent | undefined = onEvent ? (event) => onEvent(stampHandler(event, handler)) : undefined;
    this.impl = LEAVES[this.p.component];
    this.implInputs = { config: this.p.config, onEvent: stamped };
    this.columns = (this.p.config.metadata?.["columns"] as string) ?? "1fr";
    this.variant = this.p.config.metadata?.["variant"] as string | undefined;
  }
}
