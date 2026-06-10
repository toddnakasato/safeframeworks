/**
 * SafeDragDrop — Angular drag-and-drop (generic / file / palette).
 * Renders via shared-mapping dragdrop builder (./dragdrop) — identical across
 * frameworks. Structure + data-* only.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeDragDrop } from './dragdrop';

@Component({
  selector: 'safe-drag-drop',
  standalone: true,
  template: `<div #dragDropContainer></div>`
})
export class SafeDragDropComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('dragDropContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeDragDrop(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
