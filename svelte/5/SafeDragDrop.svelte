<!--
  SafeDragDrop — Svelte 5 drag-and-drop (generic / file / palette).
  Renders via shared-mapping dragdrop builder (./dragdrop) — identical across
  frameworks. Structure + data-* only.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  import { createSafeDragDrop } from './dragdrop';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();

  let container: HTMLElement;
  let root: HTMLElement | null = null;

  onMount(() => {
    root = createSafeDragDrop(container, config, onEvent);
  });

  onDestroy(() => {
    root?.remove();
    root = null;
  });
</script>

<div bind:this={container}></div>
