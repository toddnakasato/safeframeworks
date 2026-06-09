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
    <label data-role="toggle-label">
      <input type="checkbox" data-role="toggle-input" [checked]="config.metadata.checked" [disabled]="config.metadata.disabled" />
      <span data-role="toggle-slider"></span>
      <span *ngIf="config.metadata.label" data-role="label">{{ config.metadata.label }}</span>
    </label>
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
