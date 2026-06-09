<!--
  SafeCallout — Vue 3 callout component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
</script>

<template>
  <div
    data-component="callout"
    :data-variant="config.metadata.variant"
    :data-position="config.metadata.position"
  >
      <div data-role="message">{{ config.metadata.message || "Callout" }}</div>
  </div>
</template>
