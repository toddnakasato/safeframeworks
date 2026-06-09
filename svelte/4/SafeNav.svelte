<!--
  SafeNav — Svelte 4 nav component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="nav"
  data-nav-style={config.metadata.navStyle}
>
  {#if config.metadata.title}<div data-nav-header><div data-nav-logo>{config.metadata.title?.charAt(0)}</div><div data-nav-title>{config.metadata.title}</div></div>{/if}
    <nav data-nav-main><slot /></nav>
</div>
