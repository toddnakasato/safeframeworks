<!--
  SafeFunnel — Svelte 5 funnel component.
  Implements funnel contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="funnel"
  data-variant={config.metadata.variant}
>
  <slot />
</div>
