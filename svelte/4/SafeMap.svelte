<script lang="ts">
  import { onDestroy } from 'svelte';
  import { afterUpdate } from 'svelte';
  import type * as L from 'leaflet';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeFireContext } from 'safecontracts';
  import { buildPayloadViaCli } from '../../utils/payload-delegate';
  import { createSafeMap, mapData } from '../../builders/map';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;

  let container: HTMLElement;
  let map: L.Map | null = null;

  afterUpdate(() => {
    map?.remove();
    map = createSafeMap(container, config, mapData(config), onEvent);
  });

  onDestroy(() => {
    map?.remove();
    map = null;
  });
</script>

<div
  data-component="map"
  data-variant={config.metadata.variant}
>
  <div bind:this={container} data-map-container></div>
</div>
