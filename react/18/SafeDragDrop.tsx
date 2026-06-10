import { useState, useCallback, useRef } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeDragDropProps {
  config: ConfigBase;
  data?: Record<string, any>[];
  onEvent?: OnSafeEvent;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

function GenericDragDrop({
  config,
  data,
  onEvent,
}: SafeDragDropProps) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [overZone, setOverZone] = useState<string | null>(null);
  const items = data ?? [];
  const dropLabel = (config.metadata.dropLabel as string) ?? "Drop here";
  const dropDesc = (config.metadata.dropDescription as string) ?? "Drag an item to this zone";

  const handleDragStart = (id: string, item: Record<string, any>) => (e: React.DragEvent) => {
    setDragging(id);
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
    onEvent?.(createSafeEvent("drag-drop", "drag-start", { id, item }));
  };

  const handleDragEnd = () => {
    setDragging(null);
    onEvent?.(createSafeEvent("drag-drop", "drag-end", null));
  };

  const handleDrop = (zone: string) => (e: React.DragEvent) => {
    e.preventDefault();
    setOverZone(null);
    try {
      const item = JSON.parse(e.dataTransfer.getData("application/json"));
      onEvent?.(createSafeEvent("drag-drop", "drop", { zone, item }));
    } catch {}
  };

  const handleDragOver = (zone: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverZone(zone);
  };

  const handleDragLeave = () => setOverZone(null);

  return (
    <div data-component="drag-drop" data-variant="generic">
      <div data-role="drag-source">
        {items.map((item, i) => {
          const id = (item.id as string) ?? String(i);
          return (
            <div
              key={id}
              data-role="drag-item"
              data-dragging={dragging === id || undefined}
              draggable
              onDragStart={handleDragStart(id, item)}
              onDragEnd={handleDragEnd}
            >
              {item.icon && <span data-role="drag-icon">{item.icon as string}</span>}
              {item.type && <span data-role="drag-type">{item.type as string}</span>}
              <span data-role="drag-label">{(item.name as string) ?? (item.label as string) ?? id}</span>
            </div>
          );
        })}
      </div>
      <div data-role="drop-targets">
        <div
          data-role="drop-zone"
          data-over={overZone === "primary" || undefined}
          onDrop={handleDrop("primary")}
          onDragOver={handleDragOver("primary")}
          onDragLeave={handleDragLeave}
        >
          <span data-role="drop-icon">⬇</span>
          <span data-role="drop-label">{dropLabel}</span>
          <span data-role="drop-description">{dropDesc}</span>
        </div>
      </div>
    </div>
  );
}

function FileDragDrop({
  config,
  onEvent,
}: SafeDragDropProps) {
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropLabel = (config.metadata.dropLabel as string) ?? "Drop files here";
  const dropDesc = (config.metadata.dropDescription as string) ?? "or click to browse";
  const accept = (config.metadata.accept as string) ?? "";
  const multiple = config.metadata.multiple !== false;

  const fireFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files).map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      }));
      onEvent?.(createSafeEvent("drag-drop", "file-drop", { files: list }));
    },
    [onEvent],
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setOver(false);
    if (e.dataTransfer.files.length > 0) fireFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setOver(true);
  };

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) fireFiles(e.target.files);
  };

  return (
    <div data-component="drag-drop" data-variant="file">
      <div
        data-role="file-zone"
        data-over={over || undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setOver(false)}
        onClick={handleClick}
      >
        <span data-role="drop-icon">📁</span>
        <span data-role="drop-label">{dropLabel}</span>
        <span data-role="drop-description">{dropDesc}</span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}

function PaletteDragDrop({
  config,
  onEvent,
}: SafeDragDropProps) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [overSection, setOverSection] = useState<string | null>(null);

  const categories = (config.metadata.categories as any[]) ?? [];
  const sections = (config.metadata.sections as any[]) ?? [
    { id: "main", label: "Main" },
  ];

  const handleDragStart = (item: any) => (e: React.DragEvent) => {
    setDragging(item.id);
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
    onEvent?.(createSafeEvent("drag-drop", "drag-start", { item }));
  };

  const handleDragEnd = () => {
    setDragging(null);
    onEvent?.(createSafeEvent("drag-drop", "drag-end", null));
  };

  const handleDrop = (sectionId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    setOverSection(null);
    try {
      const item = JSON.parse(e.dataTransfer.getData("application/json"));
      onEvent?.(createSafeEvent("drag-drop", "drop", { section: sectionId, item }));
    } catch {}
  };

  const handleDragOver = (sectionId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setOverSection(sectionId);
  };

  const handleDragLeave = () => setOverSection(null);

  return (
    <div data-component="drag-drop" data-variant="palette">
      <div data-role="palette-sidebar">
        {categories.map((cat, ci) => (
          <div key={ci} data-role="palette-category">
            <div data-role="palette-category-label">{cat.label}</div>
            <div data-role="palette-items">
              {(cat.items ?? []).map((item: any) => (
                <div
                  key={item.id}
                  data-role="palette-item"
                  data-dragging={dragging === item.id || undefined}
                  draggable
                  onDragStart={handleDragStart(item)}
                  onDragEnd={handleDragEnd}
                >
                  {item.icon && <span data-role="drag-icon">{item.icon}</span>}
                  <span data-role="drag-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div data-role="palette-sections">
        {sections.map((sec: any) => (
          <div
            key={sec.id}
            data-role="palette-section"
            data-over={overSection === sec.id || undefined}
            onDrop={handleDrop(sec.id)}
            onDragOver={handleDragOver(sec.id)}
            onDragLeave={handleDragLeave}
          >
            <span data-role="section-label">{sec.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SafeDragDrop({ config, data, onEvent }: SafeDragDropProps) {
  const variant = (config.metadata.variant as string) ?? "generic";

  if (variant === "file") {
    return <FileDragDrop config={config} onEvent={onEvent} />;
  }

  if (variant === "palette") {
    return <PaletteDragDrop config={config} onEvent={onEvent} />;
  }

  return <GenericDragDrop config={config} data={data} onEvent={onEvent} />;
}
