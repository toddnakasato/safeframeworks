import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Move, Package, Target, Plus } from 'lucide-react';

interface DragItem {
  id: string;
  name: string;
  type: string;
  color: string;
}

interface GenericDragDropProps {
  onDrop: (item: DragItem) => void;
}

const ITEM_TYPE = 'GENERIC_ITEM';

const DraggableItem: React.FC<{ item: DragItem; index: number }> = ({ item, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { ...item, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`
        p-3 bg-white rounded-lg border-2 border-dashed border-slate-300 
        cursor-move transition-all duration-200 hover:border-blue-400 hover:shadow-md
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : 'opacity-100'}
      `}
    >
      <div className="flex items-center gap-2">
        <Move className="h-4 w-4 text-slate-400" />
        <Badge 
          variant="outline" 
          className={`px-2 py-1 ${item.color} border-current`}
        >
          {item.type}
        </Badge>
        <span className="text-sm text-slate-700">{item.name}</span>
      </div>
    </div>
  );
};

const DropZone: React.FC<{ onDrop: (item: DragItem) => void; title: string; description: string }> = ({ 
  onDrop, 
  title, 
  description 
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: DragItem) => {
      onDrop(item);
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
        p-6 border-2 border-dashed rounded-lg transition-all duration-200 min-h-[120px]
        flex flex-col items-center justify-center gap-2
        ${isActive 
          ? 'border-green-400 bg-green-50 scale-105' 
          : canDrop 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-slate-300 bg-slate-50'
        }
      `}
    >
      <Target className={`h-6 w-6 ${isActive ? 'text-green-600' : 'text-slate-400'}`} />
      <h3 className={`text-sm ${isActive ? 'text-green-700' : 'text-slate-600'}`}>
        {title}
      </h3>
      <p className={`text-xs text-center ${isActive ? 'text-green-600' : 'text-slate-500'}`}>
        {description}
      </p>
    </div>
  );
};

export const GenericDragDrop: React.FC<GenericDragDropProps> = ({ onDrop }) => {
  const [items, setItems] = useState<DragItem[]>([
    { id: '1', name: 'User Profile', type: 'Component', color: 'text-blue-600 bg-blue-100' },
    { id: '2', name: 'Dashboard Widget', type: 'Widget', color: 'text-purple-600 bg-purple-100' },
    { id: '3', name: 'Data Table', type: 'Table', color: 'text-green-600 bg-green-100' },
    { id: '4', name: 'Chart Element', type: 'Chart', color: 'text-orange-600 bg-orange-100' },
  ]);

  const addNewItem = () => {
    const types = ['Component', 'Widget', 'Table', 'Chart', 'Form', 'Layout'];
    const colors = [
      'text-blue-600 bg-blue-100',
      'text-purple-600 bg-purple-100',
      'text-green-600 bg-green-100',
      'text-orange-600 bg-orange-100',
      'text-red-600 bg-red-100',
      'text-indigo-600 bg-indigo-100',
    ];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newItem: DragItem = {
      id: Date.now().toString(),
      name: `New ${randomType}`,
      type: randomType,
      color: randomColor,
    };
    
    setItems(prev => [...prev, newItem]);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm text-blue-800 mb-2">How to use:</h3>
        <p className="text-xs text-blue-700">
          Drag any item from the "Available Items" section to either drop zone below. 
          Watch for visual feedback as you drag and hover over drop zones.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Available Items */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-slate-700">Available Items</h3>
              <Button
                onClick={addNewItem}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <DraggableItem key={item.id} item={item} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Drop Zones */}
        <div className="space-y-4">
          <DropZone
            onDrop={onDrop}
            title="Primary Drop Zone"
            description="Drop items here for primary processing"
          />
          <DropZone
            onDrop={(item) => {
              onDrop({ ...item, name: `[Secondary] ${item.name}` });
            }}
            title="Secondary Drop Zone"
            description="Drop items here for secondary processing"
          />
        </div>
      </div>

      {/* Info Panel */}
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3">
          <h4 className="text-slate-700 mb-1">Drag States</h4>
          <p className="text-slate-600 text-xs">Items show visual feedback while being dragged</p>
        </div>
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3">
          <h4 className="text-slate-700 mb-1">Drop Zones</h4>
          <p className="text-slate-600 text-xs">Zones highlight when valid items are hovered</p>
        </div>
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3">
          <h4 className="text-slate-700 mb-1">Feedback</h4>
          <p className="text-slate-600 text-xs">Toast notifications confirm successful drops</p>
        </div>
      </div>
    </div>
  );
};