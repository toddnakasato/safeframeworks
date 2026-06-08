/**
 * SafeChart — Angular chart component.
 * Implements chart contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-chart',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
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
