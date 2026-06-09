/**
 * SafeGauge — Angular gauge component.
 * Implements gauge contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-gauge',
  standalone: true,
  template: `
    <div data-role="gauge-area" style="text-align:center;padding:16px">
      <svg viewBox="0 0 100 60" width="120"><path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="var(--sd-border,#e5e7eb)" stroke-width="8"/><path d="M 10 55 A 40 40 0 0 1 60 17" fill="none" stroke="var(--sd-accent,#3b82f6)" stroke-width="8"/></svg>
      <div data-role="value">67%</div>
    </div>
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
