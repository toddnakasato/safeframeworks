<script lang="ts">
import { buildComponent } from '../../utils/render';
export default {
  name: 'SafePlan',
  props: { config: { type: Object, required: true }, onEvent: { type: Function, default: undefined } },
  mounted() { const root = buildComponent(this.config as any, this.onEvent as any); (this.$refs.container as HTMLElement).appendChild(root); (this as any)._root = root; },
  beforeDestroy() { (this as any)._root?.remove(); },
};
</script>
<template><div ref="container"></div></template>