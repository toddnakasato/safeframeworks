<script lang="ts">
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { buildComponent } from '../../utils/render';
import type * as L from 'leaflet';
import { defineComponent, type PropType } from 'vue';

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
    <div ref="mapContainer" data-map-container></div>
  </div>
</template>
