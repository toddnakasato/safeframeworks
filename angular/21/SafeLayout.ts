/**
 * SafeLayout — Angular named-region composition.
 * Renders via shared-mapping layout builder (./layout) — identical across
 * frameworks. Structure + data-* only.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeLayout } from './layout';

@Component({
  selector: 'safe-layout',
  standalone: true,
  template: `<div #layoutContainer></div>`
})
export class SafeLayoutComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('layoutContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeLayout(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
