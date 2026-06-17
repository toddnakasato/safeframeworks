<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeFireContext } from 'safecontracts';
import { buildPayloadViaCli } from '../../utils/payload-delegate';
import { defineComponent, type PropType } from 'vue';
import { createSafeNav } from '../../builders/nav';

export default defineComponent({
  name: 'SafeNav',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.navContainer as HTMLElement;
    if (el) {
      const _ctx = createSafeFireContext(this.config, this.onEvent, buildPayloadViaCli);
      this.root = createSafeNav(el, this.config, _ctx);
    };
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="navContainer" data-nav-host></div>
</template>
