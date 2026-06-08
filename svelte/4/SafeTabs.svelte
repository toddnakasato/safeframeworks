<!--
  SafeTabs — Svelte 5 tabs component.
  Implements tabs contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="tabs"
  data-variant={config.metadata.variant}
  data-position={config.metadata.position}
>
  <div data-tabs-bar>
    <slot />
  </div>
</div>
