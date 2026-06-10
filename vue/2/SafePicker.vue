<!--
  SafePicker — Vue 2 searchable list/card picker.
  Renders via shared-mapping picker builder (./picker) — identical across
  frameworks. Structure + data-* only.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { createSafePicker } from './picker';

export default defineComponent({
  name: 'SafePicker',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.pickerContainer as HTMLElement;
    if (el) this.root = createSafePicker(el, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="pickerContainer"></div>
</template>
