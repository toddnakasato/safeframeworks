/**
 * SafeTree — Angular tree component.
 * Renders via shared-mapping tree builder (./tree) — identical across
 * frameworks. Structure + data-* only. No hardcoded CSS.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeTree } from './tree';

@Component({
  selector: 'safe-tree',
  standalone: true,
  template: `<div #treeContainer></div>`
})
export class SafeTreeComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('treeContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeTree(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
