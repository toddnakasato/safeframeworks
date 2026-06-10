<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeTable } from '../../builders/table';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  onMount(() => {
    root = createSafeTable(container, config, onEvent);
  });

  onDestroy(() => {
    root?.remove();
    root = null;
  });
</script>

<div bind:this={container}></div>
