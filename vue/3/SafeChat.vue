<!--
  SafeChat — Vue 3 chat component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
</script>

<template>
  <div
    data-component="chat"
  >
      <div v-if="config.metadata.title" data-role="title">{{ config.metadata.title }}</div>
      <div data-role="messages"><div data-role="message" data-sender="system">Welcome to chat</div></div>
      <div data-role="input"><input :placeholder="config.metadata.placeholder || 'Type a message...'" /></div>
  </div>
</template>
