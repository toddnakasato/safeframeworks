<!--
  SafeDragDrop — Vue 2 drag-and-drop (generic / file / palette).
  Renders via shared-mapping dragdrop builder (./dragdrop) — identical across
  frameworks. Structure + data-* only.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { createSafeDragDrop } from './dragdrop';

export default defineComponent({
  name: 'SafeDragDrop',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.dragDropContainer as HTMLElement;
    if (el) this.root = createSafeDragDrop(el, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="dragDropContainer"></div>
</template>
