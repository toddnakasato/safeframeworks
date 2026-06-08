<!--
  SafeChat — Svelte 5 chat component.
  Implements chat contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="chat"
>
  {#if config.metadata.title}<div data-role="title">{config.metadata.title}</div>{/if}
  <div data-role="messages">
    <slot />
  </div>
</div>
