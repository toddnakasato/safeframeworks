/**
 * SafeSheet — Angular sheet component.
 * Implements sheet contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-sheet',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[attr.data-component]': "'sheet'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-spacing]': 'config.metadata.spacing',
    '[attr.data-surface]': 'config.metadata.surface'
  }
})
export class SafeSheetComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
