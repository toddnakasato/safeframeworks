<!--
  SafeGrid — Vue 3 grid component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
</script>

<template>
  <div
    data-component="grid"
    :data-spacing="config.metadata.spacing"
    :data-radius="config.metadata.radius"
    :data-surface="config.metadata.surface"
    :data-collapsible="config.metadata.collapsible"
  >
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:8px"><div style="padding:8px;border:1px solid var(--sd-border,#e5e7eb);border-radius:4px">Cell 1</div><div style="padding:8px;border:1px solid var(--sd-border,#e5e7eb);border-radius:4px">Cell 2</div></div>
  </div>
</template>
