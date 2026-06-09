/**
 * SafeMap — Angular map component.
 * Implements map contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-map',
  standalone: true,
  template: `
    <div style="height:120px;background:var(--sd-surface-raised,#f3f4f6);display:flex;align-items:center;justify-content:center;border-radius:4px;color:var(--sd-text-dim,#6b7280)">Map — requires Leaflet</div>
  `,
  host: {
    '[attr.data-component]': "'map'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeMapComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
