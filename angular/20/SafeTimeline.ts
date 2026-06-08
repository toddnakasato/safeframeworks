/**
 * SafeTimeline — Angular timeline component.
 * Implements timeline contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-timeline',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
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
