import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeFireContext } from 'safecontracts';
import { buildPayloadViaCli } from '../../utils/payload-delegate';
import { createSafeStoryFlow } from '../../builders/storyflow';

@Component({
  selector: 'safe-story-flow',
  standalone: true,
  template: `<div #container></div>`
})
export class SafeStoryFlowComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('container') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    const _ctx = createSafeFireContext(this.config, this.onEvent, buildPayloadViaCli);
    this.root = createSafeStoryFlow(this.containerRef.nativeElement, this.config, _ctx);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
