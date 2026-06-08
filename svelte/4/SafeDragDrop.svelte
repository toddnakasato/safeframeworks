<!--
  SafeDragDrop — Svelte 5 drag-drop component.
  Implements drag-drop contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="drag-drop"
  data-variant={config.metadata.variant}
>
  <slot />
</div>
