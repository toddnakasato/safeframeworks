<!--
  SafeHeatmap — Vue 3 grid of value-colored cells.
  Renders via shared-mapping heatmap builder (./heatmap) — identical across
  frameworks. Structure + data-* only.
-->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeHeatmap } from './heatmap';

const props = defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
const containerRef = ref<HTMLElement | null>(null);
let root: HTMLElement | null = null;

onMounted(() => {
  if (containerRef.value) root = createSafeHeatmap(containerRef.value, props.config, props.onEvent);
});

onBeforeUnmount(() => {
  root?.remove();
  root = null;
});
</script>

<template>
  <div ref="containerRef"></div>
</template>
