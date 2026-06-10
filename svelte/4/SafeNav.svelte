<!--
  SafeNav — Svelte 4 nav component.
  navStyle "accordion" renders via shared-mapping nav builder (./nav) —
  identical across frameworks (figma Shopfront design).
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeNav } from './nav';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  onMount(() => {
    root = createSafeNav(container, config, onEvent);
  });

  onDestroy(() => {
    root?.remove();
    root = null;
  });
</script>

<div bind:this={container} data-nav-host></div>
