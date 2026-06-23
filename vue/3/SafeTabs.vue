<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import type { ConfigBase, OnSafeEvent } from 'safecontracts';
import { buildComponent } from '../../utils/render';

interface TabItem { key: string; label: string; child: string; icon?: string; }

const props = defineProps<{ config: ConfigBase; onEvent?: OnSafeEvent }>();

const tabs = (props.config.metadata.tabs as TabItem[]) ?? [];
const position = (props.config.metadata.position as string) ?? 'top';
const variant = (props.config.metadata.variant as string) ?? 'default';
const defaultActive = (props.config.metadata.defaultActive as string) ?? tabs[0]?.key ?? '';

const active = ref(defaultActive);
const panelRef = ref<HTMLElement | null>(null);
let mountedRoot: HTMLElement | null = null;

function renderActive() {
  if (!panelRef.value) return;
  mountedRoot?.remove();
  mountedRoot = null;
  const children = props.config.children as Record<string, ConfigBase> | undefined;
  const child = children?.[active.value];
  if (child) {
    mountedRoot = buildComponent(child, props.onEvent);
    panelRef.value.appendChild(mountedRoot);
  }
}

function select(key: string) {
  active.value = key;
  props.onEvent?.({ name: 'select', payload: { key }, handler: props.config.eventHandler?.handler });
}

onMounted(() => renderActive());
watch(active, () => renderActive());
onBeforeUnmount(() => { mountedRoot?.remove(); mountedRoot = null; });
</script>

<template>
  <div data-component="tabs" :data-variant="variant" :data-position="position">
    <div data-tabs-bar="" :data-position="position">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        data-tab=""
        v-bind="active === tab.key ? { 'data-active': '' } : {}"
        @click="select(tab.key)"
      >
        <span v-if="tab.icon" data-role="tab-icon">{{ tab.icon }}</span>
        <span data-role="tab-label">{{ tab.label }}</span>
      </button>
    </div>
    <div data-tabs-panel="">
      <div data-tab-content="" :data-tab-key="active" ref="panelRef"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'SafeTabs' };
</script>
