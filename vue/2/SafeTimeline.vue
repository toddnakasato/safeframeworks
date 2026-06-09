<!--
  SafeTimeline — Vue 2 timeline component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
  name: 'SafeTimeline',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="timeline"
    :data-variant="config.metadata.variant"
  >
      <div data-role="event"><div data-role="marker"><div data-role="dot"></div><div data-role="line"></div></div><div data-role="content"><div data-role="label">Event 1</div><div data-role="date">2026-01-01</div></div></div><div data-role="event"><div data-role="marker"><div data-role="dot"></div></div><div data-role="content"><div data-role="label">Event 2</div><div data-role="date">2026-06-01</div></div></div>
  </div>
</template>
