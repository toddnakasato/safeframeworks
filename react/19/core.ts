/**
 * Core re-exports from safecontracts.
 * UI components are NOT included — they live in this renderer.
 */
export { createSafeEvent, findHandlers, runHandler, runHandlers, COMPONENT_EVENTS } from "../../../safecontracts/src/contracts";
export type { ConfigBase, ConfigLayout, ConfigState, ConfigApp, ConfigAppRenderer, DataSource, Schema, Field, FieldType, Metadata, Intent, Emphasis, Accent, Surface, Spacing, Radius, Text, SafeEvent, SafeEventOrigin, SafeEventDestination, SafeEventContext, SafeEventStatus, OnSafeEvent, EventHandler, ServerTargetHandler, ClientTargetHandler, HandlerContext, EventPayloadField, RowCell, RowDef, Effect, EffectType } from "../../../safecontracts/src/contracts";
export { createDispatcher } from "../../../safecontracts/src/dispatcher";
export type { Dispatcher, EventFires, EventShape, EventShapeMap } from "../../../safecontracts/src/dispatcher";
export { fmtDate, fmtCurrency, fmtInt, fmtPercent, fmtStr, fmtNumber } from "../../../safecontracts/src/formatter";
export { resolveColors } from "../../../safecontracts/src/palette";
export type { GalleryEntry, ResolverContext } from "../../../safecontracts/src/registry";
export { resolve } from "../../../safecontracts/src/resolver";
