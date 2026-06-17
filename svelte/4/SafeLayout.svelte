<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeFireContext } from 'safecontracts';
  import { buildPayloadViaCli } from '../../utils/payload-delegate';
  import { createSafeLayout } from '../../builders/layout';
  import { buildComponent } from '../../utils/render';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  onMount(() => {
    const _ctx = createSafeFireContext(config, onEvent, buildPayloadViaCli);
    root = createSafeLayout(container, config, onEvent, buildComponent);
  });

  onDestroy(() => {
    root?.remove();
    root = null;
  });
</script>

<div bind:this={container}></div>
