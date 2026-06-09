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
    <div *ngIf="config.metadata.title" data-role="title">{{ config.metadata.title }}</div>
    <div data-role="messages">
      <div data-role="message" data-sender="system">Welcome to chat</div>
    </div>
    <div data-role="input"><input placeholder="{{ config.metadata.placeholder || 'Type a message...' }}" /></div>
  `,
  host: {
    '[attr.data-component]': "'chat'"
  }
})
export class SafeChatComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
