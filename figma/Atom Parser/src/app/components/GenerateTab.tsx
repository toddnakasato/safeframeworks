import { FileOutput, Info } from 'lucide-react';

export function GenerateTab() {
  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h3>Generate Document</h3>
            <p className="mt-1 opacity-60 text-sm">Recreate documents based on sections and JSON structure</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
          <FileOutput className="w-16 h-16 mb-4" />
          <h3>Generate Feature</h3>
          <p className="mt-2 max-w-md">
            This feature will allow you to generate documents based on the parsed sections and JSON structure
          </p>
          <div className="mt-6 flex items-start gap-3 text-sm bg-muted/50 p-4 rounded-lg max-w-md">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-left opacity-70">
              Coming soon: Template-based document generation using the extracted specification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
