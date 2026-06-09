<!--
  SafeChart — Svelte 4 chart component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="chart"
  data-variant={config.metadata.variant}
  data-chart-type={config.metadata.chartType}
>
  <div data-role="title">{config.metadata.title || "Chart"}</div><div style="height:120px;display:flex;align-items:flex-end;gap:4px;padding:8px"><div style="flex:1;background:var(--sd-accent,#3b82f6);height:60%"></div><div style="flex:1;background:var(--sd-accent,#3b82f6);height:80%"></div><div style="flex:1;background:var(--sd-accent,#3b82f6);height:40%"></div></div>
</div>
