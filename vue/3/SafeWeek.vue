<!--
  SafeWeek — Vue 3 weekly planner.
  Renders via shared-mapping week builder (./week) — identical across
  frameworks (figma Atom Week Specs). Structure + data-* only.
-->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeWeek } from './week';

const props = defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
const containerRef = ref<HTMLElement | null>(null);
let root: HTMLElement | null = null;

onMounted(() => {
  if (containerRef.value) root = createSafeWeek(containerRef.value, props.config, props.onEvent);
});

onBeforeUnmount(() => {
  root?.remove();
  root = null;
});
</script>

<template>
  <div ref="containerRef"></div>
</template>
