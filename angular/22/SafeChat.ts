/**
 * SafeChat — Angular chat component.
 * Implements chat contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-chat',
  standalone: true,
  imports: [NgIf],
  template: `
    <div data-role="messages">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[attr.data-component]': "'chat'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafeChatComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
