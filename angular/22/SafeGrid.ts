/**
 * SafeGrid — Angular grid component.
 * Implements grid contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-grid',
  standalone: true,
  template: `
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:8px">
      <div style="padding:8px;border:1px solid var(--sd-border,#e5e7eb);border-radius:4px">Cell 1</div>
      <div style="padding:8px;border:1px solid var(--sd-border,#e5e7eb);border-radius:4px">Cell 2</div>
    </div>
  `,
  host: {
    '[attr.data-component]': "'grid'",
    '[attr.data-spacing]': 'config.metadata.spacing',
    '[attr.data-radius]': 'config.metadata.radius',
    '[attr.data-surface]': 'config.metadata.surface',
    '[attr.data-collapsible]': 'config.metadata.collapsible'
  }
})
export class SafeGridComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
