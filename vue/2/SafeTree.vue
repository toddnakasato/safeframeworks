<!--
  SafeTree — Vue 2 tree component.
  Implements tree contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'SafeTree',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="tree"
    :data-variant="config.metadata.variant"
    :data-spacing="config.metadata.spacing"
  >
    <slot />
  </div>
</template>
