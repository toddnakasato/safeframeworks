/**
 * SafeNav — Angular nav component.
 * navStyle "accordion" renders via shared-mapping nav builder (./nav) —
 * identical across frameworks (figma Shopfront design).
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeNav } from './nav';

@Component({
  selector: 'safe-nav',
  standalone: true,
  template: `<div #navContainer data-nav-host></div>`,
  host: {
    '[attr.data-component]': "'nav'",
    '[attr.data-nav-style]': 'config.metadata.navStyle'
  }
})
export class SafeNavComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('navContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeNav(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
