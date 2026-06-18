import { DocumentPart } from '../types/document';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface JSONStructureTabProps {
  parts: DocumentPart[];
}

export function JSONStructureTab({ parts }: JSONStructureTabProps) {
  const [copied, setCopied] = useState(false);

  const jsonStructure = JSON.stringify(parts, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStructure);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-auto relative">
        {parts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <div className="w-16 h-16 mb-4 flex items-center justify-center text-4xl">
              {'{'}
              {'}'}
            </div>
            <h3>No JSON structure yet</h3>
            <p className="mt-2">Load a document to see its JSON representation</p>
          </div>
        ) : (
          <>
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
            <pre className="p-4 text-xs overflow-auto h-full">
              <code className="text-foreground/80">{jsonStructure}</code>
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
