<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { buildComponent } from '../../utils/render';

const props = defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
const containerRef = ref<HTMLElement | null>(null);
let root: HTMLElement | null = null;

onMounted(() => {
  if (containerRef.value) {
    root = buildComponent(props.config, props.onEvent);
    containerRef.value.appendChild(root);
  }
});

onBeforeUnmount(() => {
  root?.remove();
  root = null;
  }
});
</script>

<template>
  <div ref="containerRef"></div>
</template>
