<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeFireContext } from 'safecontracts';
import { buildPayloadViaCli } from '../../utils/payload-delegate';
import { defineComponent, type PropType } from 'vue';
import { createSafeLayout } from '../../builders/layout';
import { buildComponent } from '../../utils/render';

export default defineComponent({
  name: 'SafeLayout',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.layoutContainer as HTMLElement;
    if (el) {
      const _ctx = createSafeFireContext(this.config, this.onEvent, buildPayloadViaCli);
      this.root = createSafeLayout(el, this.config, _ctx, buildComponent);
    };
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="layoutContainer"></div>
</template>
