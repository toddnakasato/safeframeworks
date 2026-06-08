<!--
  SafeCard — Vue 3 card component.
  Implements card contract from safecontracts.
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
    data-component="card"
    :data-variant="config.metadata.variant"
    :data-surface="config.metadata.surface"
    :data-spacing="config.metadata.spacing"
    :data-radius="config.metadata.radius"
    :data-density="config.metadata.density"
  >
    <div v-if="config.metadata.header" data-role="header">{{ config.metadata.header }}</div>
    <slot />
  </div>
</template>
