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
import { SafeFlowComponent } from '../../SafeFlow';
import { SafeHierarchyComponent } from '../../SafeHierarchy';
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
import { SafeListComponent } from '../../SafeList';
import { SafePickerComponent } from '../../SafePicker';
import { SafeNavComponent } from '../../SafeNav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, SafeLayoutComponent, SafeColumnsComponent, SafeCardComponent, SafeButtonComponent, SafeTableComponent, SafeTreeComponent, SafeSheetComponent, SafeChartComponent, SafeHeatmapComponent, SafeGaugeComponent, SafeFunnelComponent, SafeFlowComponent, SafeHierarchyComponent, SafeTimelineComponent, SafeMapComponent, SafeCalendarComponent, SafeToggleComponent, SafeWeekComponent, SafeChatComponent, SafeTabsComponent, SafeCalloutComponent, SafeDragDropComponent, SafeGridComponent, SafeInputComponent, SafeListComponent, SafePickerComponent, SafeNavComponent],
  template: `
    <div class="viewer">
      <div class="sidebar">
        <div class="section-label">STYLE</div>
        <button *ngFor="let s of styles" class="style-btn" [class.active]="s === activeStyle" (click)="switchStyle(s)">{{s}}</button>

        <div class="section-label" style="margin-top:16px">COMPONENTS</div>
        <button class="comp-btn" [class.active]="activeComponent === null" (click)="selectComponent(null)">All</button>
        <ng-container *ngFor="let name of componentNames">
          <button class="comp-btn" [class.active]="activeComponent === name && !activeVariation" (click)="selectComponent(name)">{{name}}</button>
          <ng-container *ngIf="activeComponent === name">
            <button *ngFor="let v of allVariations(name)" class="var-btn" [class.active]="activeVariation === v" (click)="selectVariation(name, v)">{{v}}</button>
          </ng-container>
        </ng-container>
      </div>
      <div class="main">
        <h3>angular/21 — {{activeStyle}}<span *ngIf="activeComponent" class="active-comp"> — {{activeVariation ?? activeComponent}}</span></h3>
        <ng-container *ngIf="show('layout')">
          <div class="component-card" *ngFor="let v of variations('layout')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-layout [config]="cfg('layout', v)"></safe-layout>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('columns')">
          <div class="component-card" *ngFor="let v of variations('columns')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-columns [config]="cfg('columns', v)"></safe-columns>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('card')">
          <div class="component-card" *ngFor="let v of variations('card')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-card [config]="cfg('card', v)"></safe-card>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('button')">
          <div class="component-card" *ngFor="let v of variations('button')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-button [config]="cfg('button', v)"></safe-button>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('table')">
          <div class="component-card" *ngFor="let v of variations('table')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-table [config]="cfg('table', v)"></safe-table>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('tree')">
          <div class="component-card" *ngFor="let v of variations('tree')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-tree [config]="cfg('tree', v)"></safe-tree>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('sheet')">
          <div class="component-card" *ngFor="let v of variations('sheet')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-sheet [config]="cfg('sheet', v)"></safe-sheet>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('chart')">
          <div class="component-card" *ngFor="let v of variations('chart')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-chart [config]="cfg('chart', v)"></safe-chart>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('heatmap')">
          <div class="component-card" *ngFor="let v of variations('heatmap')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-heatmap [config]="cfg('heatmap', v)"></safe-heatmap>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('gauge')">
          <div class="component-card" *ngFor="let v of variations('gauge')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-gauge [config]="cfg('gauge', v)"></safe-gauge>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('funnel')">
          <div class="component-card" *ngFor="let v of variations('funnel')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-funnel [config]="cfg('funnel', v)"></safe-funnel>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('flow')">
          <div class="component-card" *ngFor="let v of variations('flow')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-flow [config]="cfg('flow', v)"></safe-flow>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('hierarchy')">
          <div class="component-card" *ngFor="let v of variations('hierarchy')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-hierarchy [config]="cfg('hierarchy', v)"></safe-hierarchy>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('timeline')">
          <div class="component-card" *ngFor="let v of variations('timeline')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-timeline [config]="cfg('timeline', v)"></safe-timeline>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('map')">
          <div class="component-card" *ngFor="let v of variations('map')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-map [config]="cfg('map', v)"></safe-map>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('calendar')">
          <div class="component-card" *ngFor="let v of variations('calendar')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-calendar [config]="cfg('calendar', v)"></safe-calendar>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('toggle')">
          <div class="component-card" *ngFor="let v of variations('toggle')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-toggle [config]="cfg('toggle', v)"></safe-toggle>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('week')">
          <div class="component-card" *ngFor="let v of variations('week')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-week [config]="cfg('week', v)"></safe-week>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('chat')">
          <div class="component-card" *ngFor="let v of variations('chat')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-chat [config]="cfg('chat', v)"></safe-chat>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('tabs')">
          <div class="component-card" *ngFor="let v of variations('tabs')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-tabs [config]="cfg('tabs', v)"></safe-tabs>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('callout')">
          <div class="component-card" *ngFor="let v of variations('callout')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-callout [config]="cfg('callout', v)"></safe-callout>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('drag-drop')">
          <div class="component-card" *ngFor="let v of variations('drag-drop')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-drag-drop [config]="cfg('drag-drop', v)"></safe-drag-drop>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('grid')">
          <div class="component-card" *ngFor="let v of variations('grid')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-grid [config]="cfg('grid', v)"></safe-grid>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('input')">
          <div class="component-card" *ngFor="let v of variations('input')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-input [config]="cfg('input', v)"></safe-input>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('list')">
          <div class="component-card" *ngFor="let v of variations('list')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-list [config]="cfg('list', v)"></safe-list>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('picker')">
          <div class="component-card" *ngFor="let v of variations('picker')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-picker [config]="cfg('picker', v)"></safe-picker>
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="show('nav')">
          <div class="component-card" *ngFor="let v of variations('nav')">
            <div class="component-label">{{v}}</div>
            <div class="component-body">
              <safe-nav [config]="cfg('nav', v)"></safe-nav>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .viewer { display: flex; height: 100vh; font-family: system-ui, sans-serif; }
    .sidebar { width: 220px; border-right: 1px solid #e5e7eb; padding: 12px; overflow-y: auto; flex-shrink: 0; }
    .section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 8px; }
    .style-btn, .comp-btn, .var-btn { display: block; width: 100%; text-align: left; padding: 4px 8px; font-size: 13px; border: none; border-radius: 4px; cursor: pointer; background: transparent; color: #1a1a1a; margin-bottom: 2px; }
    .var-btn { padding-left: 22px; }
    .style-btn.active, .comp-btn.active, .var-btn.active { background: #3b82f6; color: white; }
    .style-btn:hover, .comp-btn:hover, .var-btn:hover { background: #f3f4f6; }
    .style-btn.active:hover, .comp-btn.active:hover, .var-btn.active:hover { background: #3b82f6; }
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
  activeVariation: string | null = null;
  componentNames = Object.keys(SAMPLES).sort();

  show(comp: string) {
    return this.activeComponent === null || this.activeComponent === comp;
  }

  allVariations(comp: string) {
    return Object.keys((SAMPLES as any)[comp] ?? {}).sort();
  }

  variations(comp: string) {
    const vs = this.allVariations(comp);
    return this.activeVariation && this.activeComponent === comp
      ? vs.filter(v => v === this.activeVariation)
      : vs;
  }

  cfg(comp: string, v: string) {
    return (SAMPLES as any)[comp][v];
  }

  selectComponent(name: string | null) {
    this.activeComponent = name;
    this.activeVariation = null;
  }

  selectVariation(comp: string, v: string) {
    this.activeComponent = comp;
    this.activeVariation = v;
  }

  switchStyle(s: string) {
    this.activeStyle = s;
    const link = document.getElementById('safestyle-link');
    if (link) link.setAttribute('href', '/styles/' + s + '/components.css');
  }
}
