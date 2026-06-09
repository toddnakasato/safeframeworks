/**
 * SafeCalendar — Angular calendar component.
 * Implements calendar contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-calendar',
  standalone: true,
  imports: [NgFor],
  template: `
    <div data-role="header">
      <button data-role="prev">‹</button>
      <span data-role="title">June 2026</span>
      <button data-role="next">›</button>
    </div>
    <div data-role="grid">
      <span *ngFor="let d of ['S','M','T','W','T','F','S']" data-role="day-label">{{ d }}</span>
    </div>
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
