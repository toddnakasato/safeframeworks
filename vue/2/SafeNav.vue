<!--
  SafeNav — Vue 2 nav component.
  Implements nav contract from safecontracts.
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
    <div :data-nav-style="config.metadata.navStyle">
      <slot />
    </div>
  </div>
</template>
