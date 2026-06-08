/**
 * SafeCalendar — Angular calendar component.
 * Implements calendar contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-calendar',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[attr.data-component]': "'calendar'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-size]': 'config.metadata.size'
  }
})
export class SafeCalendarComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
