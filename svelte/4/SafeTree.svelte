<!--
  SafeTree — Svelte 5 tree component.
  Implements tree contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="tree"
  data-variant={config.metadata.variant}
  data-spacing={config.metadata.spacing}
>
  <slot />
</div>
