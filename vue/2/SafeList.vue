<!--
  SafeList — Vue 2 flexible list.
  Renders via shared-mapping list builder (./list) — identical across
  frameworks (figma Atom List Specs). Structure + data-* only.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { createSafeList } from './list';

export default defineComponent({
  name: 'SafeList',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.listContainer as HTMLElement;
    if (el) this.root = createSafeList(el, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="listContainer"></div>
</template>
