/**
 * SafeLayout — Angular layout component.
 * Implements layout contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-layout',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[attr.data-component]': "'layout'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeLayoutComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
