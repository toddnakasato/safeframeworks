/**
 * SafePicker — Angular picker component.
 * Implements picker contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-picker',
  standalone: true,
  template: `
    <div data-role="search-form"><input data-role="search-input" placeholder="Search..." /></div>
    <div data-role="list">
      <div data-role="list-item">Item 1</div>
      <div data-role="list-item">Item 2</div>
      <div data-role="list-item">Item 3</div>
    </div>
  `,
  host: {
    '[attr.data-component]': "'picker'",
    '[attr.data-variant]': 'config.metadata.variant'
  }
})
export class SafePickerComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
