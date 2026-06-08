/**
 * SafeGauge — Angular gauge component.
 * Implements gauge contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-gauge',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[attr.data-component]': "'gauge'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeGaugeComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
