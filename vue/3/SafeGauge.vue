<!--
  SafeGauge — Vue 3 gauge component.
  Implements gauge contract from safecontracts.
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
    data-component="gauge"
    :data-variant="config.metadata.variant"
  >
    <slot />
  </div>
</template>
