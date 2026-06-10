<!--
  SafeChart — Svelte 5 chart component.
  Renders via Chart.js (shared builder — identical across frameworks).
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Chart } from 'chart.js';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeChart } from './chart';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;

  onMount(() => {
    chart = createSafeChart(canvas, config, onEvent);
  });

  onDestroy(() => {
    chart?.destroy();
    chart = null;
  });
</script>

<div
  data-component="chart"
  data-variant={config.metadata.variant}
  data-chart-type={config.metadata.chartType}
>
  <div data-role="title">{config.metadata.title || "Chart"}</div>
  <div data-role="chart-area" style="position:relative;height:240px">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>
