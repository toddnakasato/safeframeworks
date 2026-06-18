<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { buildComponent } from '../../utils/render';
  import { onMount, onDestroy } from 'svelte';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
  let container: HTMLElement;
  let root: HTMLElement | null = null;

  onMount(() => {
    root = buildComponent(config, onEvent);
    container.appendChild(root);
  });
  onDestroy(() => { root?.remove(); root = null; });
</script>
<div bind:this={container}></div>
