<!--
  SafeMap — Svelte 5 map component.
  Renders via shared-mapping map builder (./map) — identical across frameworks.
  Leaflet + OpenStreetMap. Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type * as L from 'leaflet';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeMap, mapData } from './map';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let container: HTMLElement;
  let map: L.Map | null = null;

  onMount(() => {
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
