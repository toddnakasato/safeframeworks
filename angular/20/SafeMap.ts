/**
 * SafeMap — Angular map component.
 * Implements map contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-map',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[attr.data-component]': "'map'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeMapComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
