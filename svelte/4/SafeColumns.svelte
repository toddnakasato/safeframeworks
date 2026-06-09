<!--
  SafeColumns — Svelte 4 columns component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="columns"
  data-spacing={config.metadata.spacing}
  data-radius={config.metadata.radius}
  data-surface={config.metadata.surface}
>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div style="padding:8px;border:1px solid var(--sd-border,#e5e7eb);border-radius:4px">Column 1</div><div style="padding:8px;border:1px solid var(--sd-border,#e5e7eb);border-radius:4px">Column 2</div></div>
</div>
