<!--
  SafeTreemap — Vue 3 treemap component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
</script>

<template>
  <div
    data-component="treemap"
    :data-variant="config.metadata.variant"
  >
      <div style="display:grid;grid-template-columns:2fr 1fr;grid-template-rows:1fr 1fr;gap:2px;height:120px"><div style="background:var(--sd-accent,#3b82f6);color:white;padding:8px;grid-row:span 2;display:flex;align-items:center;justify-content:center;border-radius:4px">A: 50</div><div style="background:rgba(59,130,246,0.7);color:white;padding:8px;display:flex;align-items:center;justify-content:center;border-radius:4px">B: 30</div><div style="background:rgba(59,130,246,0.4);color:white;padding:8px;display:flex;align-items:center;justify-content:center;border-radius:4px">C: 20</div></div>
  </div>
</template>
