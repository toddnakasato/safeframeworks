<!--
  SafeChart — Vue 3 chart component.
  Renders via Chart.js (same builder in every framework — identical rendering).
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { Chart } from 'chart.js';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeChart } from './chart';

const props = defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

onMounted(() => {
  if (canvasRef.value) chart = createSafeChart(canvasRef.value, props.config, props.onEvent);
});

onBeforeUnmount(() => {
  chart?.destroy();
  chart = null;
});
</script>

<template>
  <div
    data-component="chart"
    :data-variant="config.metadata.variant"
    :data-chart-type="config.metadata.chartType"
  >
    <div data-role="title">{{ config.metadata.title || "Chart" }}</div>
    <div data-role="chart-area" style="position:relative;height:240px">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>
