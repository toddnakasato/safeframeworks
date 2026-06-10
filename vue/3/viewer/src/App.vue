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
import SafeSankey from '../../SafeSankey.vue';
import SafeTreemap from '../../SafeTreemap.vue';
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
import SafePicker from '../../SafePicker.vue';
import SafeNav from '../../SafeNav.vue';

const STYLES = ['vanilla', 'tailwind', 'tailwind-daisy', 'material'];
const activeStyle = ref('vanilla');
const activeComponent = ref(null);
const componentNames = Object.keys(SAMPLES).sort();

const layoutConfig = SAMPLES['layout'];
const columnsConfig = SAMPLES['columns'];
const cardConfig = SAMPLES['card'];
const buttonConfig = SAMPLES['button'];
const tableConfig = SAMPLES['table'];
const treeConfig = SAMPLES['tree'];
const sheetConfig = SAMPLES['sheet'];
const chartConfig = SAMPLES['chart'];
const heatmapConfig = SAMPLES['heatmap'];
const gaugeConfig = SAMPLES['gauge'];
const funnelConfig = SAMPLES['funnel'];
const sankeyConfig = SAMPLES['sankey'];
const treemapConfig = SAMPLES['treemap'];
const timelineConfig = SAMPLES['timeline'];
const mapConfig = SAMPLES['map'];
const calendarConfig = SAMPLES['calendar'];
const toggleConfig = SAMPLES['toggle'];
const weekConfig = SAMPLES['week'];
const chatConfig = SAMPLES['chat'];
const tabsConfig = SAMPLES['tabs'];
const calloutConfig = SAMPLES['callout'];
const dragdropConfig = SAMPLES['drag-drop'];
const gridConfig = SAMPLES['grid'];
const inputConfig = SAMPLES['input'];
const pickerConfig = SAMPLES['picker'];
const navConfig = SAMPLES['nav'];

function switchStyle(s) {
  activeStyle.value = s;
  const link = document.getElementById('safestyle-link');
  if (link) link.setAttribute('href', '/styles/' + s + '/components.css');
}

function selectComponent(name) {
  activeComponent.value = name;
}
</script>

<template>
  <div class="viewer">
    <div class="sidebar">
      <div class="section-label">STYLE</div>
      <button v-for="s in STYLES" :key="s" class="style-btn" :class="{ active: s === activeStyle }" @click="switchStyle(s)">{{ s }}</button>

      <div class="section-label" style="margin-top:16px">COMPONENTS</div>
      <button class="comp-btn" :class="{ active: activeComponent === null }" @click="selectComponent(null)">All</button>
      <button v-for="name in componentNames" :key="name" class="comp-btn" :class="{ active: activeComponent === name }" @click="selectComponent(name)">{{ name }}</button>
    </div>
    <div class="main">
      <h3>vue/3 — {{ activeStyle }}<span v-if="activeComponent" class="active-comp"> — {{ activeComponent }}</span></h3>
      <div v-if="activeComponent === null || activeComponent === 'layout'" class="component-card">
        <div class="component-label">layout</div>
        <div class="component-body">
          <SafeLayout :config="layoutConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'columns'" class="component-card">
        <div class="component-label">columns</div>
        <div class="component-body">
          <SafeColumns :config="columnsConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'card'" class="component-card">
        <div class="component-label">card</div>
        <div class="component-body">
          <SafeCard :config="cardConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'button'" class="component-card">
        <div class="component-label">button</div>
        <div class="component-body">
          <SafeButton :config="buttonConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'table'" class="component-card">
        <div class="component-label">table</div>
        <div class="component-body">
          <SafeTable :config="tableConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'tree'" class="component-card">
        <div class="component-label">tree</div>
        <div class="component-body">
          <SafeTree :config="treeConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'sheet'" class="component-card">
        <div class="component-label">sheet</div>
        <div class="component-body">
          <SafeSheet :config="sheetConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'chart'" class="component-card">
        <div class="component-label">chart</div>
        <div class="component-body">
          <SafeChart :config="chartConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'heatmap'" class="component-card">
        <div class="component-label">heatmap</div>
        <div class="component-body">
          <SafeHeatmap :config="heatmapConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'gauge'" class="component-card">
        <div class="component-label">gauge</div>
        <div class="component-body">
          <SafeGauge :config="gaugeConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'funnel'" class="component-card">
        <div class="component-label">funnel</div>
        <div class="component-body">
          <SafeFunnel :config="funnelConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'sankey'" class="component-card">
        <div class="component-label">sankey</div>
        <div class="component-body">
          <SafeSankey :config="sankeyConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'treemap'" class="component-card">
        <div class="component-label">treemap</div>
        <div class="component-body">
          <SafeTreemap :config="treemapConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'timeline'" class="component-card">
        <div class="component-label">timeline</div>
        <div class="component-body">
          <SafeTimeline :config="timelineConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'map'" class="component-card">
        <div class="component-label">map</div>
        <div class="component-body">
          <SafeMap :config="mapConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'calendar'" class="component-card">
        <div class="component-label">calendar</div>
        <div class="component-body">
          <SafeCalendar :config="calendarConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'toggle'" class="component-card">
        <div class="component-label">toggle</div>
        <div class="component-body">
          <SafeToggle :config="toggleConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'week'" class="component-card">
        <div class="component-label">week</div>
        <div class="component-body">
          <SafeWeek :config="weekConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'chat'" class="component-card">
        <div class="component-label">chat</div>
        <div class="component-body">
          <SafeChat :config="chatConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'tabs'" class="component-card">
        <div class="component-label">tabs</div>
        <div class="component-body">
          <SafeTabs :config="tabsConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'callout'" class="component-card">
        <div class="component-label">callout</div>
        <div class="component-body">
          <SafeCallout :config="calloutConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'drag-drop'" class="component-card">
        <div class="component-label">drag-drop</div>
        <div class="component-body">
          <SafeDragDrop :config="dragdropConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'grid'" class="component-card">
        <div class="component-label">grid</div>
        <div class="component-body">
          <SafeGrid :config="gridConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'input'" class="component-card">
        <div class="component-label">input</div>
        <div class="component-body">
          <SafeInput :config="inputConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'picker'" class="component-card">
        <div class="component-label">picker</div>
        <div class="component-body">
          <SafePicker :config="pickerConfig" />
        </div>
      </div>
      <div v-if="activeComponent === null || activeComponent === 'nav'" class="component-card">
        <div class="component-label">nav</div>
        <div class="component-body">
          <SafeNav :config="navConfig" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.viewer { display: flex; height: 100vh; font-family: system-ui, sans-serif; }
.sidebar { width: 220px; border-right: 1px solid #e5e7eb; padding: 12px; overflow-y: auto; flex-shrink: 0; }
.section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 8px; }
.style-btn, .comp-btn { display: block; width: 100%; text-align: left; padding: 4px 8px; font-size: 13px; border: none; border-radius: 4px; cursor: pointer; background: transparent; color: #1a1a1a; margin-bottom: 2px; }
.style-btn.active, .comp-btn.active { background: #3b82f6; color: white; }
.style-btn:hover, .comp-btn:hover { background: #f3f4f6; }
.style-btn.active:hover, .comp-btn.active:hover { background: #3b82f6; }
.main { flex: 1; overflow-y: auto; padding: 24px; }
h3 { font-size: 14px; font-weight: 600; margin-bottom: 16px; }
.active-comp { font-weight: 400; color: #6b7280; }
.component-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
.component-label { padding: 8px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; background: #fafafa; }
.component-body { padding: 16px; }
</style>
