<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { buildComponent } from '../../utils/render';

  interface TabItem { key: string; label: string; child: string; icon?: string; }

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  const tabs: TabItem[] = (config.metadata.tabs as TabItem[]) ?? [];
  const position: string = (config.metadata.position as string) ?? 'top';
  const variant: string = (config.metadata.variant as string) ?? 'default';

  let active = $state((config.metadata.defaultActive as string) ?? tabs[0]?.key ?? '');
  let panel: HTMLElement | undefined = $state(undefined);

  $effect(() => {
    if (!panel) return;
    panel.innerHTML = '';
    const children = config.children as Record<string, ConfigBase> | undefined;
    const child = children?.[active];
    if (child) {
      const root = buildComponent(child, onEvent);
      panel.appendChild(root);
    }
  });

  function select(key: string) {
    active = key;
    onEvent?.({ name: 'select', payload: { key }, handler: config.eventHandler?.handler });
  }
</script>

<div data-component="tabs" data-variant={variant} data-position={position}>
  <div data-tabs-bar="" data-position={position}>
    {#each tabs as tab (tab.key)}
      <button
        data-tab=""
        data-active={active === tab.key ? '' : undefined}
        onclick={() => select(tab.key)}
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
