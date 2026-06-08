<!--
  SafeTreemap — Svelte 5 treemap component.
  Implements treemap contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="treemap"
  data-variant={config.metadata.variant}
>
  <slot />
</div>
