<!--
  SafeLayout — Vue 2 named-region composition.
  Renders via shared-mapping layout builder (./layout) — identical across
  frameworks. Structure + data-* only.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { createSafeLayout } from './layout';

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
    if (el) this.root = createSafeLayout(el, this.config, this.onEvent);
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
