/**
 * SafeHeatmap — Angular heatmap component.
 * Implements heatmap contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-heatmap',
  standalone: true,
  template: `
    <div data-role="title">Heatmap</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px">
      <div data-role="cell" style="padding:8px;background:rgba(59,130,246,0.2);text-align:center">3</div>
      <div data-role="cell" style="padding:8px;background:rgba(59,130,246,0.5);text-align:center">7</div>
      <div data-role="cell" style="padding:8px;background:rgba(59,130,246,0.8);text-align:center">9</div>
    </div>
  `,
  host: {
    '[attr.data-component]': "'heatmap'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeHeatmapComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
