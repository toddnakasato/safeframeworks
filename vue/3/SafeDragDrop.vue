<!--
  SafeDragDrop — Vue 3 drag-and-drop (generic / file / palette).
  Renders via shared-mapping dragdrop builder (./dragdrop) — identical across
  frameworks. Structure + data-* only.
-->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeDragDrop } from './dragdrop';

const props = defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
const containerRef = ref<HTMLElement | null>(null);
let root: HTMLElement | null = null;

onMounted(() => {
  if (containerRef.value) root = createSafeDragDrop(containerRef.value, props.config, props.onEvent);
});

onBeforeUnmount(() => {
  root?.remove();
  root = null;
});
</script>

<template>
  <div ref="containerRef"></div>
</template>
