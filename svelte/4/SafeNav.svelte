<!--
  SafeNav — Svelte 5 nav component.
  Implements nav contract from safecontracts.
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
  <div data-nav-style={config.metadata.navStyle}>
    <slot />
  </div>
</div>
