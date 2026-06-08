<!--
  SafeColumns — Vue 2 columns component.
  Implements columns contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'SafeColumns',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="columns"
    :data-spacing="config.metadata.spacing"
    :data-radius="config.metadata.radius"
    :data-surface="config.metadata.surface"
  >
    <slot />
  </div>
</template>
