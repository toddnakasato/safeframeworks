<!--
  SafeSankey — Vue 2 sankey component.
  Renders via shared-mapping sankey builder (./sankey) — identical across frameworks.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { renderSafeSankey, sankeyData } from './sankey';

export default defineComponent({
  name: 'SafeSankey',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  mounted() {
    const svg = this.$refs.sankeySvg as SVGSVGElement;
    if (svg) renderSafeSankey(svg, this.config, sankeyData(this.config), this.onEvent);
  },
});
</script>

<template>
  <div
    data-component="sankey"
    :data-variant="config.metadata.variant"
  >
    <div v-if="config.metadata.title" data-role="title">{{ config.metadata.title }}</div>
    <svg ref="sankeySvg" data-sankey-svg></svg>
  </div>
</template>
