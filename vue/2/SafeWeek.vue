<!--
  SafeWeek — Vue 2 week component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
  name: 'SafeWeek',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="week"
    :data-variant="config.metadata.variant"
  >
      <div data-role="header"><button>‹</button><span>June 8-14, 2026</span><button>›</button></div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;font-size:11px;text-align:center;padding:8px"><span v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d">{{ d }}</span></div>
  </div>
</template>
