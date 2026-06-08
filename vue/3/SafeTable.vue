<!--
  SafeTable — Vue 3 table component.
  Implements table contract from safecontracts.
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
    data-component="table"
    :data-variant="config.metadata.variant"
    :data-spacing="config.metadata.spacing"
    :data-header-style="config.metadata.headerStyle"
    :data-row-divider="config.metadata.rowDivider"
    :data-row-numbers="config.metadata.rowNumbers"
    :data-truncate="config.metadata.truncate"
    :data-column-lines="config.metadata.columnLines"
    :data-header-divider="config.metadata.headerDivider"
    :data-zebra="config.metadata.zebra"
    :data-selectable="config.metadata.selectable"
  >
    <div data-role="scroll">
      <slot />
    </div>
  </div>
</template>
