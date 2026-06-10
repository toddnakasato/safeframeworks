<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { createSafeToggle } from '../../builders/toggle';

export default defineComponent({
  name: 'SafeToggle',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.toggleContainer as HTMLElement;
    if (el) this.root = createSafeToggle(el, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="toggleContainer"></div>
</template>
