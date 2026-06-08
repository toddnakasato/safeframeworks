<!--
  SafeTabs — Vue 3 tabs component.
  Implements tabs contract from safecontracts.
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
    data-component="tabs"
    :data-variant="config.metadata.variant"
    :data-position="config.metadata.position"
  >
    <div data-tabs-bar>
      <slot />
    </div>
  </div>
</template>
