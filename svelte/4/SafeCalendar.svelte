<!--
  SafeCalendar — Svelte 5 calendar component.
  Implements calendar contract from safecontracts.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';

  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="calendar"
  data-variant={config.metadata.variant}
  data-size={config.metadata.size}
>
  <slot />
</div>
