<!--
  SafeToggle — Svelte 5 toggle component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="toggle"
  data-variant={config.metadata.variant}
  data-disabled={config.metadata.disabled}
  data-label-position={config.metadata.labelPosition}
>
  <label data-role="toggle-label"><input type="checkbox" data-role="toggle-input" checked={config.metadata.checked} disabled={config.metadata.disabled} /><span data-role="toggle-slider"></span>{#if config.metadata.label}<span data-role="label">{config.metadata.label}</span>{/if}</label>
</div>
