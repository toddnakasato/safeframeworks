import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
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
    this.root = createSafeStoryFlow(this.containerRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}
