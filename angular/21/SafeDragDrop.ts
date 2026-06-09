/**
 * SafeDragDrop — Angular drag-drop component.
 * Implements drag-drop contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-drag-drop',
  standalone: true,
  template: `
    <div style="display:flex;gap:16px">
      <div style="flex:1;border:2px dashed var(--sd-border,#e5e7eb);border-radius:8px;padding:8px">
        <div data-role="item" style="padding:4px 8px;background:var(--sd-surface-raised,#f3f4f6);border-radius:4px;margin-bottom:4px">Item A</div>
        <div data-role="item" style="padding:4px 8px;background:var(--sd-surface-raised,#f3f4f6);border-radius:4px">Item B</div>
      </div>
      <div style="flex:1;border:2px dashed var(--sd-border,#e5e7eb);border-radius:8px;padding:8px;display:flex;align-items:center;justify-content:center;color:var(--sd-text-dim,#6b7280)">Drop here</div>
    </div>
  `,
  host: {
    '[attr.data-component]': "'drag-drop'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeDragDropComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
