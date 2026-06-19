import React, { useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { 
  GripVertical, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  Upload,
  FileText,
  Paperclip
} from 'lucide-react';

interface TableRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  date: string;
  status: 'active' | 'inactive' | 'pending';
  priority: 'low' | 'medium' | 'high';
  files: File[];
}

const ITEM_TYPES = {
  ROW: 'TABLE_ROW',
  FILE: '__NATIVE_FILE__'
};

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-300',
  inactive: 'bg-gray-100 text-gray-800 border-gray-300',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-300',
  medium: 'bg-orange-100 text-orange-800 border-orange-300',
  high: 'bg-red-100 text-red-800 border-red-300',
};

const DraggableRow: React.FC<{
  row: TableRow;
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (id: string) => void;
  onFilesDrop: (rowId: string, files: File[]) => void;
}> = ({ row, index, moveRow, onDelete, onFilesDrop }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPES.ROW,
    item: { id: row.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver: isRowOver }, rowDrop] = useDrop({
    accept: ITEM_TYPES.ROW,
    hover: (item: { id: string; index: number }) => {
      if (item.index !== index) {
        moveRow(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOver: isFileOver }, fileDrop] = useDrop({
    accept: ITEM_TYPES.FILE,
    drop: (item: { files: File[] }) => {
      onFilesDrop(row.id, item.files);
      toast.success(`${item.files.length} file(s) attached to ${row.name}`);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drag(rowDrop(node))}
      className={`
        bg-white rounded-lg border transition-all duration-200 group
        ${isDragging ? 'opacity-50 rotate-1 scale-105 shadow-xl z-10' : 'opacity-100'}
        ${isRowOver ? 'border-blue-400 shadow-md' : 'border-slate-200'}
        hover:shadow-md hover:border-slate-300
      `}
    >
      <div className="p-4">
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Drag Handle */}
          <div className="col-span-1">
            <div className="cursor-move text-slate-400 hover:text-slate-600 transition-colors">
              <GripVertical className="h-5 w-5" />
            </div>
          </div>

          {/* User Info */}
          <div className="col-span-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                {row.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm text-slate-800">{row.name}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {row.email}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 hidden lg:block">
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {row.phone}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {row.location}
              </div>
            </div>
          </div>

          {/* PROMINENT FILE DROP ZONE */}
          <div className="col-span-3">
            <div
              ref={fileDrop}
              className={`
                relative border-3 border-dashed rounded-xl p-4 transition-all duration-300
                min-h-[80px] flex flex-col items-center justify-center
                ${isFileOver 
                  ? 'border-green-500 bg-green-100 scale-105' 
                  : 'border-slate-400 bg-slate-50'
                }
                hover:border-blue-400 hover:bg-blue-50 hover:scale-102
                cursor-pointer
              `}
            >
              <Upload className={`h-6 w-6 mb-1 ${isFileOver ? 'text-green-600' : 'text-slate-500'}`} />
              <div className="text-center">
                <div className={`text-sm font-medium ${isFileOver ? 'text-green-700' : 'text-slate-700'}`}>
                  {isFileOver ? 'Drop Files Here!' : 'Drop Files'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Drag & drop files
                </div>
                {row.files.length > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Paperclip className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-600 font-medium">{row.files.length} file(s)</span>
                  </div>
                )}
              </div>
              
              {/* Animated border effect when hovering */}
              {isFileOver && (
                <div className="absolute inset-0 border-3 border-green-400 rounded-xl animate-pulse" />
              )}
            </div>
          </div>

          {/* Status & Actions */}
          <div className="col-span-2">
            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                <Badge variant="outline" className={`text-xs ${statusColors[row.status]}`}>
                  {row.status}
                </Badge>
                <Badge variant="outline" className={`text-xs ${priorityColors[row.priority]}`}>
                  {row.priority}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(row.id)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity self-start"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Attached Files */}
        {row.files.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600 font-medium">Attached Files:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {row.files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{file.name}</div>
                    <div className="text-slate-400">({Math.round(file.size / 1024)}KB)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Contact Info */}
        <div className="lg:hidden mt-4 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {row.phone}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {row.location}
            </div>
            <div className="flex items-center gap-1 col-span-2">
              <Calendar className="h-3 w-3" />
              {row.date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RowDragDrop: React.FC = () => {
  const [rows, setRows] = useState<TableRow[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      date: '2024-01-15',
      status: 'active',
      priority: 'high',
      files: [],
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, CA',
      date: '2024-01-14',
      status: 'pending',
      priority: 'medium',
      files: [],
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, IL',
      date: '2024-01-13',
      status: 'inactive',
      priority: 'low',
      files: [],
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+1 (555) 456-7890',
      location: 'Houston, TX',
      date: '2024-01-12',
      status: 'active',
      priority: 'high',
      files: [],
    },
    {
      id: '5',
      name: 'Eva Brown',
      email: 'eva@example.com',
      phone: '+1 (555) 567-8901',
      location: 'Phoenix, AZ',
      date: '2024-01-11',
      status: 'pending',
      priority: 'medium',
      files: [],
    },
  ]);

  const [originalOrder, setOriginalOrder] = useState<TableRow[]>([...rows]);

  const moveRow = useCallback((dragIndex: number, hoverIndex: number) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      const dragRow = newRows[dragIndex];
      newRows.splice(dragIndex, 1);
      newRows.splice(hoverIndex, 0, dragRow);
      return newRows;
    });
  }, []);

  const handleFilesDrop = useCallback((rowId: string, droppedFiles: File[]) => {
    setRows(prev => prev.map(row => 
      row.id === rowId 
        ? { ...row, files: [...row.files, ...droppedFiles] }
        : row
    ));
  }, []);

  const addNewRow = () => {
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Davis'];
    const locations = ['Miami, FL', 'Seattle, WA', 'Boston, MA', 'Denver, CO', 'Atlanta, GA'];
    const statuses: Array<'active' | 'inactive' | 'pending'> = ['active', 'inactive', 'pending'];
    const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    
    const newRow: TableRow = {
      id: Date.now().toString(),
      name: randomName,
      email: `${randomName.toLowerCase().replace(' ', '.')}@example.com`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      location: randomLocation,
      date: new Date().toISOString().split('T')[0],
      status: randomStatus,
      priority: randomPriority,
      files: [],
    };
    
    setRows(prev => [...prev, newRow]);
  };

  const deleteRow = useCallback((id: string) => {
    setRows(prev => prev.filter(row => row.id !== id));
    toast.success('Row deleted');
  }, []);

  const resetOrder = () => {
    setRows([...originalOrder]);
    toast.success('Order reset to original');
  };

  const saveOrder = () => {
    setOriginalOrder([...rows]);
    toast.success('Current order saved');
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm text-green-800 mb-2">Records with File Upload:</h3>
        <ul className="text-xs text-green-700 space-y-1">
          <li>• Grab any row by the grip handle (⋮⋮) to reorder records</li>
          <li>• Drag files from your computer to the dotted drop zone in any row</li>
          <li>• Files will be attached to that specific record</li>
          <li>• Multiple files can be attached to each record</li>
        </ul>
      </div>

      {/* Controls */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg text-slate-700">Table Management</h3>
              <Badge variant="outline" className="px-3 py-1">
                {rows.length} rows
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={addNewRow}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Row
              </Button>
              <Button
                onClick={resetOrder}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset Order
              </Button>
              <Button
                onClick={saveOrder}
                variant="outline"
                size="sm"
              >
                <Check className="h-4 w-4 mr-1" />
                Save Order
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Draggable Table */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="space-y-3">
            {rows.map((row, index) => (
              <DraggableRow
                key={row.id}
                row={row}
                index={index}
                moveRow={moveRow}
                onDelete={deleteRow}
                onFilesDrop={handleFilesDrop}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl text-green-600 mb-1">
            {rows.filter(row => row.status === 'active').length}
          </div>
          <div className="text-sm text-slate-600">Active Users</div>
        </div>
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl text-yellow-600 mb-1">
            {rows.filter(row => row.status === 'pending').length}
          </div>
          <div className="text-sm text-slate-600">Pending</div>
        </div>
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl text-red-600 mb-1">
            {rows.filter(row => row.priority === 'high').length}
          </div>
          <div className="text-sm text-slate-600">High Priority</div>
        </div>
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl text-slate-600 mb-1">{rows.length}</div>
          <div className="text-sm text-slate-600">Total Rows</div>
        </div>
      </div>
    </div>
  );
};