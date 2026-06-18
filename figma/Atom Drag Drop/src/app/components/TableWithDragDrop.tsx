import React, { useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { 
  GripVertical, 
  Upload, 
  Move, 
  Database,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Plus,
  Trash2,
  Download,
  Filter,
  Search,
  MoreHorizontal,
  ArrowUpDown,
  Check,
  X
} from 'lucide-react';

interface TableCell {
  id: string;
  content: string;
  type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'file';
  editable: boolean;
  files?: File[];
}

interface TableRow {
  id: string;
  cells: TableCell[];
  status: 'active' | 'pending' | 'completed' | 'error';
  priority: 'low' | 'medium' | 'high';
  selected: boolean;
}

const ITEM_TYPES = {
  ROW: 'TABLE_ROW',
  CELL: 'TABLE_CELL',
  FILE: NativeTypes.FILE,
};

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-300',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  completed: 'bg-blue-100 text-blue-800 border-blue-300',
  error: 'bg-red-100 text-red-800 border-red-300',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800 border-gray-300',
  medium: 'bg-orange-100 text-orange-800 border-orange-300',
  high: 'bg-red-100 text-red-800 border-red-300',
};

const getCellIcon = (type: string) => {
  switch (type) {
    case 'email': return <Mail className="h-3 w-3" />;
    case 'phone': return <Phone className="h-3 w-3" />;
    case 'date': return <Calendar className="h-3 w-3" />;
    case 'file': return <FileText className="h-3 w-3" />;
    case 'number': return <Database className="h-3 w-3" />;
    default: return <User className="h-3 w-3" />;
  }
};

const DraggableCell: React.FC<{
  cell: TableCell;
  rowId: string;
  cellIndex: number;
  moveCell: (fromRowId: string, fromCellIndex: number, toRowId: string, toCellIndex: number) => void;
}> = ({ cell, rowId, cellIndex, moveCell }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPES.CELL,
    item: { cellId: cell.id, rowId, cellIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPES.CELL,
    drop: (item: { cellId: string; rowId: string; cellIndex: number }) => {
      if (item.rowId !== rowId || item.cellIndex !== cellIndex) {
        moveCell(item.rowId, item.cellIndex, rowId, cellIndex);
        toast.success('Cell moved');
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        relative p-2 border rounded cursor-move transition-all duration-200
        ${isDragging ? 'opacity-50 scale-105 z-10' : 'opacity-100'}
        ${isOver ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}
      `}
    >
      <div className="flex items-center gap-2 text-sm">
        {getCellIcon(cell.type)}
        <span className="flex-1 truncate">{cell.content}</span>
        {cell.files && cell.files.length > 0 && (
          <Badge variant="outline" className="text-xs px-1 py-0">
            {cell.files.length}
          </Badge>
        )}
      </div>
      {cell.files && cell.files.length > 0 && (
        <div className="mt-1 text-xs text-slate-500">
          {cell.files.map((file, index) => (
            <div key={index} className="truncate">{file.name}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const DraggableRow: React.FC<{
  row: TableRow;
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  moveCell: (fromRowId: string, fromCellIndex: number, toRowId: string, toCellIndex: number) => void;
  onFilesDrop: (rowId: string, files: File[]) => void;
  onToggleSelect: (rowId: string) => void;
  onDeleteRow: (rowId: string) => void;
}> = ({ row, index, moveRow, moveCell, onFilesDrop, onToggleSelect, onDeleteRow }) => {
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
      if (item.files && item.files.length > 0) {
        onFilesDrop(row.id, Array.from(item.files));
        toast.success(`Added ${item.files.length} file(s) to row`);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drag(rowDrop(fileDrop(node)))}
      className={`
        bg-white border-b border-slate-200 transition-all duration-200 group
        ${isDragging ? 'opacity-50 z-10 shadow-xl bg-blue-50' : 'opacity-100'}
        ${isRowOver ? 'border-blue-400 bg-blue-50' : ''}
        ${isFileOver ? 'border-green-400 bg-green-50' : ''}
        ${row.selected ? 'bg-blue-50 border-blue-300' : ''}
        hover:bg-slate-50
      `}
    >
      <div className="flex items-center py-3 px-4 gap-4">
        {/* Drag Handle */}
        <div className="cursor-move text-slate-400 hover:text-slate-600 transition-colors">
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={row.selected}
          onChange={() => onToggleSelect(row.id)}
          className="rounded border-slate-300"
        />

        {/* Cells in a single row */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          {row.cells.map((cell, cellIndex) => (
            <div key={cell.id} className="flex items-center gap-2 min-w-0">
              {getCellIcon(cell.type)}
              <span className="text-sm text-slate-700 truncate">{cell.content}</span>
              {cell.files && cell.files.length > 0 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {cell.files.length}
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Status & Priority */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="outline" className={statusColors[row.status]}>
            {row.status}
          </Badge>
          <Badge variant="outline" className={priorityColors[row.priority]}>
            {row.priority}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteRow(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* File Drop Indicator */}
      {isFileOver && (
        <div className="px-4 pb-3">
          <div className="p-2 border-2 border-dashed border-green-400 rounded-lg text-center">
            <Upload className="h-4 w-4 mx-auto mb-1 text-green-600" />
            <p className="text-sm text-green-600">Drop files to attach to this row</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const TableWithDragDrop: React.FC = () => {
  const [rows, setRows] = useState<TableRow[]>([
    {
      id: '1',
      cells: [
        { id: '1-1', content: 'John Doe', type: 'text', editable: true },
        { id: '1-2', content: 'john@example.com', type: 'email', editable: true },
        { id: '1-3', content: '+1 (555) 123-4567', type: 'phone', editable: true },
        { id: '1-4', content: '2024-01-15', type: 'date', editable: true },
        { id: '1-5', content: 'Engineering', type: 'text', editable: true },
      ],
      status: 'active',
      priority: 'high',
      selected: false,
    },
    {
      id: '2',
      cells: [
        { id: '2-1', content: 'Jane Smith', type: 'text', editable: true },
        { id: '2-2', content: 'jane@example.com', type: 'email', editable: true },
        { id: '2-3', content: '+1 (555) 234-5678', type: 'phone', editable: true },
        { id: '2-4', content: '2024-01-14', type: 'date', editable: true },
        { id: '2-5', content: 'Marketing', type: 'text', editable: true },
      ],
      status: 'pending',
      priority: 'medium',
      selected: false,
    },
    {
      id: '3',
      cells: [
        { id: '3-1', content: 'Bob Johnson', type: 'text', editable: true },
        { id: '3-2', content: 'bob@example.com', type: 'email', editable: true },
        { id: '3-3', content: '+1 (555) 345-6789', type: 'phone', editable: true },
        { id: '3-4', content: '2024-01-13', type: 'date', editable: true },
        { id: '3-5', content: 'Sales', type: 'text', editable: true },
      ],
      status: 'completed',
      priority: 'low',
      selected: false,
    },
    {
      id: '4',
      cells: [
        { id: '4-1', content: 'Alice Brown', type: 'text', editable: true },
        { id: '4-2', content: 'alice@example.com', type: 'email', editable: true },
        { id: '4-3', content: '+1 (555) 456-7890', type: 'phone', editable: true },
        { id: '4-4', content: '2024-01-12', type: 'date', editable: true },
        { id: '4-5', content: 'Design', type: 'text', editable: true },
      ],
      status: 'active',
      priority: 'high',
      selected: false,
    },
    {
      id: '5',
      cells: [
        { id: '5-1', content: 'Charlie Wilson', type: 'text', editable: true },
        { id: '5-2', content: 'charlie@example.com', type: 'email', editable: true },
        { id: '5-3', content: '+1 (555) 567-8901', type: 'phone', editable: true },
        { id: '5-4', content: '2024-01-11', type: 'date', editable: true },
        { id: '5-5', content: 'Operations', type: 'text', editable: true },
      ],
      status: 'error',
      priority: 'medium',
      selected: false,
    },
    {
      id: '6',
      cells: [
        { id: '6-1', content: 'Diana Lee', type: 'text', editable: true },
        { id: '6-2', content: 'diana@example.com', type: 'email', editable: true },
        { id: '6-3', content: '+1 (555) 678-9012', type: 'phone', editable: true },
        { id: '6-4', content: '2024-01-10', type: 'date', editable: true },
        { id: '6-5', content: 'HR', type: 'text', editable: true },
      ],
      status: 'pending',
      priority: 'low',
      selected: false,
    },
    {
      id: '7',
      cells: [
        { id: '7-1', content: 'Ethan Davis', type: 'text', editable: true },
        { id: '7-2', content: 'ethan@example.com', type: 'email', editable: true },
        { id: '7-3', content: '+1 (555) 789-0123', type: 'phone', editable: true },
        { id: '7-4', content: '2024-01-09', type: 'date', editable: true },
        { id: '7-5', content: 'Finance', type: 'text', editable: true },
      ],
      status: 'active',
      priority: 'high',
      selected: false,
    },
    {
      id: '8',
      cells: [
        { id: '8-1', content: 'Fiona Garcia', type: 'text', editable: true },
        { id: '8-2', content: 'fiona@example.com', type: 'email', editable: true },
        { id: '8-3', content: '+1 (555) 890-1234', type: 'phone', editable: true },
        { id: '8-4', content: '2024-01-08', type: 'date', editable: true },
        { id: '8-5', content: 'Legal', type: 'text', editable: true },
      ],
      status: 'completed',
      priority: 'medium',
      selected: false,
    },
    {
      id: '9',
      cells: [
        { id: '9-1', content: 'George Miller', type: 'text', editable: true },
        { id: '9-2', content: 'george@example.com', type: 'email', editable: true },
        { id: '9-3', content: '+1 (555) 901-2345', type: 'phone', editable: true },
        { id: '9-4', content: '2024-01-07', type: 'date', editable: true },
        { id: '9-5', content: 'IT Support', type: 'text', editable: true },
      ],
      status: 'pending',
      priority: 'low',
      selected: false,
    },
    {
      id: '10',
      cells: [
        { id: '10-1', content: 'Hannah Taylor', type: 'text', editable: true },
        { id: '10-2', content: 'hannah@example.com', type: 'email', editable: true },
        { id: '10-3', content: '+1 (555) 012-3456', type: 'phone', editable: true },
        { id: '10-4', content: '2024-01-06', type: 'date', editable: true },
        { id: '10-5', content: 'Product', type: 'text', editable: true },
      ],
      status: 'active',
      priority: 'high',
      selected: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const moveRow = useCallback((dragIndex: number, hoverIndex: number) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      const dragRow = newRows[dragIndex];
      newRows.splice(dragIndex, 1);
      newRows.splice(hoverIndex, 0, dragRow);
      return newRows;
    });
  }, []);

  const moveCell = useCallback((fromRowId: string, fromCellIndex: number, toRowId: string, toCellIndex: number) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      const fromRowIndex = newRows.findIndex(row => row.id === fromRowId);
      const toRowIndex = newRows.findIndex(row => row.id === toRowId);
      
      if (fromRowIndex !== -1 && toRowIndex !== -1) {
        const fromCell = newRows[fromRowIndex].cells[fromCellIndex];
        const toCell = newRows[toRowIndex].cells[toCellIndex];
        
        // Swap cells
        newRows[fromRowIndex].cells[fromCellIndex] = toCell;
        newRows[toRowIndex].cells[toCellIndex] = fromCell;
      }
      
      return newRows;
    });
  }, []);

  const handleFilesDrop = useCallback((rowId: string, files: File[]) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id === rowId) {
        // Add files to first file-type cell or create one
        const fileCell = row.cells.find(cell => cell.type === 'file');
        if (fileCell) {
          return {
            ...row,
            cells: row.cells.map(cell => 
              cell.id === fileCell.id 
                ? { ...cell, files: [...(cell.files || []), ...files] }
                : cell
            )
          };
        } else {
          // Create new file cell
          const newCell: TableCell = {
            id: `${rowId}-file-${Date.now()}`,
            content: `${files.length} file(s)`,
            type: 'file',
            editable: false,
            files: files,
          };
          return {
            ...row,
            cells: [...row.cells, newCell]
          };
        }
      }
      return row;
    }));
  }, []);

  const toggleRowSelect = useCallback((rowId: string) => {
    setRows(prevRows => prevRows.map(row => 
      row.id === rowId ? { ...row, selected: !row.selected } : row
    ));
  }, []);

  const deleteRow = useCallback((rowId: string) => {
    setRows(prevRows => prevRows.filter(row => row.id !== rowId));
    toast.success('Row deleted');
  }, []);

  const addNewRow = () => {
    const departments = ['Engineering', 'Marketing', 'Sales', 'Design', 'Operations', 'HR', 'Finance', 'Legal', 'IT Support', 'Product'];
    const statuses: Array<'active' | 'pending' | 'completed' | 'error'> = ['active', 'pending', 'completed', 'error'];
    const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    
    const timestamp = Date.now();
    const newRow: TableRow = {
      id: timestamp.toString(),
      cells: [
        { id: `${timestamp}-1`, content: 'New User', type: 'text', editable: true },
        { id: `${timestamp}-2`, content: 'new@example.com', type: 'email', editable: true },
        { id: `${timestamp}-3`, content: '+1 (555) 000-0000', type: 'phone', editable: true },
        { id: `${timestamp}-4`, content: new Date().toISOString().split('T')[0], type: 'date', editable: true },
        { id: `${timestamp}-5`, content: departments[Math.floor(Math.random() * departments.length)], type: 'text', editable: true },
      ],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      selected: false,
    };
    setRows(prev => [...prev, newRow]);
  };

  const selectAll = () => {
    setRows(prevRows => prevRows.map(row => ({ ...row, selected: true })));
  };

  const deselectAll = () => {
    setRows(prevRows => prevRows.map(row => ({ ...row, selected: false })));
  };

  const deleteSelected = () => {
    const selectedCount = rows.filter(row => row.selected).length;
    setRows(prevRows => prevRows.filter(row => !row.selected));
    toast.success(`Deleted ${selectedCount} row(s)`);
  };

  const filteredRows = rows.filter(row => {
    const matchesSearch = searchTerm === '' || 
      row.cells.some(cell => cell.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || row.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const selectedCount = rows.filter(row => row.selected).length;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-sm text-red-800 mb-2">Complete Table Features:</h3>
        <ul className="text-xs text-red-700 space-y-1">
          <li>• Drag entire rows to reorder them using the grip handle</li>
          <li>• Drag individual cells between rows and positions</li>
          <li>• Drop files onto rows to attach them to that record</li>
          <li>• Use checkboxes to select multiple rows for bulk operations</li>
          <li>• Search and filter functionality included</li>
        </ul>
      </div>

      {/* Table Controls */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg text-slate-700">Advanced Data Table</h3>
              <Badge variant="outline" className="px-3 py-1">
                {rows.length} rows
              </Badge>
              {selectedCount > 0 && (
                <Badge variant="outline" className="px-3 py-1 bg-blue-50 border-blue-300 text-blue-700">
                  {selectedCount} selected
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
              
              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="error">Error</option>
              </select>

              {/* Bulk Actions */}
              {selectedCount > 0 && (
                <>
                  <Button
                    onClick={deleteSelected}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete ({selectedCount})
                  </Button>
                </>
              )}

              {/* Row Actions */}
              <Button
                onClick={selectedCount === rows.length ? deselectAll : selectAll}
                variant="outline"
                size="sm"
              >
                {selectedCount === rows.length ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Select All
                  </>
                )}
              </Button>

              <Button
                onClick={addNewRow}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Row
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Header */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="flex items-center py-3 px-4 gap-4 bg-slate-50 border-b border-slate-200">
            <div className="w-4"></div> {/* Drag handle space */}
            <div className="w-4"></div> {/* Checkbox space */}
            <div className="flex items-center gap-6 flex-1 min-w-0 text-sm text-slate-600">
              <div className="flex items-center gap-2 min-w-0">
                <User className="h-3 w-3" />
                <span>Name</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="h-3 w-3" />
                <span>Email</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Phone className="h-3 w-3" />
                <span>Phone</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Calendar className="h-3 w-3" />
                <span>Date</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Database className="h-3 w-3" />
                <span>Department</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 text-sm text-slate-600">
              <span>Status</span>
              <span>Priority</span>
            </div>
            <div className="w-20"></div> {/* Actions space */}
          </div>
        </CardContent>
      </Card>

      {/* Table Rows */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {filteredRows.map((row, index) => (
            <DraggableRow
              key={row.id}
              row={row}
              index={index}
              moveRow={moveRow}
              moveCell={moveCell}
              onFilesDrop={handleFilesDrop}
              onToggleSelect={toggleRowSelect}
              onDeleteRow={deleteRow}
            />
          ))}
          
          {filteredRows.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg mb-2">No rows found</h3>
              <p className="text-sm">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Add a new row to get started'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid md:grid-cols-6 gap-4">
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl text-slate-600 mb-1">{rows.length}</div>
          <div className="text-sm text-slate-600">Total Rows</div>
        </div>
        
        {['active', 'pending', 'completed', 'error'].map(status => (
          <div key={status} className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl mb-1" style={{
              color: status === 'active' ? '#16a34a' :
                     status === 'pending' ? '#ca8a04' :
                     status === 'completed' ? '#2563eb' : '#dc2626'
            }}>
              {rows.filter(row => row.status === status).length}
            </div>
            <div className="text-sm text-slate-600 capitalize">{status}</div>
          </div>
        ))}
        
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl text-purple-600 mb-1">
            {rows.reduce((acc, row) => acc + (row.cells.find(cell => cell.files)?.files?.length || 0), 0)}
          </div>
          <div className="text-sm text-slate-600">Files</div>
        </div>
      </div>
    </div>
  );
};