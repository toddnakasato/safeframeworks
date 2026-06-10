<!--
  SafeSankey — Svelte 5 sankey component.
  Renders via shared-mapping sankey builder (./sankey) — identical across frameworks.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { renderSafeSankey, sankeyData } from './sankey';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let svg: SVGSVGElement;

  onMount(() => {
    renderSafeSankey(svg, config, sankeyData(config), onEvent);
  });
</script>

<div
  data-component="sankey"
  data-variant={config.metadata.variant}
>
  {#if config.metadata.title}<div data-role="title">{config.metadata.title}</div>{/if}
  <svg bind:this={svg} data-sankey-svg></svg>
</div>
