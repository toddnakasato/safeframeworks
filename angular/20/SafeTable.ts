/**
 * SafeTable — Angular table component.
 * Implements table contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-table',
  standalone: true,
  imports: [NgIf],
  template: `
    <div data-role="scroll">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[attr.data-component]': "'table'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-spacing]': 'config.metadata.spacing',
    '[attr.data-sticky-header]': 'config.metadata.stickyHeader',
    '[attr.data-header-style]': 'config.metadata.headerStyle',
    '[attr.data-row-divider]': 'config.metadata.rowDivider',
    '[attr.data-hover-style]': 'config.metadata.hoverStyle',
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
