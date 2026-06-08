<!--
  SafeFunnel — Vue 3 funnel component.
  Implements funnel contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

defineProps<{
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}>();
</script>

<template>
  <div
    data-component="funnel"
    :data-variant="config.metadata.variant"
  >
    <slot />
  </div>
</template>
