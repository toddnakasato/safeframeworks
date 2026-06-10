<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { createSafeHeatmap } from '../../builders/heatmap';

export default defineComponent({
  name: 'SafeHeatmap',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.heatmapContainer as HTMLElement;
    if (el) this.root = createSafeHeatmap(el, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="heatmapContainer"></div>
</template>
