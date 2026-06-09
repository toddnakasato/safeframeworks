<!--
  SafePicker — Vue 2 picker component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
  name: 'SafePicker',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="picker"
    :data-variant="config.metadata.variant"
  >
      <div data-role="search-form"><input data-role="search-input" placeholder="Search..." /></div><div data-role="list"><div data-role="list-item">Item 1</div><div data-role="list-item">Item 2</div><div data-role="list-item">Item 3</div></div>
  </div>
</template>
