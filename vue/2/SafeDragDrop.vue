<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { buildComponent } from '../../utils/render';
import { defineComponent, type PropType } from 'vue';

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
    if (el) {
      const _ctx = createSafeFireContext(this.config, this.onEvent, buildPayloadViaCli);
      this.root = createSafeDragDrop(el, this.config, _ctx);
    };
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
