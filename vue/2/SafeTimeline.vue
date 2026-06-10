<!--
  SafeTimeline — Vue 2 timeline component.
  Renders via shared-mapping timeline builder (./timeline) — identical across
  frameworks. Structure + data-* only. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { createSafeTimeline } from './timeline';

export default defineComponent({
  name: 'SafeTimeline',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.timelineContainer as HTMLElement;
    if (el) this.root = createSafeTimeline(el, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="timelineContainer"></div>
</template>
