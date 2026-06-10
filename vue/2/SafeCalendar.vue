<!--
  SafeCalendar — Vue 2 calendar component.
  Renders via shared-mapping calendar builder (./calendar) — identical across
  frameworks. Structure + data-* only. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { createSafeCalendar } from './calendar';

export default defineComponent({
  name: 'SafeCalendar',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.calendarContainer as HTMLElement;
    if (el) this.root = createSafeCalendar(el, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="calendarContainer"></div>
</template>
