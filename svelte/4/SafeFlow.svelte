<script lang="ts">
  import { afterUpdate } from 'svelte';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeFlow, flowData } from '../../builders/flow';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;

  let svg: SVGSVGElement;

  afterUpdate(() => {
    svg.innerHTML = '';
    createSafeFlow(svg, config, flowData(config), onEvent);
  });
</script>

<div>
  {#if config.metadata.title}<div data-role="title">{config.metadata.title}</div>{/if}
  <svg bind:this={svg} data-flow-svg></svg>
</div>
