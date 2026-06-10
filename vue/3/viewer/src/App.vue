<script setup>
import { ref } from 'vue';
import { SAMPLES } from '../../../../samples';
import SafeLayout from '../../SafeLayout.vue';
import SafeColumns from '../../SafeColumns.vue';
import SafeCard from '../../SafeCard.vue';
import SafeButton from '../../SafeButton.vue';
import SafeTable from '../../SafeTable.vue';
import SafeTree from '../../SafeTree.vue';
import SafeSheet from '../../SafeSheet.vue';
import SafeChart from '../../SafeChart.vue';
import SafeHeatmap from '../../SafeHeatmap.vue';
import SafeGauge from '../../SafeGauge.vue';
import SafeFunnel from '../../SafeFunnel.vue';
import SafeFlow from '../../SafeFlow.vue';
import SafeHierarchy from '../../SafeHierarchy.vue';
import SafeTimeline from '../../SafeTimeline.vue';
import SafeMap from '../../SafeMap.vue';
import SafeCalendar from '../../SafeCalendar.vue';
import SafeToggle from '../../SafeToggle.vue';
import SafeWeek from '../../SafeWeek.vue';
import SafeChat from '../../SafeChat.vue';
import SafeTabs from '../../SafeTabs.vue';
import SafeCallout from '../../SafeCallout.vue';
import SafeDragDrop from '../../SafeDragDrop.vue';
import SafeGrid from '../../SafeGrid.vue';
import SafeInput from '../../SafeInput.vue';
import SafeList from '../../SafeList.vue';
import SafePicker from '../../SafePicker.vue';
import SafeNav from '../../SafeNav.vue';

const comps = { layout: SafeLayout, columns: SafeColumns, card: SafeCard, button: SafeButton, table: SafeTable, tree: SafeTree, sheet: SafeSheet, chart: SafeChart, heatmap: SafeHeatmap, gauge: SafeGauge, funnel: SafeFunnel, flow: SafeFlow, hierarchy: SafeHierarchy, timeline: SafeTimeline, map: SafeMap, calendar: SafeCalendar, toggle: SafeToggle, week: SafeWeek, chat: SafeChat, tabs: SafeTabs, callout: SafeCallout, 'drag-drop': SafeDragDrop, grid: SafeGrid, input: SafeInput, list: SafeList, picker: SafePicker, nav: SafeNav };
const STYLES = ['vanilla', 'tailwind', 'tailwind-daisy', 'material'];
const componentNames = Object.keys(SAMPLES).sort();
const activeStyle = ref('vanilla');
const activeComponent = ref(null);
const activeVariation = ref(null);

function switchStyle(s) {
  activeStyle.value = s;
  const link = document.getElementById('safestyle-link');
  if (link) link.setAttribute('href', '/styles/' + s + '/components.css');
}

function selectComponent(name) {
  activeComponent.value = name;
  activeVariation.value = null;
}

function selectVariation(comp, v) {
  activeComponent.value = comp;
  activeVariation.value = v;
}

function componentsToShow() {
  return activeComponent.value ? [activeComponent.value] : componentNames;
}

function variationsToShow(comp) {
  const vs = Object.keys(SAMPLES[comp] ?? {}).sort();
  return activeVariation.value ? vs.filter(v => v === activeVariation.value) : vs;
}
</script>

<template>
  <div class="viewer">
    <div class="sidebar">
      <div class="brand"><img src="/shield.png" alt="SafeDesk" /><span>vue/3</span></div>
      <div class="section-label">STYLE</div>
      <button v-for="s in STYLES" :key="s" class="style-btn" :class="{ active: s === activeStyle }" @click="switchStyle(s)">{{ s }}</button>

      <div class="section-label" style="margin-top:16px">COMPONENTS</div>
      <button class="comp-btn" :class="{ active: activeComponent === null }" @click="selectComponent(null)">All</button>
      <template v-for="name in componentNames" :key="name">
        <button class="comp-btn" :class="{ active: activeComponent === name && !activeVariation }" @click="selectComponent(name)">{{ name }}</button>
        <template v-if="activeComponent === name">
          <button v-for="v in Object.keys(SAMPLES[name]).sort()" :key="v" class="var-btn" :class="{ active: activeVariation === v }" @click="selectVariation(name, v)">{{ v }}</button>
        </template>
      </template>
    </div>
    <div class="main">
      <h3>vue/3 — {{ activeStyle }}<span v-if="activeComponent" class="active-comp"> — {{ activeVariation ?? activeComponent }}</span></h3>
      <template v-for="comp in componentsToShow()" :key="comp">
        <div v-for="v in variationsToShow(comp)" :key="v" class="component-card">
          <div class="component-label">{{ v }}</div>
          <div class="component-body">
            <component :is="comps[comp]" :config="SAMPLES[comp][v]" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
  .viewer { display: flex; height: 100vh; font-family: system-ui, sans-serif; }
  .sidebar { width: 220px; border-right: 1px solid #e5e7eb; padding: 12px; overflow-y: auto; flex-shrink: 0; }
  .brand { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; font-size: 13px; font-weight: 600; }
  .brand img { width: 18px; height: 21px; }
  .section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 8px; }
  .style-btn, .comp-btn, .var-btn { display: block; width: 100%; text-align: left; padding: 4px 8px; font-size: 13px; border: none; border-radius: 4px; cursor: pointer; background: transparent; color: #1a1a1a; margin-bottom: 2px; }
  .var-btn { padding-left: 22px; }
  .style-btn.active, .comp-btn.active, .var-btn.active { background: #3b82f6; color: white; }
  .style-btn:hover, .comp-btn:hover, .var-btn:hover { background: #f3f4f6; }
  .style-btn.active:hover, .comp-btn.active:hover, .var-btn.active:hover { background: #3b82f6; }
  .main { flex: 1; overflow-y: auto; padding: 24px; }
  h3 { font-size: 14px; font-weight: 600; margin-bottom: 16px; }
  .active-comp { font-weight: 400; color: #6b7280; }
  .component-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
  .component-label { padding: 8px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; background: #fafafa; }
  .component-body { padding: 16px; }
</style>
