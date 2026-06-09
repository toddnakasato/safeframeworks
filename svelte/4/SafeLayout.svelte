<!--
  SafeLayout — Svelte 4 layout component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="layout"
  data-variant={config.metadata.variant}
>
  <div style="color:var(--sd-text-dim,#6b7280);font-size:12px">Layout variant: {config.metadata.variant}</div><slot />
</div>
