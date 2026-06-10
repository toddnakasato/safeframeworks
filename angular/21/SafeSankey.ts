/**
 * SafeSankey — Angular sankey component.
 * Renders via shared-mapping sankey builder (./sankey) — identical across frameworks.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { renderSafeSankey, sankeyData } from './sankey';

@Component({
  selector: 'safe-sankey',
  standalone: true,
  template: `
    <div data-role="title">{{ config.metadata.title || '' }}</div>
    <svg #sankeySvg data-sankey-svg></svg>
  `,
  host: {
    '[attr.data-component]': "'sankey'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeSankeyComponent implements AfterViewInit {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('sankeySvg') svgRef!: ElementRef<SVGSVGElement>;

  ngAfterViewInit() {
    renderSafeSankey(this.svgRef.nativeElement, this.config, sankeyData(this.config), this.onEvent);
  }
}
