import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { SafeLayoutComponent } from '../../SafeLayout';
import { SafeColumnsComponent } from '../../SafeColumns';
import { SafeCardComponent } from '../../SafeCard';
import { SafeButtonComponent } from '../../SafeButton';
import { SafeTableComponent } from '../../SafeTable';
import { SafeTreeComponent } from '../../SafeTree';
import { SafeSheetComponent } from '../../SafeSheet';
import { SafeChartComponent } from '../../SafeChart';
import { SafeHeatmapComponent } from '../../SafeHeatmap';
import { SafeGaugeComponent } from '../../SafeGauge';
import { SafeFunnelComponent } from '../../SafeFunnel';
import { SafeSankeyComponent } from '../../SafeSankey';
import { SafeTreemapComponent } from '../../SafeTreemap';
import { SafeTimelineComponent } from '../../SafeTimeline';
import { SafeMapComponent } from '../../SafeMap';
import { SafeCalendarComponent } from '../../SafeCalendar';
import { SafeToggleComponent } from '../../SafeToggle';
import { SafeWeekComponent } from '../../SafeWeek';
import { SafeChatComponent } from '../../SafeChat';
import { SafeTabsComponent } from '../../SafeTabs';
import { SafeCalloutComponent } from '../../SafeCallout';
import { SafeDragDropComponent } from '../../SafeDragDrop';
import { SafeGridComponent } from '../../SafeGrid';
import { SafeInputComponent } from '../../SafeInput';
import { SafePickerComponent } from '../../SafePicker';
import { SafeNavComponent } from '../../SafeNav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, SafeLayoutComponent, SafeColumnsComponent, SafeCardComponent, SafeButtonComponent, SafeTableComponent, SafeTreeComponent, SafeSheetComponent, SafeChartComponent, SafeHeatmapComponent, SafeGaugeComponent, SafeFunnelComponent, SafeSankeyComponent, SafeTreemapComponent, SafeTimelineComponent, SafeMapComponent, SafeCalendarComponent, SafeToggleComponent, SafeWeekComponent, SafeChatComponent, SafeTabsComponent, SafeCalloutComponent, SafeDragDropComponent, SafeGridComponent, SafeInputComponent, SafePickerComponent, SafeNavComponent],
  template: `
  <div class="viewer">
    <div class="sidebar">
      <div class="section-label">STYLE</div>
      <button class="style-btn" [class.active]="activeStyle === 'vanilla'" (click)="switchStyle('vanilla')">vanilla</button>
      <button class="style-btn" [class.active]="activeStyle === 'tailwind'" (click)="switchStyle('tailwind')">tailwind</button>
      <button class="style-btn" [class.active]="activeStyle === 'tailwind-daisy'" (click)="switchStyle('tailwind-daisy')">tailwind-daisy</button>
      <button class="style-btn" [class.active]="activeStyle === 'material'" (click)="switchStyle('material')">material</button>
      <div class="section-label" style="margin-top:12px">angular/22</div>
    </div>
    <div class="main">
      <h3>angular/22 — {{activeStyle}}</h3>
      <div class="component-card">
        <div class="component-label">layout</div>
        <div class="component-body">
          <safe-layout [config]="getConfig('layout')"></safe-layout>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">columns</div>
        <div class="component-body">
          <safe-columns [config]="getConfig('columns')"></safe-columns>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">card</div>
        <div class="component-body">
          <safe-card [config]="getConfig('card')"></safe-card>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">button</div>
        <div class="component-body">
          <safe-button [config]="getConfig('button')"></safe-button>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">table</div>
        <div class="component-body">
          <safe-table [config]="getConfig('table')"></safe-table>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">tree</div>
        <div class="component-body">
          <safe-tree [config]="getConfig('tree')"></safe-tree>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">sheet</div>
        <div class="component-body">
          <safe-sheet [config]="getConfig('sheet')"></safe-sheet>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">chart</div>
        <div class="component-body">
          <safe-chart [config]="getConfig('chart')"></safe-chart>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">heatmap</div>
        <div class="component-body">
          <safe-heatmap [config]="getConfig('heatmap')"></safe-heatmap>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">gauge</div>
        <div class="component-body">
          <safe-gauge [config]="getConfig('gauge')"></safe-gauge>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">funnel</div>
        <div class="component-body">
          <safe-funnel [config]="getConfig('funnel')"></safe-funnel>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">sankey</div>
        <div class="component-body">
          <safe-sankey [config]="getConfig('sankey')"></safe-sankey>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">treemap</div>
        <div class="component-body">
          <safe-treemap [config]="getConfig('treemap')"></safe-treemap>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">timeline</div>
        <div class="component-body">
          <safe-timeline [config]="getConfig('timeline')"></safe-timeline>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">map</div>
        <div class="component-body">
          <safe-map [config]="getConfig('map')"></safe-map>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">calendar</div>
        <div class="component-body">
          <safe-calendar [config]="getConfig('calendar')"></safe-calendar>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">toggle</div>
        <div class="component-body">
          <safe-toggle [config]="getConfig('toggle')"></safe-toggle>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">week</div>
        <div class="component-body">
          <safe-week [config]="getConfig('week')"></safe-week>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">chat</div>
        <div class="component-body">
          <safe-chat [config]="getConfig('chat')"></safe-chat>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">tabs</div>
        <div class="component-body">
          <safe-tabs [config]="getConfig('tabs')"></safe-tabs>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">callout</div>
        <div class="component-body">
          <safe-callout [config]="getConfig('callout')"></safe-callout>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">drag-drop</div>
        <div class="component-body">
          <safe-drag-drop [config]="getConfig('drag-drop')"></safe-drag-drop>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">grid</div>
        <div class="component-body">
          <safe-grid [config]="getConfig('grid')"></safe-grid>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">input</div>
        <div class="component-body">
          <safe-input [config]="getConfig('input')"></safe-input>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">picker</div>
        <div class="component-body">
          <safe-picker [config]="getConfig('picker')"></safe-picker>
        </div>
      </div>
      <div class="component-card">
        <div class="component-label">nav</div>
        <div class="component-body">
          <safe-nav [config]="getConfig('nav')"></safe-nav>
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
  activeStyle = 'vanilla';
  configs = [
    { name: 'layout', config: { component: 'layout', metadata: {"variant": "default"} } },
    { name: 'columns', config: { component: 'columns', metadata: {"spacing": "normal", "radius": "normal", "surface": "normal"} } },
    { name: 'card', config: { component: 'card', metadata: {"variant": "default", "surface": "normal", "spacing": "normal", "radius": "normal", "density": "normal"} } },
    { name: 'button', config: { component: 'button', metadata: {"variant": "default", "size": "normal", "disabled": false, "loading": "normal", "fullWidth": "normal", "iconOnly": "normal", "selected": "normal", "status": "normal", "groupVariant": "normal", "groupDirection": "normal"} } },
    { name: 'table', config: { component: 'table', metadata: {"variant": "default", "spacing": "normal", "headerStyle": "normal", "rowDivider": "normal", "rowNumbers": "normal", "truncate": "normal", "columnLines": "normal", "headerDivider": "normal", "zebra": "normal", "selectable": "normal"} } },
    { name: 'tree', config: { component: 'tree', metadata: {"variant": "default", "spacing": "normal"} } },
    { name: 'sheet', config: { component: 'sheet', metadata: {"variant": "default", "spacing": "normal", "surface": "normal"} } },
    { name: 'chart', config: { component: 'chart', metadata: {"variant": "default", "chartType": "bar"} } },
    { name: 'heatmap', config: { component: 'heatmap', metadata: {"variant": "default"} } },
    { name: 'gauge', config: { component: 'gauge', metadata: {"variant": "default"} } },
    { name: 'funnel', config: { component: 'funnel', metadata: {"variant": "default"} } },
    { name: 'sankey', config: { component: 'sankey', metadata: {"variant": "default"} } },
    { name: 'treemap', config: { component: 'treemap', metadata: {"variant": "default"} } },
    { name: 'timeline', config: { component: 'timeline', metadata: {"variant": "default"} } },
    { name: 'map', config: { component: 'map', metadata: {"variant": "default"} } },
    { name: 'calendar', config: { component: 'calendar', metadata: {"variant": "default", "size": "normal"} } },
    { name: 'toggle', config: { component: 'toggle', metadata: {"variant": "default", "disabled": false, "labelPosition": "normal"} } },
    { name: 'week', config: { component: 'week', metadata: {"variant": "default"} } },
    { name: 'chat', config: { component: 'chat', metadata: {} } },
    { name: 'tabs', config: { component: 'tabs', metadata: {"variant": "default", "position": "normal"} } },
    { name: 'callout', config: { component: 'callout', metadata: {"variant": "default", "position": "normal"} } },
    { name: 'drag-drop', config: { component: 'drag-drop', metadata: {"variant": "default"} } },
    { name: 'grid', config: { component: 'grid', metadata: {"spacing": "normal", "radius": "normal", "surface": "normal", "collapsible": false} } },
    { name: 'input', config: { component: 'input', metadata: {"inputType": "text", "align": "normal", "valign": "normal"} } },
    { name: 'picker', config: { component: 'picker', metadata: {"variant": "default"} } },
    { name: 'nav', config: { component: 'nav', metadata: {"navStyle": "classic"} } }
  ];

  switchStyle(s: string) {
    this.activeStyle = s;
    const link = document.getElementById('safestyle-link');
    if (link) link.setAttribute('href', '/styles/' + s + '/components.css');
  }

  getConfig(name: string) {
    return this.configs.find(c => c.name === name)?.config ?? { component: name, metadata: {} };
  }
}
