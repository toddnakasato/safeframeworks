<!--
  SafeFunnel — Vue 3 funnel component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
</script>

<template>
  <div
    data-component="funnel"
    :data-variant="config.metadata.variant"
  >
      <div style="display:flex;flex-direction:column;gap:4px;padding:8px"><div style="background:var(--sd-accent,#3b82f6);color:white;padding:8px;text-align:center;border-radius:4px;width:100%">Leads: 100</div><div style="background:var(--sd-accent,#3b82f6);color:white;padding:8px;text-align:center;border-radius:4px;width:75%;margin:0 auto">Qualified: 75</div><div style="background:var(--sd-accent,#3b82f6);color:white;padding:8px;text-align:center;border-radius:4px;width:50%;margin:0 auto">Won: 50</div></div>
  </div>
</template>
