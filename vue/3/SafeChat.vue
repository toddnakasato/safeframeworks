<!--
  SafeChat — Vue 3 chat component.
  Implements chat contract from safecontracts.
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
    data-component="chat"
  >
    <div data-role="title" v-if="config.metadata.title">{{ config.metadata.title }}</div>
    <div data-role="messages">
      <slot />
    </div>
  </div>
</template>
