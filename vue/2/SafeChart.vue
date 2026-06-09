<!--
  SafeChart — Vue 2 chart component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
  name: 'SafeChart',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="chart"
    :data-variant="config.metadata.variant"
    :data-chart-type="config.metadata.chartType"
  >
      <div data-role="title">{{ config.metadata.title || "Chart" }}</div><div style="height:120px;display:flex;align-items:flex-end;gap:4px;padding:8px"><div style="flex:1;background:var(--sd-accent,#3b82f6);height:60%"></div><div style="flex:1;background:var(--sd-accent,#3b82f6);height:80%"></div><div style="flex:1;background:var(--sd-accent,#3b82f6);height:40%"></div></div>
  </div>
</template>
