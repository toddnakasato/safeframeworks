/**
 * SafeInput — Angular input component.
 * Implements input contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-input',
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="config.metadata.placeholder" data-role="field">
      <input [placeholder]="config.metadata.placeholder || ''" data-role="field" />
    </div>
    <div *ngIf="!config.metadata.placeholder" data-role="field">
      <input placeholder="Enter value..." data-role="field" />
    </div>
  `,
  host: {
    '[attr.data-component]': "'input'",
    '[attr.data-input-type]': 'config.metadata.inputType',
    '[attr.data-align]': 'config.metadata.align',
    '[attr.data-valign]': 'config.metadata.valign'
  }
})
export class SafeInputComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
