/**
 * SafeButton — Angular button component.
 * Implements button contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-button',
  standalone: true,
  imports: [NgIf],
  template: `
    <span *ngIf="config.metadata.label" data-role="label">{{ config.metadata.label }}</span>
  `,
  host: {
    '[attr.data-component]': "'button'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-size]': 'config.metadata.size',
    '[attr.data-disabled]': 'config.metadata.disabled',
    '[attr.data-loading]': 'config.metadata.loading',
    '[attr.data-full-width]': 'config.metadata.fullWidth',
    '[attr.data-icon-only]': 'config.metadata.iconOnly',
    '[attr.data-selected]': 'config.metadata.selected',
    '[attr.data-status]': 'config.metadata.status',
    '[attr.data-group-variant]': 'config.metadata.groupVariant',
    '[attr.data-group-direction]': 'config.metadata.groupDirection'
  }
})
export class SafeButtonComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
