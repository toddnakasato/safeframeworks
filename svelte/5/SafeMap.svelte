<!--
  SafeMap — Svelte 5 map component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="map"
  data-variant={config.metadata.variant}
>
  <div style="height:120px;background:var(--sd-surface-raised,#f3f4f6);display:flex;align-items:center;justify-content:center;border-radius:4px;color:var(--sd-text-dim,#6b7280)">Map</div>
</div>
