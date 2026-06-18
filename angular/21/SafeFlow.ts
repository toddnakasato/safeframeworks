import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { buildComponent } from '../../utils/render';

@Component({ selector: 'safe-flow', standalone: true, template: `<div #flowContainer></div>` })
export class SafeFlowComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('flowContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = buildComponent(this.config, this.onEvent);
    this.containerRef.nativeElement.appendChild(this.root);
  }

  ngOnDestroy() { this.root?.remove(); this.root = null; }
}