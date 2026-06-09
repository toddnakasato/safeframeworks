/**
 * SafeLayout — Angular layout component.
 * Implements layout contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-layout',
  standalone: true,
  template: `
    <div style="display:flex;flex-direction:column;gap:var(--sd-space-md,8px);padding:8px">
      <ng-content></ng-content>
      <div style="color:var(--sd-text-dim,#6b7280);font-size:12px">Layout variant: {{ config.metadata.variant }}</div>
    </div>
  `,
  host: {
    '[attr.data-component]': "'layout'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeLayoutComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
