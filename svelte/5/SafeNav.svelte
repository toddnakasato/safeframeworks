<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeNav } from '../../builders/nav';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  $effect(() => {
    container.innerHTML = '';
    root = createSafeNav(container, config, onEvent);
    return () => { root?.remove(); root = null; };
  });
</script>

<div bind:this={container} data-nav-host></div>
