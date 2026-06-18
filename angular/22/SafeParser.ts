import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { buildComponent } from '../../utils/render';

@Component({
  selector: 'safe-parser',
  standalone: true,
  template: `<div #parserContainer></div>`
})
export class SafeParserComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('parserContainer') containerRef!: ElementRef<HTMLElement>;
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