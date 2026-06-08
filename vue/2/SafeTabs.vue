<!--
  SafeTabs — Vue 2 tabs component.
  Implements tabs contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'SafeTabs',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="tabs"
    :data-variant="config.metadata.variant"
    :data-position="config.metadata.position"
  >
    <div data-tabs-bar>
      <slot />
    </div>
  </div>
</template>
