import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeFireContext } from 'safecontracts';
import { buildPayloadViaCli } from '../../utils/payload-delegate';
import { createSafeTree } from '../../builders/tree';

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
    const _ctx = createSafeFireContext(this.config, this.onEvent, buildPayloadViaCli);
    this.root = createSafeTree(this.containerRef.nativeElement, this.config, _ctx);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
