import { useState } from "react";
import type { ConfigBase, OnSafeEvent, SafeEventContext } from "safecontracts";
import { createSafeEvent } from "safecontracts";
import * as Icons from "lucide-react";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeButtonProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
  eventContext?: SafeEventContext;
  renderChild?: (key: string, child: ConfigBase) => React.ReactNode;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function IconGlyph({ name }: { name: string }) {
  const pascal = name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
  const Cmp = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[pascal];
  if (Cmp) return <Cmp size={16} />;
  return <>{name}</>;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

function PaginationGroup({
  config,
  onEvent,
  renderChild,
}: {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
  renderChild?: SafeButtonProps["renderChild"];
}) {
  const { metadata } = config;
  const totalPages = (metadata.totalPages as number) ?? 1;
  const initialPage = (metadata.currentPage as number) ?? 1;
  const showFirstLast = metadata.showFirstLast !== false;
  const variant = (metadata.variant as string) ?? "outline";
  const size = (metadata.size as string) ?? "sm";

  const [page, setPage] = useState(initialPage);

  const go = (p: number) => {
    const clamped = Math.max(1, Math.min(totalPages, p));
    setPage(clamped);
    onEvent?.(
      createSafeEvent("button", "page", { page: clamped, totalPages }),
    );
  };

  return (
    <div
      data-component="button"
      data-group-variant="pagination"
      data-size={size}
    >
      {showFirstLast && (
        <button
          data-role="page-btn"
          data-variant={variant}
          data-disabled={page <= 1 || undefined}
          disabled={page <= 1}
          onClick={() => go(1)}
        >
          «
        </button>
      )}
      <button
        data-role="page-btn"
        data-variant={variant}
        data-disabled={page <= 1 || undefined}
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        ‹
      </button>
      <span data-role="page-indicator">
        {page} / {totalPages}
      </span>
      <button
        data-role="page-btn"
        data-variant={variant}
        data-disabled={page >= totalPages || undefined}
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
      >
        ›
      </button>
      {showFirstLast && (
        <button
          data-role="page-btn"
          data-variant={variant}
          data-disabled={page >= totalPages || undefined}
          disabled={page >= totalPages}
          onClick={() => go(totalPages)}
        >
          »
        </button>
      )}
    </div>
  );
}

function ButtonGroup({
  config,
  onEvent,
  renderChild,
}: {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
  renderChild?: SafeButtonProps["renderChild"];
}) {
  const { metadata, children } = config;
  const groupVariant = (metadata.groupVariant as string) ?? "toolbar";
  const groupDirection = (metadata.groupDirection as string) ?? "horizontal";

  if (groupVariant === "pagination") {
    return (
      <PaginationGroup
        config={config}
        onEvent={onEvent}
        renderChild={renderChild}
      />
    );
  }

  const entries = Object.entries(children ?? {});

  return (
    <div
      data-component="button"
      data-group-variant={groupVariant}
      data-group-direction={groupDirection}
    >
      {entries.map(([key, child]) => {
        if (renderChild) {
          return (
            <div key={key} data-role="group-item">
              {renderChild(key, child)}
            </div>
          );
        }
        return (
          <div key={key} data-role="group-item">
            <SingleButton config={child} onEvent={onEvent} />
          </div>
        );
      })}
    </div>
  );
}

function SingleButton({
  config,
  onEvent,
  eventContext,
}: {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
  eventContext?: SafeEventContext;
}) {
  const { metadata } = config;
  const variant = (metadata.variant as string) ?? "primary";
  const label = metadata.label as string | undefined;
  const icon = metadata.icon as string | undefined;
  const iconPosition = (metadata.iconPosition as string) ?? "left";
  const iconRight = metadata.iconRight as string | undefined;
  const suffix = metadata.suffix as string | undefined;
  const description = metadata.description as string | undefined;
  const iconOnly = !!metadata.iconOnly;
  const disabled = !!metadata.disabled;
  const loading = !!metadata.loading;
  const size = (metadata.size as string) ?? "md";
  const fullWidth = !!metadata.fullWidth;
  const eventName = (metadata.eventName as string) ?? "click";
  const selected = !!metadata.selected;
  const status = metadata.status as string | undefined;

  const handleClick = () => {
    if (disabled || loading) return;
    onEvent?.(
      createSafeEvent("button", eventName, undefined, {
        type: "request",
        category: "system",
        context: eventContext,
      }),
    );
  };

  return (
    <button
      data-component="button"
      data-variant={variant}
      data-size={size}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      data-full-width={fullWidth || undefined}
      data-icon-only={iconOnly || undefined}
      data-selected={selected || undefined}
      data-status={status || undefined}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading && <span data-role="spinner" />}
      {status && (
        <span data-role="status-badge" data-status={status}>
          {status === "completed" ? "✓" : undefined}
        </span>
      )}
      {icon && iconPosition === "left" && !iconOnly && (
        <span data-role="icon"><IconGlyph name={icon} /></span>
      )}
      {iconOnly && icon && <span data-role="icon"><IconGlyph name={icon} /></span>}
      {!iconOnly && label && (
        <span data-role="label">{label}</span>
      )}
      {description && (
        <span data-role="description">{description}</span>
      )}
      {suffix && <span data-role="suffix">{suffix}</span>}
      {icon && iconPosition === "right" && !iconOnly && (
        <span data-role="icon"><IconGlyph name={icon} /></span>
      )}
      {iconRight && <span data-role="icon-right"><IconGlyph name={iconRight} /></span>}
    </button>
  );
}

export function SafeButton({
  config,
  onEvent,
  eventContext,
  renderChild,
}: SafeButtonProps) {
  const hasChildren = config.children && Object.keys(config.children).length > 0;
  const hasGroupVariant = !!config.metadata.groupVariant;

  if (hasChildren || hasGroupVariant) {
    return (
      <ButtonGroup
        config={config}
        onEvent={onEvent}
        renderChild={renderChild}
      />
    );
  }

  return (
    <SingleButton
      config={config}
      onEvent={onEvent}
      eventContext={eventContext}
    />
  );
}
