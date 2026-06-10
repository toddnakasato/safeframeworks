<!--
  SafeMap — Vue 2 map component.
  Renders via shared-mapping map builder (./map) — identical across frameworks.
  Leaflet + OpenStreetMap. Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import type * as L from 'leaflet';
import { defineComponent, type PropType } from 'vue';
import { createSafeMap, mapData } from './map';

export default defineComponent({
  name: 'SafeMap',
  props: {
    config: { type: Object as PropType<ConfigBase>, required: true },
    onEvent: { type: Function as PropType<OnSafeEvent>, default: undefined },
  },
  data() {
    return { map: null as L.Map | null };
  },
  mounted() {
    const el = this.$refs.mapContainer as HTMLElement;
    if (el) this.map = createSafeMap(el, this.config, mapData(this.config), this.onEvent);
  },
  beforeDestroy() {
    this.map?.remove();
    this.map = null;
  },
});
</script>

<template>
  <div
    data-component="map"
    :data-variant="config.metadata.variant"
  >
    <div ref="mapContainer" style="width:100%;height:360px;border-radius:var(--sd-radius-md,6px);overflow:hidden"></div>
  </div>
</template>
