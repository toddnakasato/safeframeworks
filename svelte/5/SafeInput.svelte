<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeInput } from '../../builders/input';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  $effect(() => {
    container.innerHTML = '';
    root = createSafeInput(container, config, onEvent);
    return () => { root?.remove(); root = null; };
  });
</script>

<div bind:this={container}></div>
