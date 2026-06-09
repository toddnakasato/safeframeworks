<!--
  SafeCard — Vue 2 card component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
  name: 'SafeCard',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="card"
    :data-variant="config.metadata.variant"
    :data-surface="config.metadata.surface"
    :data-spacing="config.metadata.spacing"
    :data-radius="config.metadata.radius"
    :data-density="config.metadata.density"
  >
      <div v-if="config.metadata.title" data-role="header">{{ config.metadata.title }}</div>
      <div v-if="config.metadata.subtitle" data-role="subtitle">{{ config.metadata.subtitle }}</div>
      <slot />
  </div>
</template>
