<!--
  SafeCallout — Svelte 5 callout component.
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
  <div data-role="message">{config.metadata.message || "Callout"}</div>
</div>
