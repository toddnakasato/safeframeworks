<!--
  SafeHeatmap — Svelte 5 heatmap component.
  Implements heatmap contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="heatmap"
  data-variant={config.metadata.variant}
>
  <slot />
</div>
