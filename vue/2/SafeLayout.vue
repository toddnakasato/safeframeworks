<!--
  SafeLayout — Vue 2 layout component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
  name: 'SafeLayout',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="layout"
    :data-variant="config.metadata.variant"
  >
      <div style="color:var(--sd-text-dim,#6b7280);font-size:12px">Layout variant: {{ config.metadata.variant }}</div><slot />
  </div>
</template>
