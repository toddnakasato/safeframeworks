<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { buildComponent } from '../../utils/render';
  import { onMount, afterUpdate, onDestroy } from 'svelte';

  interface TabItem { key: string; label: string; child: string; icon?: string; }

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;

  const tabs: TabItem[] = (config.metadata.tabs as TabItem[]) ?? [];
  const position: string = (config.metadata.position as string) ?? 'top';
  const variant: string = (config.metadata.variant as string) ?? 'default';

  let active: string = (config.metadata.defaultActive as string) ?? tabs[0]?.key ?? '';
  let panel: HTMLElement;
  let mountedRoot: HTMLElement | null = null;

  function renderActive() {
    if (!panel) return;
    mountedRoot?.remove();
    mountedRoot = null;
    const children = config.children as Record<string, ConfigBase> | undefined;
    const child = children?.[active];
    if (child) {
      mountedRoot = buildComponent(child, onEvent);
      panel.appendChild(mountedRoot);
    }
  }

  function select(key: string) {
    active = key;
    onEvent?.({ name: 'select', payload: { key }, handler: config.eventHandler?.handler } as any);
  }

  onMount(() => renderActive());
  afterUpdate(() => renderActive());
  onDestroy(() => { mountedRoot?.remove(); mountedRoot = null; });
</script>

<div data-component="tabs" data-variant={variant} data-position={position}>
  <div data-tabs-bar="" data-position={position}>
    {#each tabs as tab (tab.key)}
      <button
        data-tab=""
        data-active={active === tab.key ? '' : undefined}
        on:click={() => select(tab.key)}
      >
        {#if tab.icon}<span data-role="tab-icon">{tab.icon}</span>{/if}
        <span data-role="tab-label">{tab.label}</span>
      </button>
    {/each}
  </div>
  <div data-tabs-panel="">
    <div data-tab-content="" data-tab-key={active} bind:this={panel}></div>
  </div>
</div>
