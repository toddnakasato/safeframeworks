<!--
  SafeNav — Vue 2 nav component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
  name: 'SafeNav',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
</script>

<template>
  <div
    data-component="nav"
    :data-nav-style="config.metadata.navStyle"
  >
      <div v-if="config.metadata.title" data-nav-header><div data-nav-logo>{{ config.metadata.title?.charAt(0) }}</div><div data-nav-title>{{ config.metadata.title }}</div></div>
      <nav data-nav-main><slot /></nav>
  </div>
</template>
