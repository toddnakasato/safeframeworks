import React, { useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { 
  Upload, 
  FileText, 
  Image, 
  FileVideo, 
  FileAudio, 
  File, 
  X, 
  Download,
  Database,
  Plus,
  Trash2
} from 'lucide-react';

interface FileDropProps {
  onFilesUploaded: (files: File[]) => void;
  uploadedFiles: File[];
}

interface DataRecord {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'completed' | 'error';
  files: File[];
}

const getFileIcon = (file: File) => {
  const type = file.type;
  if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
  if (type.startsWith('video/')) return <FileVideo className="h-4 w-4" />;
  if (type.startsWith('audio/')) return <FileAudio className="h-4 w-4" />;
  if (type.includes('text') || type.includes('document')) return <FileText className="h-4 w-4" />;
  return <File className="h-4 w-4" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileUploadZone: React.FC<{ 
  onFilesUploaded: (files: File[]) => void; 
  title: string;
  description: string;
  className?: string;
}> = ({ onFilesUploaded, title, description, className = '' }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: { files: File[] }) => {
      if (item.files && item.files.length > 0) {
        onFilesUploaded(Array.from(item.files));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={`
        border-2 border-dashed rounded-lg p-6 transition-all duration-200 min-h-[120px]
        flex flex-col items-center justify-center gap-2 cursor-pointer
        ${isActive 
          ? 'border-blue-500 bg-blue-50 scale-105' 
          : canDrop 
            ? 'border-blue-400 bg-blue-25' 
            : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
        }
        ${className}
      `}
    >
      <Upload className={`h-8 w-8 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
      <h3 className={`text-sm ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
        {title}
      </h3>
      <p className={`text-xs text-center ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
        {description}
      </p>
    </div>
  );
};

const TemplateDropZone: React.FC<{
  onFilesAdded: (files: File[]) => void;
  records: DataRecord[];
  onRecordDelete: (recordId: string) => void;
}> = ({ onFilesAdded, records, onRecordDelete }) => {
  // This drop zone covers the entire template area
  // Files dropped ANYWHERE in this zone go to the bottom
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: { files: File[] }) => {
      if (item.files && item.files.length > 0) {
        // Always add to bottom, regardless of drop position
        onFilesAdded(Array.from(item.files));
        toast.success(`Added ${item.files.length} file(s) to bottom of template`);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div
      ref={drop}
      className={`
        relative p-6 rounded-xl transition-all duration-300
        ${isActive 
          ? 'border-4 border-dashed border-green-500 bg-green-50 shadow-2xl' 
          : 'border-4 border-dashed border-blue-300 bg-blue-50/50'
        }
      `}
    >
      {/* Template Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-blue-200 mb-2">
          <Upload className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-blue-800">Drop files anywhere - they go to bottom</span>
        </div>
      </div>

      {/* Records Display */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {records.map((record, index) => (
          <div
            key={record.id}
            className="p-4 rounded-lg border-2 border-slate-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-sm text-slate-700">{record.name}</h4>
                  <p className="text-xs text-slate-500">{record.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={statusColors[record.status]}>
                  {record.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRecordDelete(record.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Drop Overlay */}
      {isActive && (
        <div className="absolute inset-0 bg-green-100/90 rounded-xl flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <Upload className="h-16 w-16 text-green-600 mx-auto mb-4 animate-bounce" />
            <p className="text-xl text-green-800">Drop files to add to bottom!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const FileDrop: React.FC<FileDropProps> = ({ onFilesUploaded, uploadedFiles }) => {
  const [records, setRecords] = useState<DataRecord[]>([
    { id: '1', name: 'Customer Data Import', type: 'Data Processing', status: 'pending', files: [] },
    { id: '2', name: 'Product Catalog Update', type: 'Content Management', status: 'completed', files: [] },
    { id: '3', name: 'User Analytics Report', type: 'Analytics', status: 'error', files: [] },
  ]);

  // Template-specific files that are shown at the bottom
  const [templateFiles, setTemplateFiles] = useState<File[]>([]);

  const handleFilesAddedToTemplate = useCallback((files: File[]) => {
    // Always add to the bottom of the template file list
    setTemplateFiles(prev => [...prev, ...files]);
    onFilesUploaded(files);
  }, [onFilesUploaded]);

  const addNewRecord = () => {
    const types = ['Data Processing', 'Content Management', 'Analytics', 'Backup', 'Import/Export'];
    const statuses: Array<'pending' | 'completed' | 'error'> = ['pending', 'completed', 'error'];
    
    const newRecord: DataRecord = {
      id: Date.now().toString(),
      name: `New Record ${records.length + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      files: [],
    };
    
    setRecords(prev => [...prev, newRecord]);
  };

  const deleteRecord = useCallback((recordId: string) => {
    setRecords(prev => prev.filter(record => record.id !== recordId));
  }, []);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-300 rounded-lg p-5">
        <h3 className="text-sm text-blue-900 mb-3 flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Template Drop Zone - Always Drops to Bottom
        </h3>
        <ul className="text-xs text-blue-800 space-y-2">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <strong>Drop anywhere in the template zone</strong> - files automatically go to the bottom
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <strong>Position doesn't matter</strong> - all drops are added to the end of the list
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <strong>General upload zone</strong> - traditional file upload area on the left
          </li>
        </ul>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* General File Upload */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="text-lg text-slate-700 mb-4">General File Upload</h3>
            <FileUploadZone
              onFilesUploaded={onFilesUploaded}
              title="Drop Files Here"
              description="Drag and drop files for general upload"
            />
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm text-slate-700 mb-2">Uploaded Files ({uploadedFiles.length}):</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border text-sm">
                      {getFileIcon(file)}
                      <span className="flex-1 truncate">{file.name}</span>
                      <span className="text-slate-500 text-xs">{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template Drop Zone - Always Drops to Bottom */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg text-slate-700 flex items-center gap-2">
                  Template Zone
                  <Badge variant="outline" className="bg-green-100 border-green-400 text-green-700">
                    Drop to Bottom
                  </Badge>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Drag files anywhere in this zone</p>
              </div>
              <Button
                onClick={addNewRecord}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Record
              </Button>
            </div>
            <TemplateDropZone
              onFilesAdded={handleFilesAddedToTemplate}
              records={records}
              onRecordDelete={deleteRecord}
            />
            
            {/* Files at the bottom of template */}
            {templateFiles.length > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-300">
                <h4 className="text-sm text-slate-700 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  Files Added to Template Bottom ({templateFiles.length}):
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {templateFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-white rounded-lg border shadow-sm text-sm">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-xs">
                        {index + 1}
                      </div>
                      {getFileIcon(file)}
                      <span className="flex-1 truncate font-medium">{file.name}</span>
                      <span className="text-slate-500 text-xs">{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* File Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl text-blue-600 mb-1">{uploadedFiles.length}</div>
          <div className="text-sm text-slate-600">General Files</div>
        </div>
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl text-green-600 mb-1">{templateFiles.length}</div>
          <div className="text-sm text-slate-600">Template Files</div>
        </div>
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl text-purple-600 mb-1">{records.length}</div>
          <div className="text-sm text-slate-600">Records</div>
        </div>
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl text-orange-600 mb-1">
            {Math.round([...uploadedFiles, ...templateFiles].reduce((acc, file) => acc + file.size, 0) / 1024 / 1024 * 100) / 100}
          </div>
          <div className="text-sm text-slate-600">MB Total</div>
        </div>
      </div>
    </div>
  );
};