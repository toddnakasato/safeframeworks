<!--
  SafeLayout — Vue 3 layout component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
</script>

<template>
  <div
    data-component="layout"
    :data-variant="config.metadata.variant"
  >
      <div style="color:var(--sd-text-dim,#6b7280);font-size:12px">Layout variant: {{ config.metadata.variant }}</div><slot />
  </div>
</template>
