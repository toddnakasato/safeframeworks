/**
 * SafeTabs — Angular tabs component.
 * Implements tabs contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-tabs',
  standalone: true,
  imports: [NgIf],
  template: `
    <div data-tabs-bar>
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[attr.data-component]': "'tabs'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-position]': 'config.metadata.position'
  }
})
export class SafeTabsComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
