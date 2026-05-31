/**
 * SafeFloorplan — 2D venue floor plan with rooms, walls, and draggable items.
 * react-konva canvas. FULLY CONFIG-DRIVEN.
 * Visual tokens come from style (merged into metadata by resolver).
 * Item properties come from gallery JSON via children refs.
 * Zero hardcoded colors or sizes.
 */
import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Stage, Layer, Line, Rect, Circle, Text, Group } from "react-konva";
import type { ConfigBase, OnSafeEvent } from "safecomponents";
import { createSafeEvent } from "safecomponents";
import type { FloorplanItem, FloorplanStructure, Room, Wall } from "safecomponents/src/components/floorplan";

export interface SafeFloorplanProps {
  config: ConfigBase;
  data?: any;
  onEvent?: OnSafeEvent;
}

/** Style tokens read from metadata (merged from gallery/styles/*.json) */
interface FloorplanStyle {
  background: string;
  gridColor: string;
  wallStroke: string;
  roomFill: string;
  roomStroke: string;
  roomLabel: string;
  selectionStroke: string;
  chairFill: string;
  chairBackrestFill: string;
  chairStroke: string;
  itemStroke: string;
  itemLabelColor: string;
  tableStroke: string;
}

function readStyle(m: Record<string, any>): FloorplanStyle {
  return {
    background: m.background as string,
    gridColor: m.gridColor as string,
    wallStroke: m.wallStroke as string,
    roomFill: m.roomFill as string,
    roomStroke: m.roomStroke as string,
    roomLabel: m.roomLabel as string,
    selectionStroke: m.selectionStroke as string,
    chairFill: m.chairFill as string,
    chairBackrestFill: m.chairBackrestFill as string,
    chairStroke: m.chairStroke as string,
    itemStroke: m.itemStroke as string,
    itemLabelColor: m.itemLabelColor as string,
    tableStroke: m.tableStroke as string,
  };
}

function snap(val: number, grid: number): number {
  return Math.round(val / grid) * grid;
}

function RoomShape({ room, style }: { room: Room; style: FloorplanStyle }) {
  return (
    <Line
      points={room.points}
      closed
      fill={room.fill ?? style.roomFill}
      stroke={style.roomStroke}
      strokeWidth={1}
    />
  );
}

function RoomLabel({ room, style }: { room: Room; style: FloorplanStyle }) {
  if (!room.name) return null;
  const cx = room.points.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0) / (room.points.length / 2);
  const cy = room.points.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0) / (room.points.length / 2);
  return (
    <Text x={cx - 30} y={cy - 8} text={room.name} fontSize={13} fill={style.roomLabel} width={60} align="center" />
  );
}

function WallLine({ wall, style }: { wall: Wall; style: FloorplanStyle }) {
  return (
    <Line
      points={wall.points}
      stroke={wall.stroke ?? style.wallStroke}
      strokeWidth={wall.thickness ?? 4}
      lineCap="round"
    />
  );
}

function FloorplanItemShape({
  item, editable, gridSize, snapEnabled, style, onMoved, onSelected,
}: {
  item: FloorplanItem; editable: boolean; gridSize: number; snapEnabled: boolean;
  style: FloorplanStyle;
  onMoved: (id: string, x: number, y: number) => void;
  onSelected: (id: string) => void;
}) {
  const handleDragEnd = useCallback((e: any) => {
    const node = e.target;
    const x = snapEnabled ? snap(node.x(), gridSize) : node.x();
    const y = snapEnabled ? snap(node.y(), gridSize) : node.y();
    node.x(x);
    node.y(y);
    onMoved(item.id, x, y);
  }, [item.id, gridSize, snapEnabled, onMoved]);

  const handleClick = useCallback(() => {
    onSelected(item.id);
  }, [item.id, onSelected]);

  // Chair — seat + backrest
  if (item.type === "chair") {
    const w = item.width ?? 12;
    const h = item.height ?? 12;
    const brH = item.backrestHeight ?? 4;
    return (
      <Group
        x={item.x} y={item.y}
        draggable={editable}
        rotation={item.rotation ?? 0}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onTap={handleClick}
      >
        <Rect x={-w/2} y={-h/2} width={w} height={h}
          fill={item.fill ?? style.chairFill} cornerRadius={item.cornerRadius ?? 2}
          stroke={item.stroke ?? style.chairStroke} strokeWidth={item.strokeWidth ?? 0.8} />
        <Rect x={-w/2 - 1} y={h/2} width={w + 2} height={brH}
          fill={item.backrestFill ?? style.chairBackrestFill} cornerRadius={[0,0,3,3]}
          stroke={item.stroke ?? style.chairStroke} strokeWidth={item.strokeWidth ?? 0.8} />
      </Group>
    );
  }

  // Venue-table — round table with chairs from children
  if (item.type === "venue-table") {
    const tableRadius = item.radius ?? 26;
    const seats = item.children?.length ?? 0;
    const gap = item.chairGap ?? 2;
    const chairs: React.ReactNode[] = [];
    for (let i = 0; i < seats; i++) {
      const child = item.children![i];
      const cw = child.width!;
      const ch = child.height!;
      const brH = child.backrestHeight!;
      const cFill = child.fill ?? style.chairFill;
      const cBackFill = child.backrestFill ?? style.chairBackrestFill;
      const cStroke = child.stroke ?? style.chairStroke;
      const cStrokeW = child.strokeWidth ?? 0.8;
      const cRadius = child.cornerRadius!;
      const orbitRadius = tableRadius + ch / 2 + gap;
      const angle = (2 * Math.PI * i) / seats - Math.PI / 2;
      const cx = Math.cos(angle) * orbitRadius;
      const cy = Math.sin(angle) * orbitRadius;
      const deg = (angle * 180) / Math.PI - 90;
      chairs.push(
        <Group key={child?.id ?? `chair-${i}`} x={cx} y={cy} rotation={deg}>
          <Rect x={-cw/2} y={-ch/2} width={cw} height={ch}
            fill={cFill} cornerRadius={cRadius}
            stroke={cStroke} strokeWidth={cStrokeW} />
          <Rect x={-cw/2 - 1} y={ch/2} width={cw + 2} height={brH}
            fill={cBackFill} cornerRadius={[0,0,3,3]}
            stroke={cStroke} strokeWidth={cStrokeW} />
        </Group>
      );
    }
    return (
      <Group
        x={item.x} y={item.y}
        draggable={editable}
        rotation={item.rotation ?? 0}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onTap={handleClick}
      >
        <Circle radius={tableRadius} fill={item.fill ?? style.tableStroke}
          stroke={item.stroke ?? style.tableStroke} strokeWidth={item.strokeWidth ?? 1.5} />
        {chairs}
        {item.label && (
          <Text text={item.label} fontSize={item.labelSize ?? 12}
            fill={item.labelColor ?? style.itemLabelColor} fontStyle="bold"
            width={tableRadius * 2} align="center"
            offsetX={tableRadius} offsetY={7} />
        )}
      </Group>
    );
  }

  // Stanchion
  if (item.type === "stanchion") {
    return (
      <Circle x={item.x} y={item.y} radius={item.radius ?? 4}
        fill={item.fill ?? style.itemStroke}
        stroke={item.stroke ?? style.itemStroke} strokeWidth={item.strokeWidth ?? 1}
        listening={false} />
    );
  }

  // Label
  if (item.type === "label") {
    return (
      <Text x={item.x} y={item.y} text={item.label ?? ""}
        fontSize={item.labelSize ?? 11} fill={item.labelColor ?? style.roomLabel}
        width={item.width} rotation={item.rotation ?? 0} />
    );
  }

  // Default rect items (table, bar, stage, booth, door, podium)
  const w = item.width ?? 60;
  const h = item.height ?? 40;
  return (
    <Group
      x={item.x} y={item.y}
      draggable={editable}
      rotation={item.rotation ?? 0}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onTap={handleClick}
    >
      <Rect
        width={w} height={h}
        fill={item.fill ?? style.itemStroke} cornerRadius={item.cornerRadius ?? 4}
        stroke={item.stroke ?? style.itemStroke} strokeWidth={item.strokeWidth ?? 1}
        offsetX={w / 2} offsetY={h / 2}
      />
      {item.label && (
        <Text
          text={item.label} fontSize={item.labelSize ?? 11}
          fill={item.labelColor ?? style.itemLabelColor}
          width={w} align="center"
          offsetX={w / 2} offsetY={6}
        />
      )}
    </Group>
  );
}

function GridLines({ width, height, gridSize, color }: { width: number; height: number; gridSize: number; color: string }) {
  const lines: React.ReactNode[] = [];
  for (let x = 0; x <= width; x += gridSize) {
    lines.push(<Line key={`v${x}`} points={[x, 0, x, height]} stroke={color} strokeWidth={1} />);
  }
  for (let y = 0; y <= height; y += gridSize) {
    lines.push(<Line key={`h${y}`} points={[0, y, width, y]} stroke={color} strokeWidth={1} />);
  }
  return <>{lines}</>;
}

export function SafeFloorplan({ config, data, onEvent }: SafeFloorplanProps) {
  const { metadata } = config;
  const s = readStyle(metadata);
  const gridSize = (metadata.gridSize as number) ?? 20;
  const configWidth = metadata.width as number | undefined;
  const configHeight = metadata.height as number | undefined;
  const editable = metadata.editable !== false;
  const showGrid = metadata.showGrid !== false;
  const showLabels = metadata.showLabels !== false;
  const snapEnabled = metadata.snapToGrid !== false;

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: configWidth ?? 800, h: configHeight ?? 600 });

  useEffect(() => {
    if (configWidth && configHeight) return;
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth || 800;
      const h = el.clientHeight || 600;
      setSize({ w, h });
    };
    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    return () => obs.disconnect();
  }, [configWidth, configHeight]);

  const width = configWidth ?? size.w;
  const height = configHeight ?? size.h;

  const inline = config.data?.[0]?.inline;
  const raw = data ?? (Array.isArray(inline) ? inline[0] : inline) ?? {};
  const structure: FloorplanStructure = useMemo(() => raw.structure ?? { rooms: [], walls: [] }, [raw]);

  const buildItems = useCallback((): FloorplanItem[] => {
    if (config.children && Object.keys(config.children).length > 0) {
      return Object.entries(config.children).map(([key, child]) => {
        const m = child.metadata ?? {};
        // Extract nested children (e.g. chair refs on a venue-table)
        let nested: FloorplanItem[] | undefined;
        if (child.children && Object.keys(child.children).length > 0) {
          nested = Object.entries(child.children).map(([ck, cc]) => {
            const cm = cc.metadata ?? {};
            return {
              id: ck,
              type: (cm.component as FloorplanItem["type"]) ?? "chair",
              x: 0, y: 0,
              width: cm.width as number | undefined,
              height: cm.height as number | undefined,
              cornerRadius: cm.cornerRadius as number | undefined,
              backrestHeight: cm.backrestHeight as number | undefined,
              backrestFill: cm.backrestFill as string | undefined,
              fill: cm.fill as string | undefined,
              stroke: cm.stroke as string | undefined,
              strokeWidth: cm.strokeWidth as number | undefined,
            };
          });
        }
        return {
          id: key,
          type: (m.component as FloorplanItem["type"]) ?? "label",
          x: (m.x as number) ?? 0,
          y: (m.y as number) ?? 0,
          width: m.width as number | undefined,
          height: m.height as number | undefined,
          radius: m.radius as number | undefined,
          rotation: m.rotation as number | undefined,
          label: m.label as string | undefined,
          labelColor: m.labelColor as string | undefined,
          labelSize: m.labelSize as number | undefined,
          fill: m.fill as string | undefined,
          stroke: m.stroke as string | undefined,
          strokeWidth: m.strokeWidth as number | undefined,
          cornerRadius: m.cornerRadius as number | undefined,
          chairGap: m.chairGap as number | undefined,
          backrestHeight: m.backrestHeight as number | undefined,
          backrestFill: m.backrestFill as string | undefined,
          children: nested,
        };
      });
    }
    return raw.items ?? [];
  }, [config.children, raw]);

  const [items, setItems] = useState<FloorplanItem[]>(buildItems);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setItems(buildItems());
    setSelectedId(null);
  }, [buildItems]);

  const handleMoved = useCallback((id: string, x: number, y: number) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, x, y } : it));
    onEvent?.(createSafeEvent("floorplan", "item-moved", { id, x, y }));
  }, [onEvent]);

  const handleSelected = useCallback((id: string) => {
    setSelectedId(id);
    const item = items.find(it => it.id === id);
    onEvent?.(createSafeEvent("floorplan", "item-selected", { id, item }));
  }, [onEvent, items]);

  const handleDeselect = useCallback(() => {
    if (selectedId) {
      setSelectedId(null);
      onEvent?.(createSafeEvent("floorplan", "item-deselected", {}));
    }
  }, [onEvent, selectedId]);

  return (
    <div ref={containerRef} data-component="floorplan" data-editable={editable || undefined} style={{ width: "100%", height: "100%", position: "relative" }}>
      <Stage width={width} height={height} onClick={handleDeselect} onTap={handleDeselect}>
        {showGrid && (
          <Layer>
            <Rect width={width} height={height} fill={s.background} />
            <GridLines width={width} height={height} gridSize={gridSize} color={s.gridColor} />
          </Layer>
        )}
        <Layer>
          {structure.rooms.map(room => <RoomShape key={room.id} room={room} style={s} />)}
          {structure.walls.map(wall => <WallLine key={wall.id} wall={wall} style={s} />)}
          {showLabels && structure.rooms.map(room => <RoomLabel key={`lbl-${room.id}`} room={room} style={s} />)}
        </Layer>
        <Layer>
          {items.map(item => (
            <FloorplanItemShape
              key={item.id} item={item}
              editable={editable} gridSize={gridSize} snapEnabled={snapEnabled}
              style={s}
              onMoved={handleMoved} onSelected={handleSelected}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
