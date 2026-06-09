<!--
  SafeButton — Svelte 4 button component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="button"
  data-variant={config.metadata.variant}
  data-size={config.metadata.size}
  data-disabled={config.metadata.disabled}
  data-loading={config.metadata.loading}
  data-full-width={config.metadata.fullWidth}
  data-icon-only={config.metadata.iconOnly}
  data-selected={config.metadata.selected}
  data-status={config.metadata.status}
  data-group-variant={config.metadata.groupVariant}
  data-group-direction={config.metadata.groupDirection}
>
  {#if config.metadata.icon}<span data-role="icon">{config.metadata.icon}</span>{/if}
    {#if config.metadata.label}<span data-role="label">{config.metadata.label}</span>{/if}
</div>
