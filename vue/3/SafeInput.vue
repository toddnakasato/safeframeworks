<!--
  SafeInput — Vue 3 input component.
  Renders via shared-mapping input builder (./input) — identical across
  frameworks. Structure + data-* only. No hardcoded CSS.
-->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeInput } from './input';

const props = defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
const containerRef = ref<HTMLElement | null>(null);
let root: HTMLElement | null = null;

onMounted(() => {
  if (containerRef.value) root = createSafeInput(containerRef.value, props.config, props.onEvent);
});

onBeforeUnmount(() => {
  root?.remove();
  root = null;
});
</script>

<template>
  <div ref="containerRef"></div>
</template>
