import { useState, useMemo, useCallback } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeTreeProps {
  config: ConfigBase;
  data: Record<string, any>[];
  onEvent?: OnSafeEvent;
}

interface TreeNode {
  record: Record<string, any>;
  id: string;
  children: TreeNode[];
  depth: number;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function buildTree(
  data: Record<string, any>[],
  idField: string,
  parentField: string,
): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const record of data) {
    const id = String(record[idField] ?? "");
    map.set(id, { record, id, children: [], depth: 0 });
  }

  for (const record of data) {
    const id = String(record[idField] ?? "");
    const parentId = record[parentField];
    const node = map.get(id)!;

    if (parentId == null || parentId === "" || parentId === id) {
      roots.push(node);
    } else {
      const parent = map.get(String(parentId));
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
  }

  function setDepth(nodes: TreeNode[], depth: number) {
    for (const n of nodes) {
      n.depth = depth;
      setDepth(n.children, depth + 1);
    }
  }
  setDepth(roots, 0);

  return roots;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

function TreeNodeRow({
  node,
  config,
  expanded,
  onToggle,
  onSelect,
  selected,
}: {
  node: TreeNode;
  config: ConfigBase;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (node: TreeNode) => void;
  selected: string | null;
}) {
  const { metadata } = config;
  const labelField = (metadata.labelField as string) ?? "Name";
  const iconField = metadata.iconField as string | undefined;
  const badgeField = metadata.badgeField as string | undefined;
  const subtitleField = metadata.subtitleField as string | undefined;
  const indent = (metadata.indent as number) ?? 20;
  const connectors = !!metadata.connectors;
  const isExpanded = expanded.has(node.id);
  const hasChildren = node.children.length > 0;
  const isSelected = selected === node.id;

  return (
    <>
      <div
        data-role="node"
        data-depth={node.depth}
        data-selected={isSelected || undefined}
        data-has-children={hasChildren || undefined}
        data-expanded={isExpanded || undefined}
        style={{ paddingLeft: node.depth * indent }}
        onClick={() => onSelect(node)}
      >
        {hasChildren ? (
          <span
            data-role="toggle"
            onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
          >
            {isExpanded ? "▼" : "▶"}
          </span>
        ) : (
          <span data-role="leaf-spacer" />
        )}
        {connectors && node.depth > 0 && <span data-role="connector" />}
        {iconField && node.record[iconField] && (
          <span data-role="icon">{String(node.record[iconField])}</span>
        )}
        <span data-role="label">{String(node.record[labelField] ?? "")}</span>
        {subtitleField && node.record[subtitleField] && (
          <span data-role="subtitle">{String(node.record[subtitleField])}</span>
        )}
        {badgeField && node.record[badgeField] && (
          <span data-role="badge">{String(node.record[badgeField])}</span>
        )}
      </div>
      {isExpanded && node.children.map((child) => (
        <TreeNodeRow
          key={child.id}
          node={child}
          config={config}
          expanded={expanded}
          onToggle={onToggle}
          onSelect={onSelect}
          selected={selected}
        />
      ))}
    </>
  );
}

export function SafeTree({ config, data, onEvent }: SafeTreeProps) {
  const { metadata } = config;
  const variant = (metadata.variant as string) ?? "default";
  const spacing = (metadata.spacing as string) ?? "normal";
  const surface = (metadata.surface as string) ?? "base";
  const idField = (metadata.idField as string) ?? "Id";
  const parentField = (metadata.parentField as string) ?? "ParentId";
  const expandAll = !!metadata.expandAll;
  const expandDepth = (metadata.expandDepth as number) ?? (expandAll ? 99 : 1);

  const tree = useMemo(() => buildTree(data, idField, parentField), [data, idField, parentField]);

  const initialExpanded = useMemo(() => {
    const set = new Set<string>();
    function walk(nodes: TreeNode[], depth: number) {
      for (const n of nodes) {
        if (depth < expandDepth) {
          set.add(n.id);
          walk(n.children, depth + 1);
        }
      }
    }
    walk(tree, 0);
    return set;
  }, [tree, expandDepth]);

  const [expanded, setExpanded] = useState(initialExpanded);
  const [selected, setSelected] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    onEvent?.(createSafeEvent("tree", "expand", { id }));
  }, [onEvent]);

  const handleSelect = useCallback((node: TreeNode) => {
    setSelected(node.id);
    onEvent?.(createSafeEvent("tree", "select", { id: node.id, record: node.record }));
  }, [onEvent]);

  if (data.length === 0) {
    return (
      <div data-component="tree" data-role="empty">No items</div>
    );
  }

  return (
    <div
      data-component="tree"
      data-variant={variant}
      data-spacing={spacing}
      data-surface={surface}
    >
      {tree.map((node) => (
        <TreeNodeRow
          key={node.id}
          node={node}
          config={config}
          expanded={expanded}
          onToggle={handleToggle}
          onSelect={handleSelect}
          selected={selected}
        />
      ))}
    </div>
  );
}