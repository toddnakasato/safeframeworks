<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
import { renderSafeSankey, sankeyData } from '../../builders/sankey';

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
