<!--
  SafeTable — Vue 2 table component.
  Implements table contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'SafeTable',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
});
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
