import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeFireContext } from 'safecontracts';
import { buildPayloadViaCli } from '../../utils/payload-delegate';
import { createSafeWeek } from '../../builders/week';

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
    const _ctx = createSafeFireContext(this.config, this.onEvent, buildPayloadViaCli);
    this.root = createSafeWeek(this.containerRef.nativeElement, this.config, _ctx);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
