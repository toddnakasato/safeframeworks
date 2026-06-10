/**
 * SafeGrid — Angular grid component.
 * Renders via shared-mapping grid builder (./grid) — identical across
 * frameworks. Structure + data-* only. No hardcoded CSS.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeGrid } from './grid';

@Component({
  selector: 'safe-grid',
  standalone: true,
  template: `<div #gridContainer></div>`
})
export class SafeGridComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('gridContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeGrid(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
