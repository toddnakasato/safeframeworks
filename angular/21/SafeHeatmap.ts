/**
 * SafeHeatmap — Angular grid of value-colored cells.
 * Renders via shared-mapping heatmap builder (./heatmap) — identical across
 * frameworks. Structure + data-* only.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeHeatmap } from './heatmap';

@Component({
  selector: 'safe-heatmap',
  standalone: true,
  template: `<div #heatmapContainer></div>`
})
export class SafeHeatmapComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('heatmapContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeHeatmap(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
