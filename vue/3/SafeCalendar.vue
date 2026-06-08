<!--
  SafeCalendar — Vue 3 calendar component.
  Implements calendar contract from safecontracts.
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
    data-component="calendar"
    :data-variant="config.metadata.variant"
    :data-size="config.metadata.size"
  >
    <slot />
  </div>
</template>
