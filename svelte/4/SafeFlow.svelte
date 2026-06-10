<script lang="ts">
  import { onMount } from 'svelte';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { renderSafeFlow, flowData } from '../../builders/flow';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;

  let svg: SVGSVGElement;

  onMount(() => {
    renderSafeFlow(svg, config, flowData(config), onEvent);
  });
</script>

<div>
  {#if config.metadata.title}<div data-role="title">{config.metadata.title}</div>{/if}
  <svg bind:this={svg} data-flow-svg></svg>
</div>
