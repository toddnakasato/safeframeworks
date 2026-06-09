<!--
  SafeCallout — Vue 2 callout component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
  name: 'SafeCallout',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
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
