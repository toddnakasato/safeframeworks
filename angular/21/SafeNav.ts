/**
 * SafeNav — Angular nav component.
 * Implements nav contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-nav',
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="config.metadata.title" data-nav-header>
      <div data-nav-logo>{{ config.metadata.title?.charAt(0) }}</div>
      <div data-nav-title>{{ config.metadata.title }}</div>
    </div>
    <nav data-nav-main><ng-content></ng-content></nav>
  `,
  host: {
    '[attr.data-component]': "'nav'",
    '[attr.data-nav-style]': 'config.metadata.navStyle'
  }
})
export class SafeNavComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
