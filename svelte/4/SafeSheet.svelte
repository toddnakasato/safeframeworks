<!--
  SafeSheet — Svelte 5 sheet component.
  Implements sheet contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="sheet"
  data-variant={config.metadata.variant}
  data-spacing={config.metadata.spacing}
  data-surface={config.metadata.surface}
>
  <slot />
</div>
