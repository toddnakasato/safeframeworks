<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeWeek } from '../../builders/week';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  onMount(() => {
    root = createSafeWeek(container, config, onEvent);
  });

  onDestroy(() => {
    root?.remove();
    root = null;
  });
</script>

<div bind:this={container}></div>
