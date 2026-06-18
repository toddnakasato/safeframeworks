import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { buildComponent } from '../../utils/render';

@Component({
  selector: 'safe-nav',
  standalone: true,
  template: `<div #navContainer data-nav-host></div>`,
  host: {
    '[attr.data-component]': "'nav'",
    '[attr.data-nav-style]': 'config.metadata.navStyle'
  }
})
export class SafeNavComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('navContainer') containerRef!: ElementRef<HTMLElement>;
  private root: HTMLElement | null = null;

  ngAfterViewInit() {
    this.root = buildComponent(this.config, this.onEvent);
    this.containerRef.nativeElement.appendChild(this.root);
  }

  ngOnDestroy() {
    this.root?.remove();
    this.root = null;
  }
}