/**
 * SafeFunnel — Angular D3 funnel/conversion bars.
 * Renders via shared-mapping funnel builder (./funnel) — identical across
 * frameworks. Structure + data-* only.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeFunnel } from './funnel';

@Component({
  selector: 'safe-funnel',
  standalone: true,
  template: `<div #funnelContainer></div>`
})
export class SafeFunnelComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('funnelContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeFunnel(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
