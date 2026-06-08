/**
 * SafeWeek — Angular week component.
 * Implements week contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-week',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[attr.data-component]': "'week'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeWeekComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
