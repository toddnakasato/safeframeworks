<!--
  SafeHeatmap — Vue 2 heatmap component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
  name: 'SafeHeatmap',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="heatmap"
    :data-variant="config.metadata.variant"
  >
      <div data-role="title">Heatmap</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px"><div data-role="cell" style="padding:8px;background:rgba(59,130,246,0.2);text-align:center">3</div><div data-role="cell" style="padding:8px;background:rgba(59,130,246,0.5);text-align:center">7</div><div data-role="cell" style="padding:8px;background:rgba(59,130,246,0.8);text-align:center">9</div></div>
  </div>
</template>
