<!--
  SafeGauge — Vue 2 D3 radial KPI gauge.
  Renders via shared-mapping gauge builder (./gauge) — identical across
  frameworks. Structure + data-* only.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { createSafeGauge } from './gauge';

export default defineComponent({
  name: 'SafeGauge',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.gaugeContainer as HTMLElement;
    if (el) this.root = createSafeGauge(el, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="gaugeContainer"></div>
</template>
