<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { buildComponent } from '../../utils/render';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  $effect(() => {
    container.innerHTML = '';
    root = buildComponent(config, onEvent);
    container.appendChild(root);
    return () => { root?.remove(); root = null; };
  });
</script>

<div bind:this={container}></div>