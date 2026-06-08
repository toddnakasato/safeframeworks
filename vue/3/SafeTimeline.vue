<!--
  SafeTimeline — Vue 3 timeline component.
  Implements timeline contract from safecontracts.
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
    data-component="timeline"
    :data-variant="config.metadata.variant"
  >
    <slot />
  </div>
</template>
