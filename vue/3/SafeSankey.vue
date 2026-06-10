<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { renderSafeSankey, sankeyData } from '../../builders/sankey';

const props = defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
const svgRef = ref<SVGSVGElement | null>(null);

onMounted(() => {
  if (svgRef.value) renderSafeSankey(svgRef.value, props.config, sankeyData(props.config), props.onEvent);
});
</script>

<template>
  <div
    data-component="sankey"
    :data-variant="config.metadata.variant"
  >
    <div v-if="config.metadata.title" data-role="title">{{ config.metadata.title }}</div>
    <svg ref="svgRef" data-sankey-svg></svg>
  </div>
</template>
