import React, { useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { 
  GripVertical,
  Plus,
  RotateCcw,
  Check,
  Grid3x3,
  Target,
  User,
  Building,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Tag,
  AlertCircle
} from 'lucide-react';

interface FormField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'date' | 'currency';
  placeholder?: string;
  options?: string[];
}

interface Position {
  sectionIndex: number;
  fieldIndex: number;
}

interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

const ITEM_TYPE = 'FORM_FIELD';

const getFieldIcon = (type: string) => {
  switch (type) {
    case 'text': return <User className="h-4 w-4 text-slate-400" />;
    case 'email': return <Mail className="h-4 w-4 text-slate-400" />;
    case 'phone': return <Phone className="h-4 w-4 text-slate-400" />;
    case 'select': return <Tag className="h-4 w-4 text-slate-400" />;
    case 'date': return <Calendar className="h-4 w-4 text-slate-400" />;
    case 'currency': return <DollarSign className="h-4 w-4 text-slate-400" />;
    default: return <AlertCircle className="h-4 w-4 text-slate-400" />;
  }
};

const DraggableFormField: React.FC<{
  field: FormField;
  position: Position;
  moveField: (from: Position, to: Position) => void;
  updateField: (position: Position, value: string) => void;
}> = ({ field, position, moveField, updateField }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { field, position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { field: FormField; position: Position }) => {
      if (item.position.sectionIndex !== position.sectionIndex || 
          item.position.fieldIndex !== position.fieldIndex) {
        moveField(item.position, position);
        toast.success(`Moved ${item.field.label}`);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  const renderField = () => {
    switch (field.type) {
      case 'select':
        return (
          <Select value={field.value} onValueChange={(value) => updateField(position, value)}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            type={field.type}
            value={field.value}
            onChange={(e) => updateField(position, e.target.value)}
            placeholder={field.placeholder}
            className="w-full"
          />
        );
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        group relative transition-all duration-200
        ${isDragging ? 'opacity-50 z-20' : 'opacity-100'}
        ${isActive ? 'bg-blue-50 border-blue-200 rounded-lg p-2 -m-2' : ''}
      `}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-slate-400" />
          </div>
          <Label htmlFor={field.id} className="text-sm text-slate-700 flex items-center gap-2">
            {getFieldIcon(field.type)}
            {field.label}
          </Label>
        </div>
        {renderField()}
      </div>
      {isActive && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none" />
      )}
    </div>
  );
};

export const CellDragDrop: React.FC = () => {
  const [sections, setSections] = useState<FormSection[]>([
    {
      id: 'contact-info',
      title: 'Contact Information',
      fields: [
        {
          id: 'name',
          label: 'Full Name',
          value: 'Mr. Sanjeev Pathak',
          type: 'text',
          placeholder: 'Enter full name'
        },
        {
          id: 'company',
          label: 'Company',
          value: 'Jsk Inc',
          type: 'text',
          placeholder: 'Enter company name'
        },
        {
          id: 'phone',
          label: 'Phone Number',
          value: '(510) 455-1495',
          type: 'phone',
          placeholder: 'Enter phone number'
        },
        {
          id: 'email',
          label: 'Email Address',
          value: 'sale4sac@gmail.com',
          type: 'email',
          placeholder: 'Enter email address'
        }
      ]
    },
    {
      id: 'lead-details',
      title: 'Lead Details',
      fields: [
        {
          id: 'lead-source',
          label: 'Lead Source',
          value: 'BusinessLoans.com',
          type: 'text',
          placeholder: 'Enter lead source'
        },
        {
          id: 'lead-status',
          label: 'Lead Status',
          value: 'Attempted Contact',
          type: 'select',
          options: ['New Lead', 'Attempted Contact', 'Contacted', 'Qualified', 'Converted', 'Lost']
        },
        {
          id: 'lead-type',
          label: 'Lead Type',
          value: 'New Sales',
          type: 'select',
          options: ['New Sales', 'Existing Customer', 'Referral', 'Partner Lead']
        },
        {
          id: 'queue',
          label: 'Queue Assignment',
          value: 'Attempted Contact Queue',
          type: 'select',
          options: ['New Lead Queue', 'Attempted Contact Queue', 'Follow Up Queue', 'Qualified Queue']
        }
      ]
    },
    {
      id: 'campaign-tracking',
      title: 'Campaign & Tracking',
      fields: [
        {
          id: 'campaign',
          label: 'Campaign Name',
          value: 'BusinessLoans2024',
          type: 'text',
          placeholder: 'Enter campaign name'
        },
        {
          id: 'utm-source',
          label: 'UTM Source',
          value: 'Google Ads',
          type: 'text',
          placeholder: 'Enter UTM source'
        },
        {
          id: 'utm-medium',
          label: 'UTM Medium',
          value: 'business-loans',
          type: 'text',
          placeholder: 'Enter UTM medium'
        },
        {
          id: 'lead-value',
          label: 'Estimated Value',
          value: '$50,000',
          type: 'currency',
          placeholder: 'Enter estimated value'
        },
        {
          id: 'created-date',
          label: 'Created Date',
          value: '2024-01-15',
          type: 'date'
        }
      ]
    }
  ]);

  const moveField = useCallback((from: Position, to: Position) => {
    setSections(prev => {
      const newSections = [...prev];
      const sourceSection = newSections[from.sectionIndex];
      const targetSection = newSections[to.sectionIndex];
      
      // Remove field from source
      const [movedField] = sourceSection.fields.splice(from.fieldIndex, 1);
      
      // Add field to target
      targetSection.fields.splice(to.fieldIndex, 0, movedField);
      
      return newSections;
    });
  }, []);

  const updateField = useCallback((position: Position, value: string) => {
    setSections(prev => {
      const newSections = [...prev];
      newSections[position.sectionIndex].fields[position.fieldIndex].value = value;
      return newSections;
    });
  }, []);

  const addNewField = (sectionIndex: number) => {
    const fieldTypes: Array<'text' | 'email' | 'phone' | 'select' | 'date' | 'currency'> = 
      ['text', 'email', 'phone', 'select', 'date', 'currency'];
    const sampleLabels = {
      text: ['Additional Notes', 'Custom Field', 'Description', 'Comments'],
      email: ['Secondary Email', 'Work Email', 'Contact Email'],
      phone: ['Mobile Number', 'Work Phone', 'Fax Number'],
      select: ['Priority Level', 'Department', 'Region', 'Category'],
      date: ['Follow Up Date', 'Last Contact', 'Next Review'],
      currency: ['Budget', 'Deal Size', 'Revenue Potential'],
    };
    
    const type = fieldTypes[Math.floor(Math.random() * fieldTypes.length)];
    const labels = sampleLabels[type];
    const label = labels[Math.floor(Math.random() * labels.length)];
    
    const newField: FormField = {
      id: Date.now().toString(),
      label,
      value: '',
      type,
      placeholder: `Enter ${label.toLowerCase()}`,
      options: type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined
    };
    
    setSections(prev => {
      const newSections = [...prev];
      newSections[sectionIndex].fields.push(newField);
      return newSections;
    });
  };

  const resetForm = () => {
    setSections(prev => prev.map(section => ({
      ...section,
      fields: section.fields.map(field => ({ ...field, value: '' }))
    })));
    toast.success('Form reset');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Lead Information Form
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Customizable form layout - drag fields to reorganize sections
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetForm}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Badge variant="secondary" className="px-3 py-1">
                <Grid3x3 className="h-3 w-3 mr-1" />
                {sections.reduce((total, section) => total + section.fields.length, 0)} Fields
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm text-blue-800 mb-2">Form Customization:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Hover over any field to see the drag handle</li>
          <li>• Drag fields between sections to reorganize your form layout</li>
          <li>• Add new fields to any section using the + button</li>
          <li>• Form data is preserved when moving fields</li>
        </ul>
      </div>

      {/* Form Sections */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {sections.map((section, sectionIndex) => (
          <Card key={section.id} className="h-fit">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-700">
                  {section.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addNewField(sectionIndex)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.fields.map((field, fieldIndex) => (
                <DraggableFormField
                  key={field.id}
                  field={field}
                  position={{ sectionIndex, fieldIndex }}
                  moveField={moveField}
                  updateField={updateField}
                />
              ))}
              {section.fields.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Drop fields here</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Form layout can be customized by dragging fields between sections
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                Cancel
              </Button>
              <Button>
                <Check className="h-4 w-4 mr-1" />
                Save Lead
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};