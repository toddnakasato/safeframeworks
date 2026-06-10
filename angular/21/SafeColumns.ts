/**
 * SafeColumns — Angular 12-column grid positioning.
 * Renders via shared-mapping columns builder (./columns) — identical across
 * frameworks. Structure + data-* only.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeColumns } from './columns';

@Component({
  selector: 'safe-columns',
  standalone: true,
  template: `<div #columnsContainer></div>`
})
export class SafeColumnsComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('columnsContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeColumns(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
