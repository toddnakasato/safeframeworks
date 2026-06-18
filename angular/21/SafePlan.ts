import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { buildComponent } from '../../utils/render';

@Component({ selector: 'safe-plan', standalone: true, template: `<div #planContainer></div>` })
export class SafePlanComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('planContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;
  ngAfterViewInit() { this.root = buildComponent(this.config, this.onEvent); this.containerRef.nativeElement.appendChild(this.root); }
  ngOnDestroy() { this.root?.remove(); this.root = null; }
}