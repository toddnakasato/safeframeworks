<!--
  SafeTimeline — Svelte 5 timeline component.
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
  <div data-role="event"><div data-role="marker"><div data-role="dot"></div><div data-role="line"></div></div><div data-role="content"><div data-role="label">Event 1</div><div data-role="date">2026-01-01</div></div></div><div data-role="event"><div data-role="marker"><div data-role="dot"></div></div><div data-role="content"><div data-role="label">Event 2</div><div data-role="date">2026-06-01</div></div></div>
</div>
