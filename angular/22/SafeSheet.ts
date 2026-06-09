/**
 * SafeSheet — Angular sheet component.
 * Implements sheet contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-sheet',
  standalone: true,
  template: `
    <div data-role="formula-bar"><span data-role="cell-ref">A1</span><span data-role="formula-text">=SUM(A1:A3)</span></div>
    <table data-role="grid">
      <thead><tr><th data-role="corner"></th><th data-role="col-header">A</th><th data-role="col-header">B</th></tr></thead>
      <tbody><tr><td data-role="row-number">1</td><td data-role="cell">10</td><td data-role="cell">20</td></tr>
      <tr><td data-role="row-number">2</td><td data-role="cell">30</td><td data-role="cell">40</td></tr></tbody>
    </table>
  `,
  host: {
    '[attr.data-component]': "'sheet'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-spacing]': 'config.metadata.spacing',
    '[attr.data-surface]': 'config.metadata.surface'
  }
})
export class SafeSheetComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
