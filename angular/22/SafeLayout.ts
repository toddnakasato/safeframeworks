import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeFireContext } from 'safecontracts';
import { buildPayloadViaCli } from '../../utils/payload-delegate';
import { createSafeLayout } from '../../builders/layout';
import { buildComponent } from '../../utils/render';

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
    const _ctx = createSafeFireContext(this.config, this.onEvent, buildPayloadViaCli);
    this.root = createSafeLayout(this.containerRef.nativeElement, this.config, _ctx, buildComponent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
