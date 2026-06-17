<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { Chart } from 'chart.js';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeFireContext } from 'safecontracts';
import { buildPayloadViaCli } from '../../utils/payload-delegate';
import { createSafeChart } from '../../builders/chart';

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
    <div data-chart-area>
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>
