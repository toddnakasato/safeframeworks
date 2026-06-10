<!--
  SafeTreemap — Vue 2 D3 nested rectangles.
  Renders via shared-mapping treemap builder (./treemap) — identical across
  frameworks. Structure + data-* only.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { createSafeTreemap } from './treemap';

export default defineComponent({
  name: 'SafeTreemap',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.treemapContainer as HTMLElement;
    if (el) this.root = createSafeTreemap(el, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="treemapContainer"></div>
</template>
