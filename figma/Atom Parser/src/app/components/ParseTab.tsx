import { Upload } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import exampleImage from 'figma:asset/79aecb13c92f41c83a7b5835289841efd8faa632.png';
import { DocumentPart } from '../types/document';

interface ParseTabProps {
  onDocumentLoad?: (parts: DocumentPart[]) => void;
}

export function ParseTab({ onDocumentLoad }: ParseTabProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate document parsing - extract parts with hierarchy
      const mockParts: DocumentPart[] = [
        { 
          id: '1', 
          type: 'header', 
          label: 'Document Header', 
          bounds: { x: 0, y: 0, width: 100, height: 8 }, 
          level: 0,
          fields: [
            { label: 'Form Type', value: 'Uniform Residential Appraisal Report' },
            { label: 'Form Number', value: 'FNMA 1004' },
            { label: 'Date', value: '2024-01-15' }
          ]
        },
        { 
          id: '2', 
          type: 'section', 
          label: 'Client & Property Identification', 
          bounds: { x: 0, y: 8, width: 100, height: 15 }, 
          level: 0,
          fields: [
            { label: 'Section ID', value: 'S001' },
            { label: 'Page', value: '1' },
            { label: 'Required', value: 'Yes' }
          ]
        },
        { 
          id: '3', 
          type: 'text-block', 
          label: 'Client Information', 
          bounds: { x: 0, y: 10, width: 100, height: 5 }, 
          parentId: '2', 
          level: 1,
          fields: [
            { label: 'Client Name', value: '[Text Field]' },
            { label: 'Address', value: '[Text Field]' },
            { label: 'Contact', value: '[Text Field]' }
          ]
        },
        { 
          id: '4', 
          type: 'text-block', 
          label: 'Property Details', 
          bounds: { x: 0, y: 15, width: 100, height: 8 }, 
          parentId: '2', 
          level: 1,
          fields: [
            { label: 'Street Address', value: '[Text Field]' },
            { label: 'City/State/Zip', value: '[Text Field]' },
            { label: 'Legal Description', value: '[Text Area]' },
            { label: 'County', value: '[Text Field]' }
          ]
        },
        { 
          id: '5', 
          type: 'section', 
          label: 'Purpose Statement', 
          bounds: { x: 0, y: 23, width: 100, height: 12 }, 
          level: 0,
          fields: [
            { label: 'Section ID', value: 'S002' },
            { label: 'Content Type', value: 'Paragraph' },
            { label: 'Character Limit', value: '500' }
          ]
        },
        { 
          id: '6', 
          type: 'section', 
          label: 'Sales Comparison Analysis', 
          bounds: { x: 0, y: 35, width: 100, height: 38 }, 
          level: 0,
          fields: [
            { label: 'Section ID', value: 'S003' },
            { label: 'Page', value: '2' },
            { label: 'Contains Table', value: 'Yes' }
          ]
        },
        { 
          id: '7', 
          type: 'table', 
          label: 'Comparable Properties Table', 
          bounds: { x: 0, y: 40, width: 100, height: 25 }, 
          parentId: '6', 
          level: 1,
          fields: [
            { label: 'Rows', value: '4' },
            { label: 'Columns', value: '12' },
            { label: 'Subject Property', value: 'Column 1' },
            { label: 'Comparable 1', value: 'Column 2' },
            { label: 'Comparable 2', value: 'Column 3' },
            { label: 'Comparable 3', value: 'Column 4' }
          ]
        },
        { 
          id: '8', 
          type: 'text-block', 
          label: 'Analysis Notes', 
          bounds: { x: 0, y: 65, width: 100, height: 8 }, 
          parentId: '6', 
          level: 1,
          fields: [
            { label: 'Content Type', value: 'Rich Text' },
            { label: 'Min Characters', value: '200' },
            { label: 'Max Characters', value: '1000' }
          ]
        },
        { 
          id: '9', 
          type: 'section', 
          label: 'Participating Parties', 
          bounds: { x: 0, y: 73, width: 100, height: 10 }, 
          level: 0,
          fields: [
            { label: 'Section ID', value: 'S004' },
            { label: 'Appraiser Info', value: 'Required' },
            { label: 'Signature Fields', value: '2' }
          ]
        },
        { 
          id: '10', 
          type: 'section', 
          label: 'Opinion of Value', 
          bounds: { x: 0, y: 83, width: 100, height: 7 }, 
          level: 0,
          fields: [
            { label: 'Value Field', value: 'Currency' },
            { label: 'Effective Date', value: 'Date Field' },
            { label: 'Validation', value: 'Required' }
          ]
        },
        { 
          id: '11', 
          type: 'section', 
          label: 'Statement of Limiting Conditions', 
          bounds: { x: 0, y: 90, width: 100, height: 13 }, 
          level: 0,
          fields: [
            { label: 'Section ID', value: 'S005' },
            { label: 'Page', value: '3' },
            { label: 'Subsections', value: '2' }
          ]
        },
        { 
          id: '12', 
          type: 'text-block', 
          label: 'General Assumptions', 
          bounds: { x: 0, y: 92, width: 100, height: 5 }, 
          parentId: '11', 
          level: 1,
          fields: [
            { label: 'Format', value: 'Bulleted List' },
            { label: 'Items', value: '8' },
            { label: 'Editable', value: 'No' }
          ]
        },
        { 
          id: '13', 
          type: 'text-block', 
          label: 'Contingent Conditions', 
          bounds: { x: 0, y: 97, width: 100, height: 6 }, 
          parentId: '11', 
          level: 1,
          fields: [
            { label: 'Format', value: 'Checkboxes' },
            { label: 'Options', value: '5' },
            { label: 'Allow Multiple', value: 'Yes' }
          ]
        },
        { 
          id: '14', 
          type: 'footer', 
          label: 'Form Information', 
          bounds: { x: 0, y: 103, width: 100, height: 3 }, 
          level: 0,
          fields: [
            { label: 'Version', value: '2024.1' },
            { label: 'Page Number', value: 'Auto' },
            { label: 'Print Date', value: 'Auto' }
          ]
        },
      ];
      onDocumentLoad?.(mockParts);
    }
  };

  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h3>Upload Document</h3>
            <p className="mt-1 opacity-60 text-sm">Load a document to parse and extract sections</p>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              <Upload className="w-4 h-4" />
              <span>Load Document</span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
          <ImageWithFallback
            src={exampleImage}
            alt="Document example"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
