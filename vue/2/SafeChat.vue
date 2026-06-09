<!--
  SafeChat — Vue 2 chat component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
  name: 'SafeChat',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
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
