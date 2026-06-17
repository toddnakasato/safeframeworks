<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeFireContext } from 'safecontracts';
  import { buildPayloadViaCli } from '../../utils/payload-delegate';
  import { createSafeCard } from '../../builders/card';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  $effect(() => {
    container.innerHTML = '';
    const _ctx = createSafeFireContext(config, onEvent, buildPayloadViaCli);
    root = createSafeCard(container, config, _ctx);
    return () => { root?.remove(); root = null; };
  });
</script>

<div bind:this={container}></div>
