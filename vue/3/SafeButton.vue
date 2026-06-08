<!--
  SafeButton — Vue 3 button component.
  Implements button contract from safecontracts.
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
    data-component="button"
    :data-variant="config.metadata.variant"
    :data-size="config.metadata.size"
    :data-disabled="config.metadata.disabled"
    :data-loading="config.metadata.loading"
    :data-full-width="config.metadata.fullWidth"
    :data-icon-only="config.metadata.iconOnly"
    :data-selected="config.metadata.selected"
    :data-status="config.metadata.status"
    :data-group-variant="config.metadata.groupVariant"
    :data-group-direction="config.metadata.groupDirection"
  >
    <span v-if="config.metadata.label" data-role="label">{{ config.metadata.label }}</span>
  </div>
</template>
