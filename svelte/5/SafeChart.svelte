<!--
  SafeChart — Svelte 5 chart component.
  Implements chart contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="chart"
  data-variant={config.metadata.variant}
  data-chart-type={config.metadata.chartType}
>
  <slot />
</div>
