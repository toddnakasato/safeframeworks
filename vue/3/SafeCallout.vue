<!--
  SafeCallout — Vue 3 callout component.
  Implements callout contract from safecontracts.
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
    data-component="callout"
    :data-variant="config.metadata.variant"
    :data-position="config.metadata.position"
  >
    <slot />
  </div>
</template>
