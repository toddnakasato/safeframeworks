/**
 * SafeFunnel — Angular funnel component.
 * Implements funnel contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-funnel',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[attr.data-component]': "'funnel'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeFunnelComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
