<!--
  SafeTabs — Svelte 5 tabs component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="tabs"
  data-variant={config.metadata.variant}
  data-position={config.metadata.position}
>
  <div data-tabs-bar>{#each (config.metadata.tabs || []) as tab}<button data-role="tab" data-tab-key={tab.key}>{tab.label}</button>{/each}</div><div data-tabs-panel><slot /></div>
</div>
