<!--
  SafeTree — Vue 3 tree component.
  Implements tree contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

defineProps<{
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}>();
</script>

<template>
  <div
    data-component="tree"
    :data-variant="config.metadata.variant"
    :data-spacing="config.metadata.spacing"
  >
    <slot />
  </div>
</template>
