import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeFireContext } from 'safecontracts';
import { buildPayloadViaCli } from '../../utils/payload-delegate';
import { createSafeToggle } from '../../builders/toggle';

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
    const _ctx = createSafeFireContext(this.config, this.onEvent, buildPayloadViaCli);
    this.root = createSafeToggle(this.containerRef.nativeElement, this.config, _ctx);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
