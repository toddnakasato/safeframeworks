<!--
  SafeGrid — Vue 2 grid component.
  Implements grid contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'SafeGrid',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="grid"
    :data-spacing="config.metadata.spacing"
    :data-radius="config.metadata.radius"
    :data-surface="config.metadata.surface"
    :data-collapsible="config.metadata.collapsible"
  >
    <slot />
  </div>
</template>
