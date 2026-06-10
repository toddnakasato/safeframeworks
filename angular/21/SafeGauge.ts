/**
 * SafeGauge — Angular D3 radial KPI gauge.
 * Renders via shared-mapping gauge builder (./gauge) — identical across
 * frameworks. Structure + data-* only.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeGauge } from './gauge';

@Component({
  selector: 'safe-gauge',
  standalone: true,
  template: `<div #gaugeContainer></div>`
})
export class SafeGaugeComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('gaugeContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeGauge(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
