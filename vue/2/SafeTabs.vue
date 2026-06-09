<!--
  SafeTabs — Vue 2 tabs component.
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
      <div data-tabs-bar><button v-for="tab in (config.metadata.tabs || [])" :key="tab.key" data-role="tab" :data-tab-key="tab.key">{{ tab.label }}</button></div><div data-tabs-panel><slot /></div>
  </div>
</template>
