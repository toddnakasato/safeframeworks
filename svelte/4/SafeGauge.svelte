<!--
  SafeGauge — Svelte 5 gauge component.
  Implements gauge contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="gauge"
  data-variant={config.metadata.variant}
>
  <slot />
</div>
