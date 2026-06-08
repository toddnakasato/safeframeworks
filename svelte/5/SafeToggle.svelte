<!--
  SafeToggle — Svelte 5 toggle component.
  Implements toggle contract from safecontracts.
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
  <slot />
</div>
