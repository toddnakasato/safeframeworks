/**
 * SafeToggle — Angular toggle component.
 * Renders via shared-mapping toggle builder (./toggle) — identical across
 * frameworks. Structure + data-* only. No hardcoded CSS.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeToggle } from './toggle';

@Component({
  selector: 'safe-toggle',
  standalone: true,
  template: `<div #toggleContainer></div>`
})
export class SafeToggleComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('toggleContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeToggle(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
