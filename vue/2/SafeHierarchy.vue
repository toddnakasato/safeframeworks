<script lang="ts">
import { createSafeHierarchy } from '../../builders/hierarchy';

export default {
  name: 'SafeHierarchy',
  props: { config: { type: Object, required: true }, onEvent: { type: Function, default: undefined } },
  data() { return { root: null }; },
  mounted() {
    this.root = createSafeHierarchy(this.$refs.container, this.config, this.onEvent);
  },
  beforeDestroy() { this.root?.remove(); this.root = null; },
};
</script>

<template>
  <div ref="container"></div>
</template>
