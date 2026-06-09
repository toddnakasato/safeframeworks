/**
 * SafeTree — Angular tree component.
 * Implements tree contract from safecontracts.
 * Outputs data-* attributes for intent. No hardcoded CSS.
 */
import { Component, Input } from '@angular/core';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

@Component({
  selector: 'safe-tree',
  standalone: true,
  template: `
    <div data-role="node" data-depth="0" data-has-children>
      <span data-role="toggle">▶</span>
      <span data-role="label">Root</span>
    </div>
    <div data-role="node" data-depth="1">
      <span data-role="leaf-spacer"></span>
      <span data-role="label">Child A</span>
    </div>
    <div data-role="node" data-depth="1">
      <span data-role="leaf-spacer"></span>
      <span data-role="label">Child B</span>
    </div>
  `,
  host: {
    '[attr.data-component]': "'tree'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-spacing]': 'config.metadata.spacing'
  }
})
export class SafeTreeComponent {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
}
