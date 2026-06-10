<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import type { Chart } from 'chart.js';
import { defineComponent, type PropType } from 'vue';
import { createSafeChart } from '../../builders/chart';

export default defineComponent({
  name: 'SafeChart',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { chart: null as Chart | null };
  },
  mounted() {
    const canvas = this.$refs.chartCanvas as HTMLCanvasElement;
    if (canvas) this.chart = createSafeChart(canvas, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.chart?.destroy();
    this.chart = null;
  },
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
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>
