<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { createSafeFireContext } from 'safecontracts';
import { buildPayloadViaCli } from '../../utils/payload-delegate';
import { createSafeInput } from '../../builders/input';

const props = defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
const containerRef = ref<HTMLElement | null>(null);
let root: HTMLElement | null = null;

onMounted(() => {
  if (containerRef.value) {
    const _ctx = createSafeFireContext(props.config, props.onEvent, buildPayloadViaCli);
    root = createSafeInput(containerRef.value, props.config, _ctx);
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
