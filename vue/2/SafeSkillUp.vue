<script lang="ts">
import { buildComponent } from '../../utils/render';
export default {
  name: 'SafeSkillUp',
  props: { config: { type: Object, required: true }, onEvent: { type: Function, default: undefined } },
  mounted() { const r = buildComponent(this.config as any, this.onEvent as any); (this.$refs.container as HTMLElement).appendChild(r); (this as any)._root = r; },
  beforeDestroy() { (this as any)._root?.remove(); },
};
</script>
<template><div ref="container"></div></template>