<!--
  SafeTreemap — Vue 3 treemap component.
  Implements treemap contract from safecontracts.
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
    data-component="treemap"
    :data-variant="config.metadata.variant"
  >
    <slot />
  </div>
</template>
