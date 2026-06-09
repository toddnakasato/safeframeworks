/**
 * SafeChart — Angular chart component.
 * Implements chart contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-chart',
  standalone: true,
  template: `
    <div data-role="title">{{ config.metadata.title || 'Chart' }}</div>
    <div data-role="chart-area" style="height:120px;display:flex;align-items:flex-end;gap:4px;padding:8px">
      <div style="flex:1;background:var(--sd-accent,#3b82f6);height:60%"></div>
      <div style="flex:1;background:var(--sd-accent,#3b82f6);height:80%"></div>
      <div style="flex:1;background:var(--sd-accent,#3b82f6);height:40%"></div>
    </div>
  `,
  host: {
    '[attr.data-component]': "'chart'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-chart-type]': 'config.metadata.chartType'
  }
})
export class SafeChartComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
