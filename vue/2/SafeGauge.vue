<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeFireContext } from 'safecontracts';
import { buildPayloadViaCli } from '../../utils/payload-delegate';
import { defineComponent, type PropType } from 'vue';
import { createSafeGauge } from '../../builders/gauge';

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
    if (el) {
      const _ctx = createSafeFireContext(this.config, this.onEvent, buildPayloadViaCli);
      this.root = createSafeGauge(el, this.config, _ctx);
    };
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
