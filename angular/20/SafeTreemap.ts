/**
 * SafeTreemap — Angular treemap component.
 * Implements treemap contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-treemap',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[attr.data-component]': "'treemap'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeTreemapComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
