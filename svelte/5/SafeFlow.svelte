<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { renderSafeFlow, flowData } from '../../builders/flow';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let svg: SVGSVGElement;

  $effect(() => {
    svg.innerHTML = '';
    renderSafeFlow(svg, config, flowData(config), onEvent);
  });
</script>

<div>
  {#if config.metadata.title}<div data-role="title">{config.metadata.title}</div>{/if}
  <svg bind:this={svg} data-flow-svg></svg>
</div>
