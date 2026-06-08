<!--
  SafeTimeline — Svelte 5 timeline component.
  Implements timeline contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="timeline"
  data-variant={config.metadata.variant}
>
  <slot />
</div>
