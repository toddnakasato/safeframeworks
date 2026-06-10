<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type * as L from 'leaflet';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeMap, mapData } from '../../builders/map';

const props = defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();

const containerRef = ref<HTMLElement | null>(null);
let map: L.Map | null = null;

onMounted(() => {
  if (containerRef.value) map = createSafeMap(containerRef.value, props.config, mapData(props.config), props.onEvent);
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});
</script>

<template>
  <div
    data-component="map"
    :data-variant="config.metadata.variant"
  >
    <div ref="containerRef" data-map-container></div>
  </div>
</template>
