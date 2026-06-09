/**
 * SafeTable — Angular table component.
 * Implements table contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-table',
  standalone: true,
  template: `
    <div data-role="scroll">
      <table>
        <thead data-role="thead"><tr data-role="header-row"><th>Column</th><th>Value</th></tr></thead>
        <tbody data-role="tbody"><tr data-role="row"><td data-role="cell">Sample</td><td data-role="cell">Data</td></tr></tbody>
      </table>
    </div>
  `,
  host: {
    '[attr.data-component]': "'table'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-spacing]': 'config.metadata.spacing',
    '[attr.data-header-style]': 'config.metadata.headerStyle',
    '[attr.data-row-divider]': 'config.metadata.rowDivider',
    '[attr.data-row-numbers]': 'config.metadata.rowNumbers',
    '[attr.data-truncate]': 'config.metadata.truncate',
    '[attr.data-column-lines]': 'config.metadata.columnLines',
    '[attr.data-header-divider]': 'config.metadata.headerDivider',
    '[attr.data-zebra]': 'config.metadata.zebra',
    '[attr.data-selectable]': 'config.metadata.selectable'
  }
})
export class SafeTableComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
