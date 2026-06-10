import { Component } from '@angular/core';
import { SAMPLES } from '../../../../samples';
import { NgFor, NgIf } from '@angular/common';
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
  imports: [NgFor, NgIf, SafeLayoutComponent, SafeColumnsComponent, SafeCardComponent, SafeButtonComponent, SafeTableComponent, SafeTreeComponent, SafeSheetComponent, SafeChartComponent, SafeHeatmapComponent, SafeGaugeComponent, SafeFunnelComponent, SafeSankeyComponent, SafeTreemapComponent, SafeTimelineComponent, SafeMapComponent, SafeCalendarComponent, SafeToggleComponent, SafeWeekComponent, SafeChatComponent, SafeTabsComponent, SafeCalloutComponent, SafeDragDropComponent, SafeGridComponent, SafeInputComponent, SafePickerComponent, SafeNavComponent],
  template: `
    <div class="viewer">
      <div class="sidebar">
        <div class="section-label">STYLE</div>
        <button *ngFor="let s of styles" class="style-btn" [class.active]="s === activeStyle" (click)="switchStyle(s)">{{s}}</button>

        <div class="section-label" style="margin-top:16px">COMPONENTS</div>
        <button class="comp-btn" [class.active]="activeComponent === null" (click)="activeComponent = null">All</button>
        <button *ngFor="let name of componentNames" class="comp-btn" [class.active]="activeComponent === name" (click)="activeComponent = name">{{name}}</button>
      </div>
      <div class="main">
        <h3>angular/21 — {{activeStyle}}<span *ngIf="activeComponent" class="active-comp"> — {{activeComponent}}</span></h3>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'layout'">
          <div class="component-label">layout</div>
          <div class="component-body">
            <safe-layout [config]="layoutConfig"></safe-layout>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'columns'">
          <div class="component-label">columns</div>
          <div class="component-body">
            <safe-columns [config]="columnsConfig"></safe-columns>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'card'">
          <div class="component-label">card</div>
          <div class="component-body">
            <safe-card [config]="cardConfig"></safe-card>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'button'">
          <div class="component-label">button</div>
          <div class="component-body">
            <safe-button [config]="buttonConfig"></safe-button>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'table'">
          <div class="component-label">table</div>
          <div class="component-body">
            <safe-table [config]="tableConfig"></safe-table>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'tree'">
          <div class="component-label">tree</div>
          <div class="component-body">
            <safe-tree [config]="treeConfig"></safe-tree>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'sheet'">
          <div class="component-label">sheet</div>
          <div class="component-body">
            <safe-sheet [config]="sheetConfig"></safe-sheet>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'chart'">
          <div class="component-label">chart</div>
          <div class="component-body">
            <safe-chart [config]="chartConfig"></safe-chart>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'heatmap'">
          <div class="component-label">heatmap</div>
          <div class="component-body">
            <safe-heatmap [config]="heatmapConfig"></safe-heatmap>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'gauge'">
          <div class="component-label">gauge</div>
          <div class="component-body">
            <safe-gauge [config]="gaugeConfig"></safe-gauge>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'funnel'">
          <div class="component-label">funnel</div>
          <div class="component-body">
            <safe-funnel [config]="funnelConfig"></safe-funnel>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'sankey'">
          <div class="component-label">sankey</div>
          <div class="component-body">
            <safe-sankey [config]="sankeyConfig"></safe-sankey>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'treemap'">
          <div class="component-label">treemap</div>
          <div class="component-body">
            <safe-treemap [config]="treemapConfig"></safe-treemap>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'timeline'">
          <div class="component-label">timeline</div>
          <div class="component-body">
            <safe-timeline [config]="timelineConfig"></safe-timeline>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'map'">
          <div class="component-label">map</div>
          <div class="component-body">
            <safe-map [config]="mapConfig"></safe-map>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'calendar'">
          <div class="component-label">calendar</div>
          <div class="component-body">
            <safe-calendar [config]="calendarConfig"></safe-calendar>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'toggle'">
          <div class="component-label">toggle</div>
          <div class="component-body">
            <safe-toggle [config]="toggleConfig"></safe-toggle>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'week'">
          <div class="component-label">week</div>
          <div class="component-body">
            <safe-week [config]="weekConfig"></safe-week>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'chat'">
          <div class="component-label">chat</div>
          <div class="component-body">
            <safe-chat [config]="chatConfig"></safe-chat>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'tabs'">
          <div class="component-label">tabs</div>
          <div class="component-body">
            <safe-tabs [config]="tabsConfig"></safe-tabs>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'callout'">
          <div class="component-label">callout</div>
          <div class="component-body">
            <safe-callout [config]="calloutConfig"></safe-callout>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'drag-drop'">
          <div class="component-label">drag-drop</div>
          <div class="component-body">
            <safe-drag-drop [config]="dragdropConfig"></safe-drag-drop>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'grid'">
          <div class="component-label">grid</div>
          <div class="component-body">
            <safe-grid [config]="gridConfig"></safe-grid>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'input'">
          <div class="component-label">input</div>
          <div class="component-body">
            <safe-input [config]="inputConfig"></safe-input>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'picker'">
          <div class="component-label">picker</div>
          <div class="component-body">
            <safe-picker [config]="pickerConfig"></safe-picker>
          </div>
        </div>
        <div class="component-card" *ngIf="activeComponent === null || activeComponent === 'nav'">
          <div class="component-label">nav</div>
          <div class="component-body">
            <safe-nav [config]="navConfig"></safe-nav>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .viewer { display: flex; height: 100vh; font-family: system-ui, sans-serif; }
    .sidebar { width: 220px; border-right: 1px solid #e5e7eb; padding: 12px; overflow-y: auto; flex-shrink: 0; }
    .section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 8px; }
    .style-btn, .comp-btn { display: block; width: 100%; text-align: left; padding: 4px 8px; font-size: 13px; border: none; border-radius: 4px; cursor: pointer; background: transparent; color: #1a1a1a; margin-bottom: 2px; }
    .style-btn.active, .comp-btn.active { background: #3b82f6; color: white; }
    .style-btn:hover, .comp-btn:hover { background: #f3f4f6; }
    .style-btn.active:hover, .comp-btn.active:hover { background: #3b82f6; }
    .main { flex: 1; overflow-y: auto; padding: 24px; }
    h3 { font-size: 14px; font-weight: 600; margin-bottom: 16px; }
    .active-comp { font-weight: 400; color: #6b7280; }
    .component-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
    .component-label { padding: 8px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; background: #fafafa; }
    .component-body { padding: 16px; }
  `]
})
export class AppComponent {
  styles = ['vanilla', 'tailwind', 'tailwind-daisy', 'material'];
  activeStyle = 'vanilla';
  activeComponent: string | null = null;
  componentNames = Object.keys(SAMPLES).sort();

  layoutConfig = SAMPLES['layout'];
  columnsConfig = SAMPLES['columns'];
  cardConfig = SAMPLES['card'];
  buttonConfig = SAMPLES['button'];
  tableConfig = SAMPLES['table'];
  treeConfig = SAMPLES['tree'];
  sheetConfig = SAMPLES['sheet'];
  chartConfig = SAMPLES['chart'];
  heatmapConfig = SAMPLES['heatmap'];
  gaugeConfig = SAMPLES['gauge'];
  funnelConfig = SAMPLES['funnel'];
  sankeyConfig = SAMPLES['sankey'];
  treemapConfig = SAMPLES['treemap'];
  timelineConfig = SAMPLES['timeline'];
  mapConfig = SAMPLES['map'];
  calendarConfig = SAMPLES['calendar'];
  toggleConfig = SAMPLES['toggle'];
  weekConfig = SAMPLES['week'];
  chatConfig = SAMPLES['chat'];
  tabsConfig = SAMPLES['tabs'];
  calloutConfig = SAMPLES['callout'];
  dragdropConfig = SAMPLES['drag-drop'];
  gridConfig = SAMPLES['grid'];
  inputConfig = SAMPLES['input'];
  pickerConfig = SAMPLES['picker'];
  navConfig = SAMPLES['nav'];

  switchStyle(s: string) {
    this.activeStyle = s;
    const link = document.getElementById('safestyle-link');
    if (link) link.setAttribute('href', '/styles/' + s + '/components.css');
  }
}
