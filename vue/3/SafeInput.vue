<!--
  SafeInput — Vue 3 input component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
</script>

<template>
  <div
    data-component="input"
    :data-input-type="config.metadata.inputType"
    :data-align="config.metadata.align"
    :data-valign="config.metadata.valign"
  >
      <div data-role="field"><input :placeholder="config.metadata.placeholder || 'Enter value...'" data-role="field" /></div>
  </div>
</template>
