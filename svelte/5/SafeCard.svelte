<!--
  SafeCard — Svelte 5 card component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="card"
  data-variant={config.metadata.variant}
  data-surface={config.metadata.surface}
  data-spacing={config.metadata.spacing}
  data-radius={config.metadata.radius}
  data-density={config.metadata.density}
>
  {#if config.metadata.title}<div data-role="header">{config.metadata.title}</div>{/if}
    {#if config.metadata.subtitle}<div data-role="subtitle">{config.metadata.subtitle}</div>{/if}
    <slot />
</div>
