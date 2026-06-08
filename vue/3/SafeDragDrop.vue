<!--
  SafeDragDrop — Vue 3 drag-drop component.
  Implements drag-drop contract from safecontracts.
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
    data-component="drag-drop"
    :data-variant="config.metadata.variant"
  >
    <slot />
  </div>
</template>
