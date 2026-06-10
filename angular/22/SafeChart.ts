import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import type { Chart } from 'chart.js';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeChart } from '../../builders/chart';

@Component({
  selector: 'safe-chart',
  standalone: true,
  template: `
    <div data-role="title">{{ config.metadata.title || 'Chart' }}</div>
    <div data-chart-area>
      <canvas #chartCanvas></canvas>
    </div>
  `,
  host: {
    '[attr.data-component]': "'chart'",
    '[attr.data-variant]': 'config.metadata.variant',
    '[attr.data-chart-type]': 'config.metadata.chartType'
  }
})
export class SafeChartComponent implements AfterViewInit, OnDestroy {
  @Input() config!: ConfigBase;
  @Input() onEvent?: OnSafeEvent;
  @ViewChild('chartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  ngAfterViewInit() {
    this.chart = createSafeChart(this.canvasRef.nativeElement, this.config, this.onEvent);
  }

  ngOnDestroy() {
    this.chart?.destroy();
    this.chart = null;
  }
}
