import { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, Table, File, FileType, FileCode } from 'lucide-react';
import { DocumentPart } from '../types/document';

interface TreeNodeProps {
  part: DocumentPart;
  children?: DocumentPart[];
  allParts: DocumentPart[];
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  header: FileType,
  section: FileText,
  table: Table,
  'text-block': File,
  footer: FileCode,
};

const typeColors: Record<string, string> = {
  header: 'text-blue-600',
  section: 'text-purple-600',
  table: 'text-green-600',
  'text-block': 'text-amber-600',
  footer: 'text-gray-600',
};

export function TreeNode({ part, children, allParts }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = children && children.length > 0;
  const Icon = typeIcons[part.type] || File;
  const color = typeColors[part.type] || 'text-gray-600';

  return (
    <div className="select-none">
      {/* Node Header */}
      <div
        className="flex items-center gap-2 py-1.5 px-2 hover:bg-muted/50 rounded cursor-pointer group"
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {/* Expand/Collapse Icon */}
        <div className="w-4 h-4 flex items-center justify-center shrink-0">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 opacity-60" />
            ) : (
              <ChevronRight className="w-4 h-4 opacity-60" />
            )
          ) : (
            <div className="w-4" />
          )}
        </div>

        {/* Type Icon */}
        <Icon className={`w-4 h-4 shrink-0 ${color}`} />

        {/* Label */}
        <span className="flex-1 truncate text-sm">{part.label}</span>

        {/* Type Badge */}
        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          {part.type}
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="ml-4 border-l border-border/50 pl-2">
          {/* Fields */}
          {part.fields && part.fields.length > 0 && (
            <div className="py-2 space-y-1">
              {part.fields.map((field, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs pl-6">
                  <span className="opacity-50 min-w-[100px] shrink-0">{field.label}:</span>
                  <span className="opacity-70">{field.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Child Nodes */}
          {hasChildren && (
            <div className="space-y-0.5">
              {children.map((child) => {
                const grandChildren = allParts.filter(p => p.parentId === child.id);
                return (
                  <TreeNode
                    key={child.id}
                    part={child}
                    children={grandChildren}
                    allParts={allParts}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
