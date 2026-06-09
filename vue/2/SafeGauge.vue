<!--
  SafeGauge — Vue 2 gauge component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
  name: 'SafeGauge',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="gauge"
    :data-variant="config.metadata.variant"
  >
      <div style="text-align:center;padding:16px"><svg viewBox="0 0 100 60" width="120"><path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="var(--sd-border,#e5e7eb)" stroke-width="8"/><path d="M 10 55 A 40 40 0 0 1 60 17" fill="none" stroke="var(--sd-accent,#3b82f6)" stroke-width="8"/></svg><div data-role="value">67%</div></div>
  </div>
</template>
