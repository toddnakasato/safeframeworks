/**
 * SafeTimeline — Angular timeline component.
 * Implements timeline contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-timeline',
  standalone: true,
  template: `
    <div data-role="event">
      <div data-role="marker"><div data-role="dot"></div><div data-role="line"></div></div>
      <div data-role="content"><div data-role="label">Event 1</div><div data-role="date">2026-01-01</div></div>
    </div>
    <div data-role="event">
      <div data-role="marker"><div data-role="dot"></div></div>
      <div data-role="content"><div data-role="label">Event 2</div><div data-role="date">2026-06-01</div></div>
    </div>
  `,
  host: {
    '[attr.data-component]': "'timeline'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeTimelineComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
