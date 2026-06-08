<!--
  SafeSankey — Svelte 5 sankey component.
  Implements sankey contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="sankey"
  data-variant={config.metadata.variant}
>
  <slot />
</div>
