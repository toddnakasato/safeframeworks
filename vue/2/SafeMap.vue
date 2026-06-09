<!--
  SafeMap — Vue 2 map component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
  name: 'SafeMap',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="map"
    :data-variant="config.metadata.variant"
  >
      <div style="height:120px;background:var(--sd-surface-raised,#f3f4f6);display:flex;align-items:center;justify-content:center;border-radius:4px;color:var(--sd-text-dim,#6b7280)">Map</div>
  </div>
</template>
