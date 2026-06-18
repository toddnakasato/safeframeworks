import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { buildComponent } from '../../utils/render';

@Component({
  selector: 'safe-flow',
  standalone: true,
  template: `
    <div data-role="title">{{ config.metadata.title || '' }}</div>
    <svg #flowSvg data-flow-svg></svg>
  `
})
export class SafeFlowComponent implements AfterViewInit {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('flowSvg') svgRef!: ElementRef<SVGSVGElement>;

  ngAfterViewInit() {
    createSafeFlow(this.svgRef.nativeElement, this.config, flowData(this.config), this.onEvent);
  }
}