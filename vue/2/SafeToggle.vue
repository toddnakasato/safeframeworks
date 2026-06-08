<!--
  SafeToggle — Vue 2 toggle component.
  Implements toggle contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'SafeToggle',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="toggle"
    :data-variant="config.metadata.variant"
    :data-disabled="config.metadata.disabled"
    :data-label-position="config.metadata.labelPosition"
  >
    <slot />
  </div>
</template>
