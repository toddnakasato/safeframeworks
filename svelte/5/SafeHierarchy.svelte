<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeHierarchy } from '../../builders/hierarchy';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  onMount(() => {
    root = createSafeHierarchy(container, config, onEvent);
  });
  onDestroy(() => { root?.remove(); root = null; });
</script>

<div bind:this={container}></div>
