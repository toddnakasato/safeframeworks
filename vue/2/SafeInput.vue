<!--
  SafeInput — Vue 2 input component.
  Implements input contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'SafeInput',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="input"
    :data-input-type="config.metadata.inputType"
    :data-align="config.metadata.align"
    :data-valign="config.metadata.valign"
  >
    <div :data-input-type="config.metadata.inputType">
      <slot />
    </div>
  </div>
</template>
