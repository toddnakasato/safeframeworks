/**
 * SafeDragDrop — Angular drag-drop component.
 * Implements drag-drop contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-drag-drop',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
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
