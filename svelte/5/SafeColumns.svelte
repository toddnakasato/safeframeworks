<!--
  SafeColumns — Svelte 5 columns component.
  Implements columns contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="columns"
  data-spacing={config.metadata.spacing}
  data-radius={config.metadata.radius}
  data-surface={config.metadata.surface}
>
  <slot />
</div>
