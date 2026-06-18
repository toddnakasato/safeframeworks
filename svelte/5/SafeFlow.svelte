<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { buildComponent } from '../../utils/render';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let svg: SVGSVGElement;

  $effect(() => {
    svg.innerHTML = '';
    createSafeFlow(svg, config, flowData(config), onEvent);
  });
</script>

<div>
  {#if config.metadata.title}<div data-role="title">{config.metadata.title}</div>{/if}
  <svg bind:this={svg} data-flow-svg></svg>
</div>