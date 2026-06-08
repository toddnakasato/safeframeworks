<!--
  SafeInput — Vue 3 input component.
  Implements input contract from safecontracts.
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
    data-component="input"
    :data-input-type="config.metadata.inputType"
    :data-align="config.metadata.align"
    :data-valign="config.metadata.valign"
  >
    <div :data-input-type="config.metadata.inputType">
      <slot />
    </div>
  </div>
</template>
