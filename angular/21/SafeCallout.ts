/**
 * SafeCallout — Angular callout component.
 * Implements callout contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-callout',
  standalone: true,
  template: `
    <div data-role="message">{{ config.metadata.message || 'Callout' }}</div>
  `,
  host: {
    '[attr.data-component]': "'callout'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-position]': 'config.metadata.position'
  }
})
export class SafeCalloutComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
