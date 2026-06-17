<script lang="ts">
  import { onDestroy } from 'svelte';
  import { afterUpdate } from 'svelte';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeFireContext } from 'safecontracts';
  import { buildPayloadViaCli } from '../../utils/payload-delegate';
  import { createSafeHeatmap } from '../../builders/heatmap';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  afterUpdate(() => {
    root?.remove();
    container.innerHTML = '';
    const _ctx = createSafeFireContext(config, onEvent, buildPayloadViaCli);
    root = createSafeHeatmap(container, config, _ctx);
  });

  onDestroy(() => {
    root?.remove();
    root = null;
  });
</script>

<div bind:this={container}></div>
