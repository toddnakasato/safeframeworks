<!--
  SafeLayout — Vue 3 layout component.
  Implements layout contract from safecontracts.
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
    data-component="layout"
    :data-variant="config.metadata.variant"
  >
    <slot />
  </div>
</template>
