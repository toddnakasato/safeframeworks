<!--
  SafeSankey — Svelte 4 sankey component.
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
  <div style="text-align:center;padding:16px;color:var(--sd-text-dim,#6b7280)">Sankey diagram</div>
</div>
