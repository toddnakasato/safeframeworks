<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeFireContext } from 'safecontracts';
import { buildPayloadViaCli } from '../../utils/payload-delegate';
import { defineComponent, type PropType } from 'vue';
import { createSafeColumns } from '../../builders/columns';

export default defineComponent({
  name: 'SafeColumns',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { root: null as HTMLElement | null };
  },
  mounted() {
    const el = this.$refs.columnsContainer as HTMLElement;
    if (el) this.root = createSafeColumns(el, this.config, this.onEvent);
  },
  beforeDestroy() {
    this.root?.remove();
    this.root = null;
  },
});
</script>

<template>
  <div ref="columnsContainer"></div>
</template>
