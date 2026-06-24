/**
 * SafeRenderer (angular/22) — thin mount point. Config in, builder out.
 *
 * Rule: only layout and columns have Angular-native handling (need recursive
 * safe-renderer children). Every other component delegates to SafeDomComponent
 * which calls buildComponent — one builder, one path, no reinvention.
 */
import { Component, Input, OnChanges, ElementRef, AfterViewInit, OnDestroy } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import type { ConfigBase, OnSafeEvent, RenderPlan } from "safecontracts";
import { buildRenderPlan, stampHandler, COMPONENT_REGISTRY } from "safecontracts";
import { buildComponent } from "../../utils/render";

const COMPOSITION = new Set(["layout", "columns", "button"]);
const KNOWN = new Set([...COMPONENT_REGISTRY, ...COMPOSITION]);

/** Mounts any component via buildComponent (DOM builder). No reinvention. */
@Component({
  selector: "safe-dom",
  standalone: true,
  template: `<div></div>`,
})
export class SafeDomComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;

  private root: HTMLElement | null = null;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.root = buildComponent(this.config, this.onEvent) as HTMLElement;
    if (this.root) this.el.nativeElement.firstChild.appendChild(this.root);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}

@Component({
  selector: "safe-renderer",
  standalone: true,
  imports: [NgFor, NgIf, SafeDomComponent],
  template: `
    <div *ngIf="p && p.kind === 'unknown'" data-component="unknown"
         style="padding: var(--sd-space-md); color: var(--sd-text-dim)">
      Unknown component: {{ p.component }}
    </div>

    <div *ngIf="p && p.kind === 'component' && p.component === 'layout'"
         data-component="layout" [attr.data-variant]="variant"
         style="display: grid; min-height: 100vh">
      <div *ngFor="let c of p.children" [attr.data-region]="c.key">
        <safe-renderer [plan]="c.plan" [onEvent]="onEvent"></safe-renderer>
      </div>
    </div>

    <div *ngIf="p && p.kind === 'component' && p.component === 'columns'"
         data-component="columns"
         style="display: grid; gap: var(--sd-space-md)">
      <div *ngFor="let c of p.children" [attr.data-child]="c.key">
        <safe-renderer [plan]="c.plan" [onEvent]="onEvent"></safe-renderer>
      </div>
    </div>

    <safe-dom
      *ngIf="p && p.kind === 'component' && p.component !== 'layout' && p.component !== 'columns'"
      [config]="p.config"
      [onEvent]="stampedOnEvent">
    </safe-dom>
  `,
})
export class SafeRendererComponent implements OnChanges {
  @Input() config?: ConfigBase;
  @Input() plan?: RenderPlan;
  @Input() onEvent?: OnSafeEvent;

  p?: RenderPlan;
  variant?: string;
  stampedOnEvent?: OnSafeEvent;

  ngOnChanges() {
    this.p = this.plan ?? (this.config ? buildRenderPlan(this.config, KNOWN) : undefined);
    if (!this.p) return;
    const handler = this.p.handler;
    const onEvent = this.onEvent;
    this.stampedOnEvent = onEvent ? (event) => onEvent(stampHandler(event, handler)) : undefined;
    this.variant = this.p.config.metadata?.["variant"] as string | undefined;
  }
}
