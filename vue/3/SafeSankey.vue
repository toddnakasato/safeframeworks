<!--
  SafeSankey — Vue 3 sankey component.
  Renders via shared-mapping sankey builder (./sankey) — identical across frameworks.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { renderSafeSankey, sankeyData } from './sankey';

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
    <svg ref="svgRef" style="width:100%;max-width:700px;display:block"></svg>
  </div>
</template>
