<!--
  SafeFunnel — Vue 2 D3 funnel/conversion bars.
  Renders via shared-mapping funnel builder (./funnel) — identical across
  frameworks. Structure + data-* only.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { createSafeFunnel } from './funnel';

export default defineComponent({
  name: 'SafeFunnel',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.funnelContainer as HTMLElement;
    if (el) this.root = createSafeFunnel(el, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="funnelContainer"></div>
</template>
