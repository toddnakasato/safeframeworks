<!--
  SafeToggle — Vue 3 toggle component.
  Renders via shared-mapping toggle builder (./toggle) — identical across
  frameworks. Structure + data-* only. No hardcoded CSS.
-->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeToggle } from './toggle';

const props = defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
const containerRef = ref<HTMLElement | null>(null);
let root: HTMLElement | null = null;

onMounted(() => {
  if (containerRef.value) root = createSafeToggle(containerRef.value, props.config, props.onEvent);
});

onBeforeUnmount(() => {
  root?.remove();
  root = null;
});
</script>

<template>
  <div ref="containerRef"></div>
</template>
