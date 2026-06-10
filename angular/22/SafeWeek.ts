/**
 * SafeWeek — Angular weekly planner.
 * Renders via shared-mapping week builder (./week) — identical across
 * frameworks (figma Atom Week Specs). Structure + data-* only.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeWeek } from './week';

@Component({
  selector: 'safe-week',
  standalone: true,
  template: `<div #weekContainer></div>`
})
export class SafeWeekComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('weekContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeWeek(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
