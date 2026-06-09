<!--
  SafeSheet — Svelte 5 sheet component.
  Outputs data-* attributes for intent. No hardcoded CSS.
-->
<script lang="ts">
  import type { ConfigBase, OnSafeEvent } from 'safecontracts';
  let { config, onEvent }: { config: ConfigBase; onEvent?: OnSafeEvent } = $props();
</script>

<div
  data-component="sheet"
  data-variant={config.metadata.variant}
  data-spacing={config.metadata.spacing}
  data-surface={config.metadata.surface}
>
  <div data-role="formula-bar"><span data-role="cell-ref">A1</span><span data-role="formula-text">=SUM(A1:A3)</span></div><table data-role="grid"><thead><tr><th data-role="corner"></th><th data-role="col-header">A</th><th data-role="col-header">B</th></tr></thead><tbody><tr><td data-role="row-number">1</td><td data-role="cell">10</td><td data-role="cell">20</td></tr><tr><td data-role="row-number">2</td><td data-role="cell">30</td><td data-role="cell">40</td></tr></tbody></table>
</div>
