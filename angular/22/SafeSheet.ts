/**
 * SafeSheet — Angular sheet component.
 * Renders via shared-mapping sheet builder (./sheet) — identical across
 * frameworks (HyperFormula calc engine). Structure + data-* only.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeSheet } from './sheet';

@Component({
  selector: 'safe-sheet',
  standalone: true,
  template: `<div #sheetContainer></div>`
})
export class SafeSheetComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('sheetContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = createSafeSheet(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
