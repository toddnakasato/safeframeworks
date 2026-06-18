import { DocumentPart } from './DocumentViewer';
import { TreeNode } from './TreeNode';
import { FileText, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';

interface PartsPanelProps {
  parts: DocumentPart[];
}

export function PartsPanel({ parts }: PartsPanelProps) {
  const [expandAll, setExpandAll] = useState(true);
  
  // Get root level parts (no parent)
  const rootParts = parts.filter(part => !part.parentId);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2>Deconstructed Parts</h2>
            <p className="mt-1 opacity-60 text-sm">Hierarchical breakdown of document sections</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
              {parts.length} parts
            </span>
            {/* Expand/Collapse All - for future implementation */}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {parts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <FileText className="w-16 h-16 mb-4" />
            <h3>No parts extracted yet</h3>
            <p className="mt-2">Load a document to see its deconstructed parts</p>
          </div>
        ) : (
          <div className="p-2">
            {rootParts.map((part) => {
              const children = parts.filter(p => p.parentId === part.id);
              return (
                <TreeNode
                  key={part.id}
                  part={part}
                  children={children}
                  allParts={parts}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
