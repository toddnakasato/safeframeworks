<!--
  SafeSankey — Vue 3 sankey component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
</script>

<template>
  <div
    data-component="sankey"
    :data-variant="config.metadata.variant"
  >
      <div style="text-align:center;padding:16px;color:var(--sd-text-dim,#6b7280)">Sankey diagram</div>
  </div>
</template>
