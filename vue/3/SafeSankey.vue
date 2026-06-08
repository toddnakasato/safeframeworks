<!--
  SafeSankey — Vue 3 sankey component.
  Implements sankey contract from safecontracts.
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
    data-component="sankey"
    :data-variant="config.metadata.variant"
  >
    <slot />
  </div>
</template>
