import React, { useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon,
  AlignLeft,
  Table as TableIcon,
  PenTool,
  Hash,
  Calendar,
  DollarSign,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Trash2,
  GripVertical,
  Square,
  Layers,
  Layout,
  LayoutGrid,
  Type,
  Heading1,
  List,
  Link,
  Circle,
  Box
} from 'lucide-react';

// Draggable element types
interface DraggableElement {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
  category: 'atom' | 'molecule';
}

interface TemplateElement {
  id: string;
  type: string;
  label: string;
  content: string;
  addedAt: number;
}

type SectionType = 'top' | 'main' | 'bottom' | 'left' | 'right';

interface SectionElements {
  top: TemplateElement[];
  main: TemplateElement[];
  bottom: TemplateElement[];
  left: TemplateElement[];
  right: TemplateElement[];
}

interface Template {
  id: string;
  name: string;
  layout: 'main' | 'top-main' | 'top-main-bottom' | 'left-main' | 'left-main-right' | 'top-left-main' | 'main-right' | 'main-bottom' | 'top-main-right' | 'top-left-main-right' | 'top-left-main-bottom' | 'top-main-right-bottom' | 'complete';
  icon: React.ReactNode;
  color: string;
  description: string;
  sections: SectionElements;
}

// Atoms - Basic building blocks
const ATOMS: DraggableElement[] = [
  { id: 'text', type: 'text', label: 'Text', icon: <Type className="h-4 w-4" />, category: 'atom' },
  { id: 'heading', type: 'heading', label: 'Heading', icon: <Heading1 className="h-4 w-4" />, category: 'atom' },
  { id: 'image', type: 'image', label: 'Image', icon: <ImageIcon className="h-4 w-4" />, category: 'atom' },
  { id: 'button', type: 'button', label: 'Button', icon: <Circle className="h-4 w-4" />, category: 'atom' },
  { id: 'link', type: 'link', label: 'Link', icon: <Link className="h-4 w-4" />, category: 'atom' },
  { id: 'icon', type: 'icon', label: 'Icon', icon: <Box className="h-4 w-4" />, category: 'atom' },
];

// Molecules - More complex components
const MOLECULES: DraggableElement[] = [
  { id: 'table', type: 'table', label: 'Table', icon: <TableIcon className="h-4 w-4" />, category: 'molecule' },
  { id: 'form', type: 'form', label: 'Form Group', icon: <List className="h-4 w-4" />, category: 'molecule' },
  { id: 'card', type: 'card', label: 'Card', icon: <Square className="h-4 w-4" />, category: 'molecule' },
  { id: 'signature', type: 'signature', label: 'Signature', icon: <PenTool className="h-4 w-4" />, category: 'molecule' },
  { id: 'date', type: 'date', label: 'Date Field', icon: <Calendar className="h-4 w-4" />, category: 'molecule' },
  { id: 'currency', type: 'currency', label: 'Currency', icon: <DollarSign className="h-4 w-4" />, category: 'molecule' },
  { id: 'contact', type: 'contact', label: 'Contact Info', icon: <User className="h-4 w-4" />, category: 'molecule' },
  { id: 'address', type: 'address', label: 'Address Block', icon: <MapPin className="h-4 w-4" />, category: 'molecule' },
];

const ELEMENT_TYPE = 'TEMPLATE_ELEMENT';

// Draggable element from left panel
const DraggableOption: React.FC<{ element: DraggableElement }> = ({ element }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ELEMENT_TYPE,
    item: { element },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`
        flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg cursor-move
        hover:border-blue-400 hover:shadow-md hover:bg-blue-50 transition-all duration-200
        ${isDragging ? 'opacity-50 rotate-2 scale-95' : 'opacity-100'}
      `}
    >
      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg text-blue-600">
        {element.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-700">{element.label}</p>
      </div>
      <GripVertical className="h-4 w-4 text-slate-400" />
    </div>
  );
};

// Get sample content for each element type
const getSampleContent = (type: string): string => {
  const samples: Record<string, string> = {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    heading: 'Section Heading',
    image: '[Image]',
    button: 'Click Me',
    link: 'Learn More →',
    icon: '★',
    table: 'Header 1 | Header 2\nValue 1 | Value 2',
    form: 'Name: _____\nEmail: _____',
    card: 'Card Title\nCard content goes here',
    signature: '___________________',
    date: new Date().toLocaleDateString(),
    currency: '$1,234.56',
    contact: 'John Doe\ncontact@example.com\n+1 (555) 123-4567',
    address: '123 Main St\nCity, ST 12345',
  };
  return samples[type] || 'Sample content';
};

// Render element based on type
const RenderElement: React.FC<{ element: TemplateElement; index: number }> = ({ element, index }) => {
  const renderContent = () => {
    switch (element.type) {
      case 'heading':
        return <h3 className="text-slate-800">{element.content}</h3>;
      case 'text':
        return <p className="text-sm text-slate-600 leading-relaxed">{element.content}</p>;
      case 'image':
        return (
          <div className="flex items-center justify-center h-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
            <ImageIcon className="h-5 w-5 text-slate-400" />
          </div>
        );
      case 'button':
        return (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
            {element.content}
          </button>
        );
      case 'link':
        return <a className="text-sm text-blue-600 hover:underline cursor-pointer">{element.content}</a>;
      case 'icon':
        return <div className="text-2xl text-slate-600">{element.content}</div>;
      case 'table':
        return (
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {element.content.split('\n').map((row, i) => (
                  <tr key={i} className={i === 0 ? 'bg-slate-100' : i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    {row.split('|').map((cell, j) => (
                      <td key={j} className="px-3 py-2 border-b border-slate-200">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'form':
        return (
          <div className="space-y-2 text-sm text-slate-600">
            {element.content.split('\n').map((line, i) => (
              <div key={i} className="flex items-center gap-2">
                {line}
              </div>
            ))}
          </div>
        );
      case 'card':
        return (
          <div className="border border-slate-300 rounded-lg p-4 bg-white shadow-sm">
            {element.content.split('\n').map((line, i) => (
              <p key={i} className={i === 0 ? 'text-sm text-slate-800' : 'text-sm text-slate-600'}>
                {line}
              </p>
            ))}
          </div>
        );
      case 'signature':
        return (
          <div className="py-2">
            <div className="border-b-2 border-slate-400 pb-1 text-sm text-slate-600">{element.content}</div>
            <p className="text-xs text-slate-500 mt-1">Signature</p>
          </div>
        );
      case 'date':
        return (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">{element.content}</span>
          </div>
        );
      case 'currency':
        return (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">{element.content}</span>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-1 text-sm text-slate-600">
            {element.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        );
      case 'address':
        return (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="space-y-1 text-slate-700">
              {element.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-slate-600">{element.content}</p>;
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
          {index + 1}
        </div>
      </div>
      <div className="p-3 bg-white/80 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
        {renderContent()}
      </div>
    </div>
  );
};

// Droppable Section Component
const DroppableSection: React.FC<{
  section: SectionType;
  elements: TemplateElement[];
  label: string;
  onDrop: (section: SectionType, element: DraggableElement) => void;
  minHeight?: string;
  bgColor?: string;
}> = ({ section, elements, label, onDrop, minHeight = 'min-h-[120px]', bgColor = 'bg-slate-50' }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ELEMENT_TYPE,
    drop: (item: { element: DraggableElement }) => {
      onDrop(section, item.element);
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
        ${minHeight} p-4 rounded-lg transition-all duration-200 relative
        ${isActive ? 'bg-green-100 border-2 border-green-500 border-dashed' : `${bgColor} border-2 border-dashed border-slate-300`}
      `}
    >
      <div className="text-xs text-slate-500 mb-2">{label}</div>
      {elements.length === 0 ? (
        <div className="flex items-center justify-center h-full text-xs text-slate-400">
          {isActive ? 'Drop here' : 'Drop elements here'}
        </div>
      ) : (
        <div className="space-y-3">
          {elements.map((element, index) => (
            <RenderElement key={element.id} element={element} index={index} />
          ))}
        </div>
      )}
      {isActive && (
        <div className="absolute inset-0 bg-green-500/10 rounded-lg pointer-events-none" />
      )}
    </div>
  );
};

// Template Layout Components
const MainOnlyTemplate: React.FC<{
  sections: SectionElements;
  onDrop: (section: SectionType, element: DraggableElement) => void;
}> = ({ sections, onDrop }) => (
  <div className="bg-white p-6">
    <DroppableSection
      section="main"
      elements={sections.main}
      label="Main Content Area"
      onDrop={onDrop}
      minHeight="min-h-[300px]"
      bgColor="bg-slate-50"
    />
  </div>
);

const TopMainTemplate: React.FC<{
  sections: SectionElements;
  onDrop: (section: SectionType, element: DraggableElement) => void;
}> = ({ sections, onDrop }) => (
  <div className="bg-white p-6 space-y-4">
    <DroppableSection
      section="top"
      elements={sections.top}
      label="Top / Header Section"
      onDrop={onDrop}
      minHeight="min-h-[100px]"
      bgColor="bg-slate-50"
    />
    <DroppableSection
      section="main"
      elements={sections.main}
      label="Main Content Area"
      onDrop={onDrop}
      minHeight="min-h-[200px]"
      bgColor="bg-slate-50"
    />
  </div>
);

const TopMainBottomTemplate: React.FC<{
  sections: SectionElements;
  onDrop: (section: SectionType, element: DraggableElement) => void;
}> = ({ sections, onDrop }) => (
  <div className="bg-white p-6 space-y-4">
    <DroppableSection
      section="top"
      elements={sections.top}
      label="Top / Header Section"
      onDrop={onDrop}
      minHeight="min-h-[80px]"
      bgColor="bg-slate-50"
    />
    <DroppableSection
      section="main"
      elements={sections.main}
      label="Main Content Area"
      onDrop={onDrop}
      minHeight="min-h-[180px]"
      bgColor="bg-slate-50"
    />
    <DroppableSection
      section="bottom"
      elements={sections.bottom}
      label="Bottom / Footer Section"
      onDrop={onDrop}
      minHeight="min-h-[80px]"
      bgColor="bg-slate-50"
    />
  </div>
);

const LeftMainTemplate: React.FC<{
  sections: SectionElements;
  onDrop: (section: SectionType, element: DraggableElement) => void;
}> = ({ sections, onDrop }) => (
  <div className="bg-white p-6 flex gap-4">
    <div className="w-48">
      <DroppableSection
        section="left"
        elements={sections.left}
        label="Left Sidebar"
        onDrop={onDrop}
        minHeight="min-h-[300px]"
        bgColor="bg-slate-50"
      />
    </div>
    <div className="flex-1">
      <DroppableSection
        section="main"
        elements={sections.main}
        label="Main Content Area"
        onDrop={onDrop}
        minHeight="min-h-[300px]"
        bgColor="bg-slate-50"
      />
    </div>
  </div>
);

const LeftMainRightTemplate: React.FC<{
  sections: SectionElements;
  onDrop: (section: SectionType, element: DraggableElement) => void;
}> = ({ sections, onDrop }) => (
  <div className="bg-white p-6 flex gap-4">
    <div className="w-40">
      <DroppableSection
        section="left"
        elements={sections.left}
        label="Left"
        onDrop={onDrop}
        minHeight="min-h-[300px]"
        bgColor="bg-slate-50"
      />
    </div>
    <div className="flex-1">
      <DroppableSection
        section="main"
        elements={sections.main}
        label="Main Content Area"
        onDrop={onDrop}
        minHeight="min-h-[300px]"
        bgColor="bg-slate-50"
      />
    </div>
    <div className="w-40">
      <DroppableSection
        section="right"
        elements={sections.right}
        label="Right"
        onDrop={onDrop}
        minHeight="min-h-[300px]"
        bgColor="bg-slate-50"
      />
    </div>
  </div>
);

const TopLeftMainTemplate: React.FC<{
  sections: SectionElements;
  onDrop: (section: SectionType, element: DraggableElement) => void;
}> = ({ sections, onDrop }) => (
  <div className="bg-white p-6 space-y-4">
    <DroppableSection
      section="top"
      elements={sections.top}
      label="Top / Header Section"
      onDrop={onDrop}
      minHeight="min-h-[80px]"
      bgColor="bg-slate-50"
    />
    <div className="flex gap-4">
      <div className="w-48">
        <DroppableSection
          section="left"
          elements={sections.left}
          label="Left Sidebar"
          onDrop={onDrop}
          minHeight="min-h-[220px]"
          bgColor="bg-slate-50"
        />
      </div>
      <div className="flex-1">
        <DroppableSection
          section="main"
          elements={sections.main}
          label="Main Content Area"
          onDrop={onDrop}
          minHeight="min-h-[220px]"
          bgColor="bg-slate-50"
        />
      </div>
    </div>
  </div>
);

const MainRightTemplate: React.FC<{
  sections: SectionElements;
  onDrop: (section: SectionType, element: DraggableElement) => void;
}> = ({ sections, onDrop }) => (
  <div className="bg-white p-6 flex gap-4">
    <div className="flex-1">
      <DroppableSection
        section="main"
        elements={sections.main}
        label="Main Content Area"
        onDrop={onDrop}
        minHeight="min-h-[300px]"
        bgColor="bg-slate-50"
      />
    </div>
    <div className="w-48">
      <DroppableSection
        section="right"
        elements={sections.right}
        label="Right Sidebar"
        onDrop={onDrop}
        minHeight="min-h-[300px]"
        bgColor="bg-slate-50"
      />
    </div>
  </div>
);

const MainBottomTemplate: React.FC<{
  sections: SectionElements;
  onDrop: (section: SectionType, element: DraggableElement) => void;
}> = ({ sections, onDrop }) => (
  <div className="bg-white p-6 space-y-4">
    <DroppableSection
      section="main"
      elements={sections.main}
      label="Main Content Area"
      onDrop={onDrop}
      minHeight="min-h-[200px]"
      bgColor="bg-slate-50"
    />
    <DroppableSection
      section="bottom"
      elements={sections.bottom}
      label="Bottom / Footer Section"
      onDrop={onDrop}
      minHeight="min-h-[100px]"
      bgColor="bg-slate-50"
    />
  </div>
);

const TopMainRightTemplate: React.FC<{
  sections: SectionElements;
  onDrop: (section: SectionType, element: DraggableElement) => void;
}> = ({ sections, onDrop }) => (
  <div className="bg-white p-6 space-y-4">
    <DroppableSection
      section="top"
      elements={sections.top}
      label="Top / Header Section"
      onDrop={onDrop}
      minHeight="min-h-[80px]"
      bgColor="bg-slate-50"
    />
    <div className="flex gap-4">
      <div className="flex-1">
        <DroppableSection
          section="main"
          elements={sections.main}
          label="Main Content Area"
          onDrop={onDrop}
          minHeight="min-h-[220px]"
          bgColor="bg-slate-50"
        />
      </div>
      <div className="w-48">
        <DroppableSection
          section="right"
          elements={sections.right}
          label="Right Sidebar"
          onDrop={onDrop}
          minHeight="min-h-[220px]"
          bgColor="bg-slate-50"
        />
      </div>
    </div>
  </div>
);

const TopLeftMainRightTemplate: React.FC<{
  sections: SectionElements;
  onDrop: (section: SectionType, element: DraggableElement) => void;
}> = ({ sections, onDrop }) => (
  <div className="bg-white p-6 space-y-4">
    <DroppableSection
      section="top"
      elements={sections.top}
      label="Top / Header Section"
      onDrop={onDrop}
      minHeight="min-h-[80px]"
      bgColor="bg-slate-50"
    />
    <div className="flex gap-4">
      <div className="w-40">
        <DroppableSection
          section="left"
          elements={sections.left}
          label="Left"
          onDrop={onDrop}
          minHeight="min-h-[220px]"
          bgColor="bg-slate-50"
        />
      </div>
      <div className="flex-1">
        <DroppableSection
          section="main"
          elements={sections.main}
          label="Main"
          onDrop={onDrop}
          minHeight="min-h-[220px]"
          bgColor="bg-slate-50"
        />
      </div>
      <div className="w-40">
        <DroppableSection
          section="right"
          elements={sections.right}
          label="Right"
          onDrop={onDrop}
          minHeight="min-h-[220px]"
          bgColor="bg-slate-50"
        />
      </div>
    </div>
  </div>
);

const TopLeftMainBottomTemplate: React.FC<{
  sections: SectionElements;
  onDrop: (section: SectionType, element: DraggableElement) => void;
}> = ({ sections, onDrop }) => (
  <div className="bg-white p-6 space-y-4">
    <DroppableSection
      section="top"
      elements={sections.top}
      label="Top / Header Section"
      onDrop={onDrop}
      minHeight="min-h-[70px]"
      bgColor="bg-slate-50"
    />
    <div className="flex gap-4">
      <div className="w-40">
        <DroppableSection
          section="left"
          elements={sections.left}
          label="Left"
          onDrop={onDrop}
          minHeight="min-h-[180px]"
          bgColor="bg-slate-50"
        />
      </div>
      <div className="flex-1">
        <DroppableSection
          section="main"
          elements={sections.main}
          label="Main"
          onDrop={onDrop}
          minHeight="min-h-[180px]"
          bgColor="bg-slate-50"
        />
      </div>
    </div>
    <DroppableSection
      section="bottom"
      elements={sections.bottom}
      label="Bottom / Footer Section"
      onDrop={onDrop}
      minHeight="min-h-[70px]"
      bgColor="bg-slate-50"
    />
  </div>
);

const TopMainRightBottomTemplate: React.FC<{
  sections: SectionElements;
  onDrop: (section: SectionType, element: DraggableElement) => void;
}> = ({ sections, onDrop }) => (
  <div className="bg-white p-6 space-y-4">
    <DroppableSection
      section="top"
      elements={sections.top}
      label="Top / Header Section"
      onDrop={onDrop}
      minHeight="min-h-[70px]"
      bgColor="bg-slate-50"
    />
    <div className="flex gap-4">
      <div className="flex-1">
        <DroppableSection
          section="main"
          elements={sections.main}
          label="Main"
          onDrop={onDrop}
          minHeight="min-h-[180px]"
          bgColor="bg-slate-50"
        />
      </div>
      <div className="w-40">
        <DroppableSection
          section="right"
          elements={sections.right}
          label="Right"
          onDrop={onDrop}
          minHeight="min-h-[180px]"
          bgColor="bg-slate-50"
        />
      </div>
    </div>
    <DroppableSection
      section="bottom"
      elements={sections.bottom}
      label="Bottom / Footer Section"
      onDrop={onDrop}
      minHeight="min-h-[70px]"
      bgColor="bg-slate-50"
    />
  </div>
);

const CompleteLayoutTemplate: React.FC<{
  sections: SectionElements;
  onDrop: (section: SectionType, element: DraggableElement) => void;
}> = ({ sections, onDrop }) => (
  <div className="bg-white p-6 space-y-4">
    <DroppableSection
      section="top"
      elements={sections.top}
      label="Top / Header Section"
      onDrop={onDrop}
      minHeight="min-h-[60px]"
      bgColor="bg-slate-50"
    />
    <div className="flex gap-4">
      <div className="w-32">
        <DroppableSection
          section="left"
          elements={sections.left}
          label="Left"
          onDrop={onDrop}
          minHeight="min-h-[150px]"
          bgColor="bg-slate-50"
        />
      </div>
      <div className="flex-1">
        <DroppableSection
          section="main"
          elements={sections.main}
          label="Main"
          onDrop={onDrop}
          minHeight="min-h-[150px]"
          bgColor="bg-slate-50"
        />
      </div>
      <div className="w-32">
        <DroppableSection
          section="right"
          elements={sections.right}
          label="Right"
          onDrop={onDrop}
          minHeight="min-h-[150px]"
          bgColor="bg-slate-50"
        />
      </div>
    </div>
    <DroppableSection
      section="bottom"
      elements={sections.bottom}
      label="Bottom / Footer Section"
      onDrop={onDrop}
      minHeight="min-h-[60px]"
      bgColor="bg-slate-50"
    />
  </div>
);

// Main Template Card Component
const TemplateCard: React.FC<{
  template: Template;
  onElementAdded: (templateId: string, section: SectionType, element: DraggableElement) => void;
  onClearTemplate: (templateId: string) => void;
}> = ({ template, onElementAdded, onClearTemplate }) => {
  const handleDrop = (section: SectionType, element: DraggableElement) => {
    onElementAdded(template.id, section, element);
    toast.success(`Added ${element.label} to ${section} section`);
  };

  const renderTemplate = () => {
    switch (template.layout) {
      case 'main':
        return <MainOnlyTemplate sections={template.sections} onDrop={handleDrop} />;
      case 'top-main':
        return <TopMainTemplate sections={template.sections} onDrop={handleDrop} />;
      case 'top-main-bottom':
        return <TopMainBottomTemplate sections={template.sections} onDrop={handleDrop} />;
      case 'left-main':
        return <LeftMainTemplate sections={template.sections} onDrop={handleDrop} />;
      case 'left-main-right':
        return <LeftMainRightTemplate sections={template.sections} onDrop={handleDrop} />;
      case 'top-left-main':
        return <TopLeftMainTemplate sections={template.sections} onDrop={handleDrop} />;
      case 'main-right':
        return <MainRightTemplate sections={template.sections} onDrop={handleDrop} />;
      case 'main-bottom':
        return <MainBottomTemplate sections={template.sections} onDrop={handleDrop} />;
      case 'top-main-right':
        return <TopMainRightTemplate sections={template.sections} onDrop={handleDrop} />;
      case 'top-left-main-right':
        return <TopLeftMainRightTemplate sections={template.sections} onDrop={handleDrop} />;
      case 'top-left-main-bottom':
        return <TopLeftMainBottomTemplate sections={template.sections} onDrop={handleDrop} />;
      case 'top-main-right-bottom':
        return <TopMainRightBottomTemplate sections={template.sections} onDrop={handleDrop} />;
      case 'complete':
        return <CompleteLayoutTemplate sections={template.sections} onDrop={handleDrop} />;
      default:
        return null;
    }
  };

  const totalElements = Object.values(template.sections).reduce((acc, section) => acc + section.length, 0);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className={`${template.color} border-b`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
              {template.icon}
            </div>
            <div>
              <CardTitle className="text-sm text-slate-800">{template.name}</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">{template.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white text-xs">
              {totalElements}
            </Badge>
            {totalElements > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClearTemplate(template.id)}
                className="h-7 w-7 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="p-4">
            {renderTemplate()}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface TemplateDragDropProps {
  layout?: 'main' | 'top-main' | 'top-main-bottom' | 'left-main' | 'left-main-right' | 'top-left-main' | 'main-right' | 'main-bottom' | 'top-main-right' | 'top-left-main-right' | 'top-left-main-bottom' | 'top-main-right-bottom' | 'complete';
}

export const TemplateDragDrop: React.FC<TemplateDragDropProps> = ({ layout }) => {
  const allTemplates: Template[] = [
    // SINGLE PANEL
    {
      id: 'main',
      name: 'Main Only',
      layout: 'main',
      icon: <Square className="h-5 w-5 text-blue-600" />,
      color: 'bg-blue-50',
      description: 'Single main content area',
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    },
    // TWO PANEL
    {
      id: 'top-main',
      name: 'Top + Main',
      layout: 'top-main',
      icon: <Layout className="h-5 w-5 text-green-600" />,
      color: 'bg-green-50',
      description: 'Header with main content',
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    },
    {
      id: 'left-main',
      name: 'Left + Main',
      layout: 'left-main',
      icon: <LayoutGrid className="h-5 w-5 text-orange-600" />,
      color: 'bg-orange-50',
      description: 'Sidebar with main content',
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    },
    {
      id: 'main-right',
      name: 'Main + Right',
      layout: 'main-right',
      icon: <LayoutGrid className="h-5 w-5 text-teal-600" />,
      color: 'bg-teal-50',
      description: 'Main content with right sidebar',
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    },
    {
      id: 'main-bottom',
      name: 'Main + Bottom',
      layout: 'main-bottom',
      icon: <Layout className="h-5 w-5 text-cyan-600" />,
      color: 'bg-cyan-50',
      description: 'Main content with footer',
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    },
    // THREE PANEL
    {
      id: 'top-main-right',
      name: 'Top + Main + Right',
      layout: 'top-main-right',
      icon: <LayoutGrid className="h-5 w-5 text-pink-600" />,
      color: 'bg-pink-50',
      description: 'Header, main, and right sidebar',
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    },
    {
      id: 'top-left-main',
      name: 'Top + Left + Main',
      layout: 'top-left-main',
      icon: <LayoutGrid className="h-5 w-5 text-indigo-600" />,
      color: 'bg-indigo-50',
      description: 'Header, left sidebar, and main',
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    },
    {
      id: 'left-main-right',
      name: 'Left + Main + Right',
      layout: 'left-main-right',
      icon: <LayoutGrid className="h-5 w-5 text-red-600" />,
      color: 'bg-red-50',
      description: 'Three column layout',
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    },
    {
      id: 'top-main-bottom',
      name: 'Top + Main + Bottom',
      layout: 'top-main-bottom',
      icon: <Layers className="h-5 w-5 text-purple-600" />,
      color: 'bg-purple-50',
      description: 'Header, main, and footer',
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    },
    // FOUR PANEL
    {
      id: 'top-left-main-right',
      name: 'Top + Left + Main + Right',
      layout: 'top-left-main-right',
      icon: <LayoutGrid className="h-5 w-5 text-amber-600" />,
      color: 'bg-amber-50',
      description: 'Header with three columns',
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    },
    {
      id: 'top-left-main-bottom',
      name: 'Top + Left + Main + Bottom',
      layout: 'top-left-main-bottom',
      icon: <Layers className="h-5 w-5 text-lime-600" />,
      color: 'bg-lime-50',
      description: 'Header, sidebar, main, and footer',
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    },
    {
      id: 'top-main-right-bottom',
      name: 'Top + Main + Right + Bottom',
      layout: 'top-main-right-bottom',
      icon: <Layers className="h-5 w-5 text-rose-600" />,
      color: 'bg-rose-50',
      description: 'Header, main, sidebar, and footer',
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    },
    // FIVE PANEL
    {
      id: 'complete',
      name: 'Complete Layout',
      layout: 'complete',
      icon: <LayoutGrid className="h-5 w-5 text-slate-600" />,
      color: 'bg-slate-50',
      description: 'All sections: top, left, right, bottom',
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    }
  ];

  const [templates, setTemplates] = useState<Template[]>(
    layout ? allTemplates.filter(t => t.layout === layout) : allTemplates
  );

  const handleElementAdded = useCallback((templateId: string, section: SectionType, element: DraggableElement) => {
    setTemplates(prev => prev.map(template => {
      if (template.id === templateId) {
        const newElement: TemplateElement = {
          id: `${Date.now()}-${Math.random()}`,
          type: element.type,
          label: element.label,
          content: getSampleContent(element.type),
          addedAt: Date.now()
        };
        return {
          ...template,
          sections: {
            ...template.sections,
            [section]: [...template.sections[section], newElement]
          }
        };
      }
      return template;
    }));
  }, []);

  const handleClearTemplate = useCallback((templateId: string) => {
    setTemplates(prev => prev.map(template => {
      if (template.id === templateId) {
        return {
          ...template,
          sections: { top: [], main: [], bottom: [], left: [], right: [] }
        };
      }
      return template;
    }));
    toast.success('Template cleared');
  }, []);

  const clearAllTemplates = () => {
    setTemplates(prev => prev.map(template => ({
      ...template,
      sections: { top: [], main: [], bottom: [], left: [], right: [] }
    })));
    toast.success('All templates cleared');
  };

  const totalElements = templates.reduce((acc, template) => 
    acc + Object.values(template.sections).reduce((sum, section) => sum + section.length, 0), 
    0
  );

  // Compact view for individual template
  return (
    <div className="flex gap-6">
      {/* Left Panel - Atoms and Molecules */}
      <div className="w-64 flex-shrink-0">
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b pb-3">
            <CardTitle className="text-sm text-slate-800">Components</CardTitle>
            <p className="text-xs text-slate-600 mt-1">Drag to template sections</p>
          </CardHeader>
          <CardContent className="p-3">
            <ScrollArea className="h-[480px]">
              <div className="space-y-4 pr-3">
                {/* Atoms */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-slate-200"></div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Atoms</span>
                    <div className="h-px flex-1 bg-slate-200"></div>
                  </div>
                  <div className="space-y-2">
                    {ATOMS.map(element => (
                      <DraggableOption key={element.id} element={element} />
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Molecules */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-slate-200"></div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Molecules</span>
                    <div className="h-px flex-1 bg-slate-200"></div>
                  </div>
                  <div className="space-y-2">
                    {MOLECULES.map(element => (
                      <DraggableOption key={element.id} element={element} />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Template */}
      <div className="flex-1">
        {templates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onElementAdded={handleElementAdded}
            onClearTemplate={handleClearTemplate}
          />
        ))}
      </div>
    </div>
  );
};
