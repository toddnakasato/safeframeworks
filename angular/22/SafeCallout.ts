/**
 * SafeCallout — Angular callout component.
 * Renders via shared-mapping callout builder (./callout) — identical across
 * frameworks. Structure + data-* only. No hardcoded CSS.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeCallout } from './callout';

@Component({
  selector: 'safe-callout',
  standalone: true,
  template: `<div #calloutContainer></div>`
})
export class SafeCalloutComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('calloutContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeCallout(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
