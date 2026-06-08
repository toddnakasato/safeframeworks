<!--
  SafeCalendar — Vue 2 calendar component.
  Implements calendar contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'SafeCalendar',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="calendar"
    :data-variant="config.metadata.variant"
    :data-size="config.metadata.size"
  >
    <slot />
  </div>
</template>
