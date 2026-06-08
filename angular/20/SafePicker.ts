/**
 * SafePicker — Angular picker component.
 * Implements picker contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-picker',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[attr.data-component]': "'picker'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafePickerComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
