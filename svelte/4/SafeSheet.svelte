<script lang="ts">
  import { onDestroy } from 'svelte';
  import { afterUpdate } from 'svelte';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeSheet } from '../../builders/sheet';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  afterUpdate(() => {
    root?.remove();
    container.innerHTML = '';
    root = createSafeSheet(container, config, onEvent);
  });

  onDestroy(() => {
    root?.remove();
    root = null;
  });
</script>

<div bind:this={container}></div>
