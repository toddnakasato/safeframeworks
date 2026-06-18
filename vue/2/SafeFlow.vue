<script lang="ts">
import { createSafeFlow, flowData } from '../../builders/flow';

export default {
  name: 'SafeFlow',
  props: { config: { type: Object, required: true }, onEvent: { type: Function, default: undefined } },
  mounted() {
    createSafeFlow(this.$refs.flowSvg, this.config, flowData(this.config), this.onEvent);
  },
};
</script>

<template>
  <div>
    <div v-if="config.metadata.title" data-role="title">{{ config.metadata.title }}</div>
    <svg ref="flowSvg" data-flow-svg></svg>
  </div>
</template>
