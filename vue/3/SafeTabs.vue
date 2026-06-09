<!--
  SafeTabs — Vue 3 tabs component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
</script>

<template>
  <div
    data-component="tabs"
    :data-variant="config.metadata.variant"
    :data-position="config.metadata.position"
  >
      <div data-tabs-bar><button v-for="tab in (config.metadata.tabs || [])" :key="tab.key" data-role="tab" :data-tab-key="tab.key">{{ tab.label }}</button></div><div data-tabs-panel><slot /></div>
  </div>
</template>
