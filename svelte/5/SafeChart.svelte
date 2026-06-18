<script lang="ts">
  import type { Chart } from 'chart.js';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { buildComponent } from '../../utils/render';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;

  $effect(() => {
    chart?.destroy();
    chart = createSafeChart(canvas, config, onEvent);
    return () => { chart?.destroy(); chart = null; };
  });
</script>

<div
  data-component="chart"
  data-variant={config.metadata.variant}
  data-chart-type={config.metadata.chartType}
>
  <div data-role="title">{config.metadata.title || "Chart"}</div>
  <div data-chart-area>
    <canvas bind:this={canvas}></canvas>
  </div>
</div>