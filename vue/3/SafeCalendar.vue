<!--
  SafeCalendar — Vue 3 calendar component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
</script>

<template>
  <div
    data-component="calendar"
    :data-variant="config.metadata.variant"
    :data-size="config.metadata.size"
  >
      <div data-role="header"><button data-role="prev">‹</button><span data-role="title">June 2026</span><button data-role="next">›</button></div>
  </div>
</template>
