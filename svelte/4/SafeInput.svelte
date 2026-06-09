<!--
  SafeInput — Svelte 4 input component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  export let config: ConfigBase;
  export let onEvent: OnSafeEvent | undefined = undefined;
</script>

<div
  data-component="input"
  data-input-type={config.metadata.inputType}
  data-align={config.metadata.align}
  data-valign={config.metadata.valign}
>
  <div data-role="field"><input placeholder={config.metadata.placeholder || "Enter value..."} data-role="field" /></div>
</div>
