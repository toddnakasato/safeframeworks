<script lang="ts">
  import type * as L from 'leaflet';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { buildComponent } from '../../utils/render';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let container: HTMLElement;
  let map: L.Map | null = null;

  $effect(() => {
    map?.remove();
    map = createSafeMap(container, config, mapData(config), onEvent);
    return () => { map?.remove(); map = null; };
  });
</script>

<div
  data-component="map"
  data-variant={config.metadata.variant}
>
  <div bind:this={container} data-map-container></div>
</div>