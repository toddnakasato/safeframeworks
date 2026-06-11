/**
 * emit.ts — the single source of event firing for every framework.
 *
 * Every SafeEvent in the system is created here. One typed emitter per
 * component: origin bound once, event names typed to COMPONENT_EVENTS.
 * Imports ONLY safecontracts — no rendering deps, safe for any bundle.
 *
 * Rule (proved by safedesk prove contracts): createSafeEvent is called
 * nowhere outside this file. Builders and framework natives import their
 * emitter from here.
 */
import { createSafeEvent } from "../../safecontracts/src/contracts";
import type { OnSafeEvent, SafeEventData, SafeEventContext } from "../../safecontracts/src/contracts";

type EmitOptions = { context?: SafeEventContext; handler?: string };

function emitter<N extends string>(component: string) {
  return (onEvent: OnSafeEvent | undefined, name: N, data?: SafeEventData | null, options?: EmitOptions): void => {
    onEvent?.(createSafeEvent(component, name, data, options));
  };
}

export type AccordionEvent = "toggle";
export const fireAccordion = emitter<AccordionEvent>("accordion");

export type AlertEvent = "dismiss";
export const fireAlert = emitter<AlertEvent>("alert");

export type BreadcrumbEvent = "navigate";
export const fireBreadcrumb = emitter<BreadcrumbEvent>("breadcrumb");

export type ButtonEvent = "click" | "page";
export const fireButton = emitter<ButtonEvent>("button");

export type CalendarEvent = "navigate" | "select";
export const fireCalendar = emitter<CalendarEvent>("calendar");

export type CardEvent = "click" | "back";
export const fireCard = emitter<CardEvent>("card");

export type CarouselEvent = "slide" | "next" | "prev";
export const fireCarousel = emitter<CarouselEvent>("carousel");

export type ChartEvent = "click" | "hover";
export const fireChart = emitter<ChartEvent>("chart");

export type ChatEvent = "send" | "scroll" | "action";
export const fireChat = emitter<ChatEvent>("chat");

export type DetailEvent = "click" | "back" | "navigate";
export const fireDetail = emitter<DetailEvent>("detail");

export type DragDropEvent = "drag-start" | "drag-end" | "drop" | "file-drop";
export const fireDragDrop = emitter<DragDropEvent>("drag-drop");

export type EmptyStateEvent = "action";
export const fireEmptyState = emitter<EmptyStateEvent>("empty-state");

export type FileUploadEvent = "upload" | "remove";
export const fireFileUpload = emitter<FileUploadEvent>("file-upload");

export type FlowEvent = "node:click" | "link:click";
export const fireFlow = emitter<FlowEvent>("flow");

export type FormEvent = "submit" | "cancel" | "change";
export const fireForm = emitter<FormEvent>("form");

export type FunnelEvent = "select";
export const fireFunnel = emitter<FunnelEvent>("funnel");

export type GaugeEvent = "click";
export const fireGauge = emitter<GaugeEvent>("gauge");

export type HeatmapEvent = "cell:click";
export const fireHeatmap = emitter<HeatmapEvent>("heatmap");

export type HeroEvent = "action";
export const fireHero = emitter<HeroEvent>("hero");

export type HierarchyEvent = "select";
export const fireHierarchy = emitter<HierarchyEvent>("hierarchy");

export type InputEvent = "change" | "editmode" | "canceledit" | "textinput" | "navigate";
export const fireInput = emitter<InputEvent>("input");

export type KanbanEvent = "move" | "select";
export const fireKanban = emitter<KanbanEvent>("kanban");

export type LayoutEvent = "back";
export const fireLayout = emitter<LayoutEvent>("layout");

export type ListEvent = "select" | "toggle" | "expand" | "action" | "page" | "change" | "navigate";
export const fireList = emitter<ListEvent>("list");

export type MapEvent = "select" | "marker:click";
export const fireMap = emitter<MapEvent>("map");

export type MenuEvent = "select";
export const fireMenu = emitter<MenuEvent>("menu");

export type MetricEvent = "click";
export const fireMetric = emitter<MetricEvent>("metric");

export type ModalEvent = "confirm" | "cancel" | "close";
export const fireModal = emitter<ModalEvent>("modal");

export type NavEvent = "navigate";
export const fireNav = emitter<NavEvent>("nav");

export type PickerEvent = "select" | "filter" | "search";
export const firePicker = emitter<PickerEvent>("picker");

export type SceneEvent = "select" | "back" | "filter";
export const fireScene = emitter<SceneEvent>("scene");

export type SheetEvent = "select" | "edit";
export const fireSheet = emitter<SheetEvent>("sheet");

export type SliderEvent = "change";
export const fireSlider = emitter<SliderEvent>("slider");

export type SplitViewEvent = "select" | "back";
export const fireSplitView = emitter<SplitViewEvent>("split-view");

export type StoryFlowEvent = "select-node" | "navigate" | "step:click" | "story:play";
export const fireStoryFlow = emitter<StoryFlowEvent>("story-flow");

export type StoryboardEvent = "select-scene" | "play";
export const fireStoryboard = emitter<StoryboardEvent>("storyboard");

export type TableEvent = "select" | "sort" | "row:click" | "row:select" | "page";
export const fireTable = emitter<TableEvent>("table");

export type TabsEvent = "select";
export const fireTabs = emitter<TabsEvent>("tabs");

export type TileEvent = "click";
export const fireTile = emitter<TileEvent>("tile");

export type TimelineEvent = "select";
export const fireTimeline = emitter<TimelineEvent>("timeline");

export type ToggleEvent = "change" | "expand";
export const fireToggle = emitter<ToggleEvent>("toggle");

export type TreeEvent = "select" | "expand" | "collapse";
export const fireTree = emitter<TreeEvent>("tree");

export type VenueTableEvent = "item-selected";
export const fireVenueTable = emitter<VenueTableEvent>("venue-table");

export type WeekEvent = "navigate" | "select";
export const fireWeek = emitter<WeekEvent>("week");
