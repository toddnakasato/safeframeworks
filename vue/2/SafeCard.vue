<script lang="ts">
import { buildComponent } from '../../utils/render';

export default {
  name: 'SafeCard',
  props: { config: { type: Object, required: true }, onEvent: { type: Function, default: undefined } },
  data() { return { root: null as HTMLElement | null }; },
  mounted() {
    const el = this.$refs.container as HTMLElement;
    this.root = buildComponent(this.config, this.onEvent);
    el.appendChild(this.root);
  },
  beforeDestroy() { this.root?.remove(); this.root = null; },
};
</script>
<template><div ref="container"></div></template>
