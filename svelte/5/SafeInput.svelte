<!--
  SafeInput — Svelte 5 input component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="input"
  data-input-type={config.metadata.inputType}
  data-align={config.metadata.align}
  data-valign={config.metadata.valign}
>
  <div data-role="field"><input placeholder={config.metadata.placeholder || "Enter value..."} data-role="field" /></div>
</div>
