<!--
  SafeSheet — Vue 2 sheet component.
  Implements sheet contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'SafeSheet',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="sheet"
    :data-variant="config.metadata.variant"
    :data-spacing="config.metadata.spacing"
    :data-surface="config.metadata.surface"
  >
    <slot />
  </div>
</template>
