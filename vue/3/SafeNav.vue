<!--
  SafeNav — Vue 3 nav component.
  Implements nav contract from safecontracts.
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
    data-component="nav"
    :data-nav-style="config.metadata.navStyle"
  >
    <div :data-nav-style="config.metadata.navStyle">
      <slot />
    </div>
  </div>
</template>
