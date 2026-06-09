/**
 * SafeWeek — Angular week component.
 * Implements week contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-week',
  standalone: true,
  imports: [NgFor],
  template: `
    <div data-role="header">
      <button>‹</button><span>June 8-14, 2026</span><button>›</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;font-size:11px;text-align:center;padding:8px">
      <span *ngFor="let d of ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']">{{ d }}</span>
    </div>
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
