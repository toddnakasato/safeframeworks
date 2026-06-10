<!--
  SafeNav — Vue 2 nav component.
  navStyle "accordion" renders via shared-mapping nav builder (./nav) —
  identical across frameworks (figma Shopfront design).
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { createSafeNav } from './nav';

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
    if (el) this.root = createSafeNav(el, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="navContainer" style="height:100%"></div>
</template>
