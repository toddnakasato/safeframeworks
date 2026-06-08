/**
 * SafeColumns — Angular columns component.
 * Implements columns contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-columns',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
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
