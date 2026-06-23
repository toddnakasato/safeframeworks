<script lang="ts">
import { buildComponent } from '../../utils/render';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';

interface TabItem { key: string; label: string; child: string; icon?: string; }

export default {
  name: 'SafeTabs',
  props: {
    config: { type: Object, required: true },
    onEvent: { type: Function, default: undefined },
  },
  data() {
    const config = this.config as ConfigBase;
    const tabs = (config.metadata.tabs as TabItem[]) ?? [];
    return {
      tabs,
      active: (config.metadata.defaultActive as string) ?? tabs[0]?.key ?? '',
      mountedRoot: null as HTMLElement | null,
    };
  },
  computed: {
    tabVariant(): string { return (this.config.metadata.variant as string) ?? 'default'; },
    tabPosition(): string { return (this.config.metadata.position as string) ?? 'top'; },
  },
  methods: {
    select(key: string) {
      this.active = key;
      if (this.onEvent) {
        (this.onEvent as any)({ name: 'select', payload: { key }, handler: (this.config as ConfigBase).eventHandler?.handler });
      }
    },
    renderActive() {
      const panel = this.$refs.panel as HTMLElement | undefined;
      if (!panel) return;
      if (this.mountedRoot) { (this.mountedRoot as HTMLElement).remove(); (this as any).mountedRoot = null; }
      const children = (this.config as ConfigBase).children as Record<string, ConfigBase> | undefined;
      const child = children?.[this.active];
      if (child) {
        (this as any).mountedRoot = buildComponent(child, this.onEvent as any);
        panel.appendChild((this as any).mountedRoot);
      }
    },
  },
  mounted() { this.renderActive(); },
  watch: { active() { this.renderActive(); } },
  beforeDestroy() { if (this.mountedRoot) { (this.mountedRoot as HTMLElement).remove(); (this as any).mountedRoot = null; } },
};
</script>

<template>
  <div data-component="tabs" :data-variant="tabVariant" :data-position="tabPosition">
    <div data-tabs-bar="" :data-position="tabPosition">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        data-tab=""
        :data-active="active === tab.key ? '' : undefined"
        @click="select(tab.key)"
      >
        <span v-if="tab.icon" data-role="tab-icon">{{ tab.icon }}</span>
        <span data-role="tab-label">{{ tab.label }}</span>
      </button>
    </div>
    <div data-tabs-panel="">
      <div data-tab-content="" :data-tab-key="active" ref="panel"></div>
    </div>
  </div>
</template>
