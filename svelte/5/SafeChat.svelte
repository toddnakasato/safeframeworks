<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeChat } from '../../builders/chat';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  $effect(() => {
    container.innerHTML = '';
    root = createSafeChat(container, config, onEvent);
    return () => { root?.remove(); root = null; };
  });
</script>

<div bind:this={container}></div>
