<!--
  SafeSheet — Vue 3 sheet component.
  Implements sheet contract from safecontracts.
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
    data-component="sheet"
    :data-variant="config.metadata.variant"
    :data-spacing="config.metadata.spacing"
    :data-surface="config.metadata.surface"
  >
    <slot />
  </div>
</template>
