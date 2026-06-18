import { DocumentPart } from '../types/document';
import { TreeNode } from './TreeNode';
import { FileText } from 'lucide-react';

interface DocumentSectionsTabProps {
  parts: DocumentPart[];
}

export function DocumentSectionsTab({ parts }: DocumentSectionsTabProps) {
  // Get root level parts (no parent)
  const rootParts = parts.filter(part => !part.parentId);

  return (
    <div className="h-full flex flex-col bg-background">
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
