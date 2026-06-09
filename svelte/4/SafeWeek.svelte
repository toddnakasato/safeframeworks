<!--
  SafeWeek — Svelte 4 week component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="week"
  data-variant={config.metadata.variant}
>
  <div data-role="header"><button>‹</button><span>June 8-14, 2026</span><button>›</button></div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;font-size:11px;text-align:center;padding:8px">{#each ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] as d}<span>{d}</span>{/each}</div>
</div>
