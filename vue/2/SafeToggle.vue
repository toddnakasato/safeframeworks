<!--
  SafeToggle — Vue 2 toggle component.
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
      <label data-role="toggle-label"><input type="checkbox" data-role="toggle-input" :checked="config.metadata.checked" :disabled="config.metadata.disabled" /><span data-role="toggle-slider"></span><span v-if="config.metadata.label" data-role="label">{{ config.metadata.label }}</span></label>
  </div>
</template>
