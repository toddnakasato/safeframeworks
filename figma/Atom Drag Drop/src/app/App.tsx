import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { toast } from 'sonner@2.0.3';
import { 
  Upload, 
  FileText, 
  Database, 
  Move, 
  Grid, 
  ArrowUpDown, 
  ArrowLeftRight,
  Check,
  X,
  Plus,
  Trash2
} from 'lucide-react';

// Import our drag drop components
import { GenericDragDrop } from './components/GenericDragDrop';
import { FileDrop } from './components/FileDrop';
import { RowDragDrop } from './components/RowDragDrop';
import { CellDragDrop } from './components/CellDragDrop';
import { TableWithDragDrop } from './components/TableWithDragDrop';
import { TemplateDragDrop } from './components/TemplateDragDrop';

export default function App() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleFilesUploaded = useCallback((files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`Uploaded ${files.length} file(s)`);
  }, []);

  const handleGenericDrop = useCallback((item: any) => {
    setDraggedItem(item.name || 'Unknown item');
    toast.success(`Dropped: ${item.name || 'Unknown item'}`);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl tracking-tight text-slate-900">
                Atom Drag Drop
              </h1>
              <h2 className="text-2xl text-slate-600">
                finAtomDragDrop: Generic, File, Row, Cell & Table Drag Drop Components
              </h2>
            </div>
            <p className="text-lg max-w-4xl mx-auto text-slate-600">
              A complete drag and drop system showcasing generic drag drop, file uploads, 
              row repositioning, cell movement, and complex table interactions.
            </p>
          </div>

          {/* Status Bar */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="px-3 py-1 bg-green-100 border-green-400 text-green-700">
                    <Check className="h-3 w-3 mr-1" />
                    System Active
                  </Badge>
                  <span className="text-sm text-slate-600">
                    Files Uploaded: {uploadedFiles.length}
                  </span>
                  {draggedItem && (
                    <span className="text-sm text-blue-600">
                      Last Drop: {draggedItem}
                    </span>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setUploadedFiles([]);
                    setDraggedItem(null);
                    toast.success('Reset complete');
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generic Drag Drop */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-purple-100 border-purple-400 text-purple-700">
                  <Move className="h-3 w-3 mr-1" />
                  Generic
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Generic Drag & Drop
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Basic drag and drop functionality for any type of item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GenericDragDrop onDrop={handleGenericDrop} />
            </CardContent>
          </Card>

          {/* Template Variations - ALL 13 LAYOUTS */}
          
          {/* SINGLE PANEL (1) */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-blue-100 border-blue-400 text-blue-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Single Panel
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Main Only
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Single main content area - drag atoms and molecules into the main section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDragDrop layout="main" />
            </CardContent>
          </Card>

          {/* TWO PANEL (4) */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-green-100 border-green-400 text-green-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Two Panel
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Top + Main
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Header section and main content - drag elements to specific sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDragDrop layout="top-main" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-orange-100 border-orange-400 text-orange-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Two Panel
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Left + Main
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Left sidebar and main content - elements drop to their respective sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDragDrop layout="left-main" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-teal-100 border-teal-400 text-teal-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Two Panel
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Main + Right
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Main content with right sidebar - drop elements into either section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDragDrop layout="main-right" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-cyan-100 border-cyan-400 text-cyan-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Two Panel
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Main + Bottom
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Main content with footer section - elements drop to specific areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDragDrop layout="main-bottom" />
            </CardContent>
          </Card>

          {/* THREE PANEL (4) */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-pink-100 border-pink-400 text-pink-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Three Panel
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Top + Main + Right
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Header, main content, and right sidebar - drop to any of the three sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDragDrop layout="top-main-right" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-indigo-100 border-indigo-400 text-indigo-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Three Panel
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Top + Left + Main
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Header, left sidebar, and main content - drag to target section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDragDrop layout="top-left-main" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-red-100 border-red-400 text-red-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Three Panel
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Left + Main + Right
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Three column layout with left sidebar, main, and right sidebar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDragDrop layout="left-main-right" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-purple-100 border-purple-400 text-purple-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Three Panel
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Top + Main + Bottom
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Header, main content, and footer - classic three section layout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDragDrop layout="top-main-bottom" />
            </CardContent>
          </Card>

          {/* FOUR PANEL (3) */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-amber-100 border-amber-400 text-amber-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Four Panel
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Top + Left + Main + Right
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Header with three column layout below - drop to any of four sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDragDrop layout="top-left-main-right" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-lime-100 border-lime-400 text-lime-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Four Panel
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Top + Left + Main + Bottom
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Header, left sidebar, main content, and footer - comprehensive layout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDragDrop layout="top-left-main-bottom" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-rose-100 border-rose-400 text-rose-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Four Panel
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Top + Main + Right + Bottom
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Header, main content, right sidebar, and footer - asymmetric four panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDragDrop layout="top-main-right-bottom" />
            </CardContent>
          </Card>

          {/* FIVE PANEL (1) */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-slate-200 border-slate-400 text-slate-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Five Panel
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Complete Layout - All Sections
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Full layout with top, left, main, right, and bottom sections - maximum flexibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDragDrop layout="complete" />
            </CardContent>
          </Card>

          {/* File Drop */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-blue-100 border-blue-400 text-blue-700">
                  <Upload className="h-3 w-3 mr-1" />
                  File Upload
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  File Drag & Drop
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Drag files directly or to specific rows for record uploads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileDrop 
                onFilesUploaded={handleFilesUploaded}
                uploadedFiles={uploadedFiles}
              />
            </CardContent>
          </Card>

          {/* Row Drag Drop */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-green-100 border-green-400 text-green-700">
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  Row Reorder
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Row Drag & Drop
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Drag entire rows to reorder and reorganize data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RowDragDrop />
            </CardContent>
          </Card>

          {/* Cell Drag Drop */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-orange-100 border-orange-400 text-orange-700">
                  <Grid className="h-3 w-3 mr-1" />
                  Cell Movement
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Cell Drag & Drop
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Drag cells within sections, reposition rows, and move between columns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CellDragDrop />
            </CardContent>
          </Card>

          {/* Comprehensive Table */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 bg-red-100 border-red-400 text-red-700">
                  <Database className="h-3 w-3 mr-1" />
                  Full Table
                </Badge>
                <CardTitle className="text-xl text-slate-800">
                  Complete Table with All Drag & Drop Features
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                A comprehensive table combining all drag and drop functionalities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableWithDragDrop />
            </CardContent>
          </Card>

          {/* Feature Overview */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">
                Drag & Drop Features Overview
              </CardTitle>
              <CardDescription className="text-slate-600">
                Complete list of implemented drag and drop capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg text-slate-700">Generic Features</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Basic drag and drop
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Drop zone highlighting
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Visual feedback
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Custom drag previews
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg text-slate-700">File Operations</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      File upload drag drop
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Multiple file support
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Drag to specific rows
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      File type validation
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg text-slate-700">Row & Cell Features</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Entire row dragging
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Row reordering
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Cell movement
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Cross-column dragging
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg text-slate-700">Advanced Features</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      Complex table operations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      Multi-type drag support
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      Real-time positioning
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      Undo/redo support
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg text-slate-700">User Experience</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Smooth animations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Toast notifications
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Visual drag indicators
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Responsive design
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg text-slate-700">Integration</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      React DnD powered
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      TypeScript support
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      Tailwind CSS styling
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      Shadcn/ui components
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DndProvider>
  );
}