import { CheckCircle2, Info } from 'lucide-react';

export function VerifyTab() {
  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h3>Verify Sections</h3>
            <p className="mt-1 opacity-60 text-sm">Unit tests to verify each document section</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
          <CheckCircle2 className="w-16 h-16 mb-4" />
          <h3>Verification Suite</h3>
          <p className="mt-2 max-w-md">
            This feature will provide unit tests to validate each section of the parsed document
          </p>
          <div className="mt-6 flex items-start gap-3 text-sm bg-muted/50 p-4 rounded-lg max-w-md">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-left opacity-70">
              Coming soon: Automated validation tests for document sections, field requirements, and data integrity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
