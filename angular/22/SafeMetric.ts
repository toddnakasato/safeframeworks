import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeFireContext } from 'safecontracts';
import { buildPayloadViaCli } from '../../utils/payload-delegate';
import { createSafeMetric } from '../../builders/metric';

@Component({
  selector: 'safe-metric',
  standalone: true,
  template: `<div #container></div>`
})
export class SafeMetricComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('container') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    const _ctx = createSafeFireContext(this.config, this.onEvent, buildPayloadViaCli);
    this.root = createSafeMetric(this.containerRef.nativeElement, this.config, _ctx);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
