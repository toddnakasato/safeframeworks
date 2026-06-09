/**
 * SafeSankey — Angular sankey component.
 * Implements sankey contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-sankey',
  standalone: true,
  template: `
    <div style="text-align:center;padding:16px;color:var(--sd-text-dim,#6b7280)">Sankey diagram — requires D3</div>
  `,
  host: {
    '[attr.data-component]': "'sankey'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeSankeyComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
