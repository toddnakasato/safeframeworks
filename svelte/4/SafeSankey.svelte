<script lang="ts">
  import { onMount } from 'svelte';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { renderSafeSankey, sankeyData } from '../../builders/sankey';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;

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
