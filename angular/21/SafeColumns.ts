/**
 * SafeColumns — Angular columns component.
 * Implements columns contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-columns',
  standalone: true,
  template: `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sd-space-md,8px)">
      <div style="padding:8px;border:1px solid var(--sd-border,#e5e7eb);border-radius:4px"><ng-content></ng-content>Column 1</div>
      <div style="padding:8px;border:1px solid var(--sd-border,#e5e7eb);border-radius:4px">Column 2</div>
    </div>
  `,
  host: {
    '[attr.data-component]': "'columns'",
    '[attr.data-spacing]': 'config.metadata.spacing',
    '[attr.data-radius]': 'config.metadata.radius',
    '[attr.data-surface]': 'config.metadata.surface'
  }
})
export class SafeColumnsComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
