<!--
  SafeSheet — Vue 2 sheet component.
  Renders via shared-mapping sheet builder (./sheet) — identical across
  frameworks (HyperFormula calc engine). Structure + data-* only.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { createSafeSheet } from './sheet';

export default defineComponent({
  name: 'SafeSheet',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.sheetContainer as HTMLElement;
    if (el) this.root = createSafeSheet(el, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="sheetContainer"></div>
</template>
