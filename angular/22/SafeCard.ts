/**
 * SafeCard — Angular card component.
 * Implements card contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="config.metadata.header" data-role="header">{{ config.metadata.header }}</div>
    <ng-content></ng-content>
  `,
  host: {
    '[attr.data-component]': "'card'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-surface]': 'config.metadata.surface',
    '[attr.data-spacing]': 'config.metadata.spacing',
    '[attr.data-radius]': 'config.metadata.radius',
    '[attr.data-density]': 'config.metadata.density'
  }
})
export class SafeCardComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
