<!--
  SafeNav — Vue 3 nav component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script setup lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();
</script>

<template>
  <div
    data-component="nav"
    :data-nav-style="config.metadata.navStyle"
  >
      <div v-if="config.metadata.title" data-nav-header><div data-nav-logo>{{ config.metadata.title?.charAt(0) }}</div><div data-nav-title>{{ config.metadata.title }}</div></div>
      <nav data-nav-main><slot /></nav>
  </div>
</template>
