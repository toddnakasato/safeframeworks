import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { SafeButtonComponent } from '../../SafeButton';
import { SafeCardComponent } from '../../SafeCard';
import { SafeNavComponent } from '../../SafeNav';
import { SafeTableComponent } from '../../SafeTable';
import { SafeToggleComponent } from '../../SafeToggle';
import { SafeCalloutComponent } from '../../SafeCallout';

const STYLES = ['vanilla', 'tailwind', 'tailwind-daisy', 'material'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, SafeButtonComponent, SafeCardComponent, SafeNavComponent, SafeTableComponent, SafeToggleComponent, SafeCalloutComponent],
  template: `
    <div class="viewer">
      <div class="sidebar">
        <div class="section-label">STYLE</div>
        <button *ngFor="let s of styles" class="style-btn" [class.active]="s === activeStyle" (click)="switchStyle(s)">{{s}}</button>
        <div class="section-label" style="margin-top:12px">angular/22</div>
      </div>
      <div class="main">
        <h3>angular/22 — {{activeStyle}}</h3>

        <div class="component-card">
          <div class="component-label">button</div>
          <div class="component-body">
            <safe-button [config]="buttonConfig"></safe-button>
          </div>
        </div>

        <div class="component-card">
          <div class="component-label">card</div>
          <div class="component-body">
            <safe-card [config]="cardConfig"></safe-card>
          </div>
        </div>

        <div class="component-card">
          <div class="component-label">nav</div>
          <div class="component-body">
            <safe-nav [config]="navConfig"></safe-nav>
          </div>
        </div>

        <div class="component-card">
          <div class="component-label">table</div>
          <div class="component-body">
            <safe-table [config]="tableConfig"></safe-table>
          </div>
        </div>

        <div class="component-card">
          <div class="component-label">toggle</div>
          <div class="component-body">
            <safe-toggle [config]="toggleConfig"></safe-toggle>
          </div>
        </div>

        <div class="component-card">
          <div class="component-label">callout</div>
          <div class="component-body">
            <safe-callout [config]="calloutConfig"></safe-callout>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .viewer { display: flex; height: 100vh; font-family: system-ui, sans-serif; }
    .sidebar { width: 200px; border-right: 1px solid #e5e7eb; padding: 12px; overflow-y: auto; }
    .section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 8px; }
    .style-btn { display: block; width: 100%; text-align: left; padding: 4px 8px; font-size: 13px; border: none; border-radius: 4px; cursor: pointer; background: transparent; color: #1a1a1a; margin-bottom: 2px; }
    .style-btn.active { background: #3b82f6; color: white; }
    .main { flex: 1; overflow-y: auto; padding: 24px; }
    h3 { font-size: 14px; font-weight: 600; margin-bottom: 16px; }
    .component-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
    .component-label { padding: 8px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; background: #fafafa; }
    .component-body { padding: 16px; }
  `]
})
export class AppComponent {
  styles = STYLES;
  activeStyle = 'vanilla';

  buttonConfig = { component: 'button', metadata: { variant: 'primary', label: 'Click Me', size: 'md' } };
  cardConfig = { component: 'card', metadata: { variant: 'outline', surface: 'raised', spacing: 'normal', radius: 'md' } };
  navConfig = { component: 'nav', metadata: { navStyle: 'classic', title: 'Viewer' } };
  tableConfig = { component: 'table', metadata: { variant: 'default', spacing: 'normal', headerStyle: 'uppercase' } };
  toggleConfig = { component: 'toggle', metadata: { variant: 'switch', disabled: false, labelPosition: 'right' } };
  calloutConfig = { component: 'callout', metadata: { variant: 'info', position: 'top', message: 'This is a callout.' } };

  switchStyle(s: string) {
    this.activeStyle = s;
    const link = document.getElementById('safestyle-link');
    if (link) link.setAttribute('href', '/styles/' + s + '/components.css');
  }
}
