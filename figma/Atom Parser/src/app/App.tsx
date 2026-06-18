import { useState } from 'react';
import { DocumentPart } from './types/document';
import { ParseTab } from './components/ParseTab';
import { GenerateTab } from './components/GenerateTab';
import { VerifyTab } from './components/VerifyTab';
import { DocumentSectionsTab } from './components/DocumentSectionsTab';
import { JSONStructureTab } from './components/JSONStructureTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

export default function App() {
  const [parts, setParts] = useState<DocumentPart[]>([
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
  ]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background px-6 py-4">
        <h1>Document Parser Specification</h1>
        <p className="mt-1 opacity-60">Visual tool for breaking down complex documents into component parts</p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Parse/Generate/Verify */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <Tabs defaultValue="parse" className="flex-1 flex flex-col">
            <TabsList className="w-full rounded-none border-b border-border bg-muted/30 justify-start px-4">
              <TabsTrigger value="parse">Parse</TabsTrigger>
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="verify">Verify</TabsTrigger>
            </TabsList>
            <TabsContent value="parse" className="flex-1 m-0">
              <ParseTab onDocumentLoad={setParts} />
            </TabsContent>
            <TabsContent value="generate" className="flex-1 m-0">
              <GenerateTab />
            </TabsContent>
            <TabsContent value="verify" className="flex-1 m-0">
              <VerifyTab />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Document Sections/JSON Structure */}
        <div className="w-1/2 flex flex-col">
          <Tabs defaultValue="sections" className="flex-1 flex flex-col">
            <TabsList className="w-full rounded-none border-b border-border bg-muted/30 justify-start px-4">
              <TabsTrigger value="sections">Document Sections ({parts.length})</TabsTrigger>
              <TabsTrigger value="json">JSON Structure</TabsTrigger>
            </TabsList>
            <TabsContent value="sections" className="flex-1 m-0">
              <DocumentSectionsTab parts={parts} />
            </TabsContent>
            <TabsContent value="json" className="flex-1 m-0">
              <JSONStructureTab parts={parts} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
