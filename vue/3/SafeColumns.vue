<!--
  SafeColumns — Vue 3 columns component.
  Implements columns contract from safecontracts.
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
    data-component="columns"
    :data-spacing="config.metadata.spacing"
    :data-radius="config.metadata.radius"
    :data-surface="config.metadata.surface"
  >
    <slot />
  </div>
</template>
