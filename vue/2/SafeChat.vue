<!--
  SafeChat — Vue 2 chat component.
  Implements chat contract from safecontracts.
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
    <div data-role="title" v-if="config.metadata.title">{{ config.metadata.title }}</div>
    <div data-role="messages">
      <slot />
    </div>
  </div>
</template>
