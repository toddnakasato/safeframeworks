<!--
  SafeCallout — Svelte 5 callout component.
  Implements callout contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="callout"
  data-variant={config.metadata.variant}
  data-position={config.metadata.position}
>
  <slot />
</div>
