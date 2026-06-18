import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { buildComponent } from '../../utils/render';

@Component({ selector: 'safe-chart', standalone: true, template: `<div #chartContainer></div>` })
export class SafeChartComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('chartContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = buildComponent(this.config, this.onEvent);
    this.containerRef.nativeElement.appendChild(this.root);
  }

  ngOnDestroy() { this.root?.remove(); this.root = null; }
}