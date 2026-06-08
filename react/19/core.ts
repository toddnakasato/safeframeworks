/**
 * Core re-exports from safecomponents.
 * UI components are NOT included — they live in this renderer.
 */
export { createSafeEvent, findHandlers, runHandler, runHandlers } from "../../../safecomponents/src/contracts";
export type { ConfigBase, ConfigLayout, ConfigState, ConfigApp, ConfigAppRenderer, DataSource, Schema, Field, FieldType, Metadata, Intent, Emphasis, Accent, Surface, Spacing, Radius, Text, SafeEvent, SafeEventOrigin, SafeEventDestination, SafeEventContext, SafeEventStatus, OnSafeEvent, EventHandler, ServerTargetHandler, ClientTargetHandler, HandlerContext, EventPayloadField, RowCell, RowDef, Effect, EffectType } from "../../../safecomponents/src/contracts";
export { createDispatcher } from "../../../safecomponents/src/dispatcher";
export type { Dispatcher, EventFires, EventShape, EventShapeMap } from "../../../safecomponents/src/dispatcher";
export { fmtDate, fmtCurrency, fmtInt, fmtPercent, fmtStr, fmtNumber } from "../../../safecomponents/src/formatter";
export { resolveColors } from "../../../safecomponents/src/palette";
