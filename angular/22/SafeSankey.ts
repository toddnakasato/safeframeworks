/**
 * SafeSankey — Angular sankey component.
 * Implements sankey contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-sankey',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[attr.data-component]': "'sankey'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeSankeyComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
