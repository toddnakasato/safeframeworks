/**
 * SafeToggle — Angular toggle component.
 * Implements toggle contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-toggle',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[attr.data-component]': "'toggle'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-disabled]': 'config.metadata.disabled',
    '[attr.data-label-position]': 'config.metadata.labelPosition'
  }
})
export class SafeToggleComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
