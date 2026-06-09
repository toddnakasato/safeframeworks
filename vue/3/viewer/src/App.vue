<script setup>
import { ref } from 'vue';
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

const layoutConfig = { component: 'layout', metadata: {"variant": "default"} };
const columnsConfig = { component: 'columns', metadata: {"spacing": "normal", "radius": "normal", "surface": "normal"} };
const cardConfig = { component: 'card', metadata: {"variant": "default", "surface": "normal", "spacing": "normal", "radius": "normal", "density": "normal", "title": "Sample Card", "subtitle": "Subtitle"} };
const buttonConfig = { component: 'button', metadata: {"variant": "primary", "size": "md", "disabled": false, "loading": "normal", "fullWidth": "normal", "iconOnly": "normal", "selected": "normal", "status": "normal", "groupVariant": "normal", "groupDirection": "normal", "label": "Click Me"} };
const tableConfig = { component: 'table', metadata: {"variant": "default", "spacing": "normal", "headerStyle": "normal", "rowDivider": "normal", "rowNumbers": "normal", "truncate": "normal", "columnLines": "normal", "headerDivider": "normal", "zebra": "normal", "selectable": "normal"} };
const treeConfig = { component: 'tree', metadata: {"variant": "default", "spacing": "normal"} };
const sheetConfig = { component: 'sheet', metadata: {"variant": "default", "spacing": "normal", "surface": "normal"} };
const chartConfig = { component: 'chart', metadata: {"variant": "default", "chartType": "bar", "title": "Revenue"} };
const heatmapConfig = { component: 'heatmap', metadata: {"variant": "default"} };
const gaugeConfig = { component: 'gauge', metadata: {"variant": "default"} };
const funnelConfig = { component: 'funnel', metadata: {"variant": "default"} };
const sankeyConfig = { component: 'sankey', metadata: {"variant": "default"} };
const treemapConfig = { component: 'treemap', metadata: {"variant": "default"} };
const timelineConfig = { component: 'timeline', metadata: {"variant": "default"} };
const mapConfig = { component: 'map', metadata: {"variant": "default"} };
const calendarConfig = { component: 'calendar', metadata: {"variant": "default", "size": "normal"} };
const toggleConfig = { component: 'toggle', metadata: {"variant": "default", "disabled": false, "labelPosition": "right", "label": "Enable feature", "checked": false} };
const weekConfig = { component: 'week', metadata: {"variant": "default"} };
const chatConfig = { component: 'chat', metadata: {"title": "Chat", "placeholder": "Type a message..."} };
const tabsConfig = { component: 'tabs', metadata: {"variant": "default", "position": "top", "tabs": [{"key": "one", "label": "Tab One"}, {"key": "two", "label": "Tab Two"}]} };
const calloutConfig = { component: 'callout', metadata: {"variant": "info", "position": "top", "message": "This is a callout."} };
const dragdropConfig = { component: 'drag-drop', metadata: {"variant": "default"} };
const gridConfig = { component: 'grid', metadata: {"spacing": "normal", "radius": "normal", "surface": "normal", "collapsible": false} };
const inputConfig = { component: 'input', metadata: {"inputType": "text", "align": "normal", "valign": "normal", "placeholder": "Type here..."} };
const pickerConfig = { component: 'picker', metadata: {"variant": "default"} };
const navConfig = { component: 'nav', metadata: {"navStyle": "classic", "title": "Viewer"} };

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
      <button class="comp-btn" :class="{ active: activeComponent === 'layout' }" @click="selectComponent('layout')">layout</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'columns' }" @click="selectComponent('columns')">columns</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'card' }" @click="selectComponent('card')">card</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'button' }" @click="selectComponent('button')">button</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'table' }" @click="selectComponent('table')">table</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'tree' }" @click="selectComponent('tree')">tree</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'sheet' }" @click="selectComponent('sheet')">sheet</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'chart' }" @click="selectComponent('chart')">chart</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'heatmap' }" @click="selectComponent('heatmap')">heatmap</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'gauge' }" @click="selectComponent('gauge')">gauge</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'funnel' }" @click="selectComponent('funnel')">funnel</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'sankey' }" @click="selectComponent('sankey')">sankey</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'treemap' }" @click="selectComponent('treemap')">treemap</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'timeline' }" @click="selectComponent('timeline')">timeline</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'map' }" @click="selectComponent('map')">map</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'calendar' }" @click="selectComponent('calendar')">calendar</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'toggle' }" @click="selectComponent('toggle')">toggle</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'week' }" @click="selectComponent('week')">week</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'chat' }" @click="selectComponent('chat')">chat</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'tabs' }" @click="selectComponent('tabs')">tabs</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'callout' }" @click="selectComponent('callout')">callout</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'drag-drop' }" @click="selectComponent('drag-drop')">drag-drop</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'grid' }" @click="selectComponent('grid')">grid</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'input' }" @click="selectComponent('input')">input</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'picker' }" @click="selectComponent('picker')">picker</button>
      <button class="comp-btn" :class="{ active: activeComponent === 'nav' }" @click="selectComponent('nav')">nav</button>
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
