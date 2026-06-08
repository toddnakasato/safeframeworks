<!--
  SafeCard — Svelte 5 card component.
  Implements card contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="card"
  data-variant={config.metadata.variant}
  data-surface={config.metadata.surface}
  data-spacing={config.metadata.spacing}
  data-radius={config.metadata.radius}
  data-density={config.metadata.density}
>
  {#if config.metadata.header}<div data-role="header">{config.metadata.header}</div>{/if}
  <slot />
</div>
