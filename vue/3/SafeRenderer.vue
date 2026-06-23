<script setup lang="ts">
/**
 * SafeRenderer (vue/3) — thin mount point. Config in, builder out.
 *
 * Rule: only layout and columns have Vue-native handling (need recursive
 * safe-renderer children). Every other component delegates to buildComponent
 * via a mounted DOM element — one builder, one path, no reinvention.
 */
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import type { ConfigBase, OnSafeEvent, RenderPlan } from "safecontracts";
import { buildRenderPlan, stampHandler } from "safecontracts";
import { buildComponent } from "../../utils/render";

const COMPOSITION = new Set(["layout", "columns"]);

const props = defineProps<{ config?: ConfigBase; plan?: RenderPlan; onEvent?: OnSafeEvent }>();

const plan = computed<RenderPlan>(() =>
  props.plan ?? buildRenderPlan(props.config!, COMPOSITION)
);

const stamped = computed<OnSafeEvent | undefined>(() => {
  const handler = plan.value.handler;
  const onEvent = props.onEvent;
  if (!onEvent) return undefined;
  return (event) => onEvent(stampHandler(event, handler));
});

const gridStyle = computed(() => {
  const m = plan.value.config.metadata ?? {};
  const columns = (m.columns as string) ?? "1fr";
  return plan.value.component === "layout"
    ? { display: "grid", gridTemplateColumns: columns, minHeight: "100vh" }
    : { display: "grid", gridTemplateColumns: columns, gap: "var(--sd-space-md)" };
});

// DOM mount for all non-composition components
const domRef = ref<HTMLElement | null>(null);
let mounted: HTMLElement | null = null;

function mountDom() {
  if (!domRef.value) return;
  mounted?.remove();
  mounted = null;
  const p = plan.value;
  if (p.component === "layout" || p.component === "columns") return;
  mounted = buildComponent(p.config, stamped.value) as HTMLElement;
  if (mounted) domRef.value.appendChild(mounted);
}

onMounted(mountDom);
onUnmounted(() => { mounted?.remove(); mounted = null; });
watch(() => [plan.value, stamped.value], mountDom);
</script>

<template>
  <div v-if="plan.kind === 'unknown'" data-component="unknown"
       style="padding: var(--sd-space-md); color: var(--sd-text-dim)">
    Unknown component: {{ plan.component }}
  </div>

  <div v-else-if="plan.component === 'layout' || plan.component === 'columns'"
       :data-component="plan.component" :style="gridStyle">
    <div v-for="c in plan.children" :key="c.key" :data-region="plan.component === 'layout' ? c.key : undefined" :data-child="plan.component === 'columns' ? c.key : undefined">
      <safe-renderer :plan="c.plan" :on-event="onEvent" />
    </div>
  </div>

  <div v-else ref="domRef" />
</template>
