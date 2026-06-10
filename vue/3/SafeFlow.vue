<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { renderSafeFlow, flowData } from '../../builders/flow';

const props = defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
const svgRef = ref<SVGSVGElement | null>(null);

onMounted(() => {
  if (svgRef.value) renderSafeFlow(svgRef.value, props.config, flowData(props.config), props.onEvent);
});
</script>

<template>
  <div>
    <div v-if="config.metadata.title" data-role="title">{{ config.metadata.title }}</div>
    <svg ref="svgRef" data-flow-svg></svg>
  </div>
</template>
