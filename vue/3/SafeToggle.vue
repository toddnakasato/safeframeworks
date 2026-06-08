<!--
  SafeToggle — Vue 3 toggle component.
  Implements toggle contract from safecontracts.
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
    data-component="toggle"
    :data-variant="config.metadata.variant"
    :data-disabled="config.metadata.disabled"
    :data-label-position="config.metadata.labelPosition"
  >
    <slot />
  </div>
</template>
