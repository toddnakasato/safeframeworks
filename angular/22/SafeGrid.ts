/**
 * SafeGrid — Angular grid component.
 * Implements grid contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-grid',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
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
