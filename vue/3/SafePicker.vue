<!--
  SafePicker — Vue 3 picker component.
  Implements picker contract from safecontracts.
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
    data-component="picker"
    :data-variant="config.metadata.variant"
  >
    <slot />
  </div>
</template>
