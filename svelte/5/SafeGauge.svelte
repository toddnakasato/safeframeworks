<!--
  SafeGauge — Svelte 5 gauge component.
  Implements gauge contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="gauge"
  data-variant={config.metadata.variant}
>
  <slot />
</div>
