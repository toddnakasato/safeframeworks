/**
 * SafeTree — Angular tree component.
 * Implements tree contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-tree',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[attr.data-component]': "'tree'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-spacing]': 'config.metadata.spacing'
  }
})
export class SafeTreeComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
