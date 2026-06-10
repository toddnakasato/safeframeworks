<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeNav } from '../../builders/nav';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  onMount(() => {
    root = createSafeNav(container, config, onEvent);
  });

  onDestroy(() => {
    root?.remove();
    root = null;
  });
</script>

<div bind:this={container} data-nav-host></div>
