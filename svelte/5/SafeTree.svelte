<!--
  SafeTree — Svelte 5 tree component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="tree"
  data-variant={config.metadata.variant}
  data-spacing={config.metadata.spacing}
>
  <div data-role="node" data-depth="0" data-has-children><span data-role="toggle">▶</span><span data-role="label">Root</span></div><div data-role="node" data-depth="1"><span data-role="leaf-spacer"></span><span data-role="label">Child A</span></div><div data-role="node" data-depth="1"><span data-role="leaf-spacer"></span><span data-role="label">Child B</span></div>
</div>
