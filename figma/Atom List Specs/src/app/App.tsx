import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  Heart, 
  Download,
  FileText,
  Folder,
  Image,
  Video,
  Music,
  Archive,
  Settings,
  Shield,
  Globe,
  Briefcase,
  GraduationCap,
  Trophy,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Users,
  Building,
  Package,
  Code,
  Database,
  Server,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react";

export default function App() {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPage, setContactsPage] = useState(1);
  const [filesPage, setFilesPage] = useState(1);
  
  // Hierarchy states
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'projects', 'team']));
  const [hierarchyPage, setHierarchyPage] = useState(1);
  
  // Property Grid Tree states
  const [expandedPropertyNodes, setExpandedPropertyNodes] = useState<Set<string>>(new Set(['general', 'display', 'data-source']));
  const [propertyValues, setPropertyValues] = useState<Record<string, any>>({
    description: '',
    defaultView: 'Datasheet',
    outputAllFields: 'No',
    topValues: 'All',
    uniqueValues: 'No',
    uniqueRecords: 'No',
    sourceDatabase: '(current)',
    sourceConnectStr: '',
    recordLocks: 'No Locks',
    recordsetType: 'Dynaset',
    odbcTimeout: 60,
    filter: '',
    orderBy: '',
    maxRecords: 0,
    orientation: 'Left-to-Right',
    subdatasheetName: '',
    linkChildFields: '',
    linkMasterFields: '',
    subdatasheetHeight: 0,
    subdatasheetExpanded: 'No',
    filterOnLoad: 'No',
    orderByOnLoad: 'Yes',
    backgroundColor: '#FFFFFF',
    foregroundColor: '#000000',
    fontSize: 11,
    fontWeight: 'Normal',
    allowEdits: 'Yes',
    allowAdditions: 'Yes',
    allowDeletions: 'Yes',
    dataEntry: 'No'
  });
  
  // Selection states
  const [selectedSingleItem, setSelectedSingleItem] = useState<string | null>(null);
  const [selectedMultipleItems, setSelectedMultipleItems] = useState<Set<string>>(new Set());
  
  // Income form states
  const [incomeData, setIncomeData] = useState([
    { id: 1, employment: 0, socialSecurity: 0, publicAssistance: 0, otherIncome: 0 },
    { id: 2, employment: 0, socialSecurity: 0, publicAssistance: 0, otherIncome: 0 },
    { id: 3, employment: 0, socialSecurity: 0, publicAssistance: 0, otherIncome: 0 }
  ]);
  
  // Active Task List Header state
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 21)); // December 21, 2024 (MON)
  
  // Sample data
  const simpleItems = [
    "Dashboard Overview",
    "User Management",
    "Settings Configuration", 
    "Reports & Analytics",
    "Security & Permissions",
    "Integration Setup",
    "Backup & Recovery",
    "System Monitoring",
    "API Documentation",
    "Help & Support"
  ];

  const contactsData = [
    { id: 1, name: "Alice Johnson", email: "alice.johnson@company.com", phone: "+1 (555) 123-4567", department: "Engineering" },
    { id: 2, name: "Bob Smith", email: "bob.smith@company.com", phone: "+1 (555) 234-5678", department: "Marketing" },
    { id: 3, name: "Carol Davis", email: "carol.davis@company.com", phone: "+1 (555) 345-6789", department: "Sales" },
    { id: 4, name: "David Wilson", email: "david.wilson@company.com", phone: "+1 (555) 456-7890", department: "HR" },
    { id: 5, name: "Eva Brown", email: "eva.brown@company.com", phone: "+1 (555) 567-8901", department: "Finance" },
    { id: 6, name: "Frank Miller", email: "frank.miller@company.com", phone: "+1 (555) 678-9012", department: "Operations" },
    { id: 7, name: "Grace Taylor", email: "grace.taylor@company.com", phone: "+1 (555) 789-0123", department: "Design" },
    { id: 8, name: "Henry Anderson", email: "henry.anderson@company.com", phone: "+1 (555) 890-1234", department: "Legal" }
  ];

  const filesData = [
    { id: 1, name: "Project Proposal.pdf", type: "document", size: "2.4 MB", modified: "2 hours ago", icon: FileText },
    { id: 2, name: "Marketing Assets", type: "folder", size: "45 files", modified: "1 day ago", icon: Folder },
    { id: 3, name: "Team Photo.jpg", type: "image", size: "3.2 MB", modified: "3 days ago", icon: Image },
    { id: 4, name: "Demo Video.mp4", type: "video", size: "124 MB", modified: "1 week ago", icon: Video },
    { id: 5, name: "Background Music.mp3", type: "audio", size: "8.7 MB", modified: "2 weeks ago", icon: Music },
    { id: 6, name: "Archive_2024.zip", type: "archive", size: "67 MB", modified: "1 month ago", icon: Archive },
    { id: 7, name: "Configuration.json", type: "document", size: "12 KB", modified: "2 months ago", icon: Settings },
    { id: 8, name: "Security Keys", type: "folder", size: "12 files", modified: "3 months ago", icon: Shield }
  ];

  const achievementsData = [
    { id: 1, title: "Project Completed", description: "Successfully delivered Q4 roadmap", icon: Trophy, date: "Dec 15, 2024" },
    { id: 2, title: "Team Excellence", description: "Recognized for outstanding collaboration", icon: Star, date: "Nov 28, 2024" },
    { id: 3, title: "Innovation Award", description: "Best new feature implementation", icon: GraduationCap, date: "Nov 10, 2024" },
    { id: 4, title: "Client Success", description: "Achieved 99.9% uptime milestone", icon: Briefcase, date: "Oct 22, 2024" },
    { id: 5, title: "Learning Badge", description: "Completed advanced certification", icon: GraduationCap, date: "Oct 5, 2024" },
    { id: 6, title: "Global Recognition", description: "Featured in industry publication", icon: Globe, date: "Sep 18, 2024" }
  ];

  // Hierarchical tree data
  const hierarchyData = {
    id: 'root',
    name: 'Organization',
    icon: Building,
    type: 'folder',
    children: [
      {
        id: 'team',
        name: 'Teams',
        icon: Users,
        type: 'folder',
        children: [
          { id: 'team-eng', name: 'Engineering Team', icon: Code, type: 'item', count: '12 members' },
          { id: 'team-design', name: 'Design Team', icon: Settings, type: 'item', count: '8 members' },
          { id: 'team-product', name: 'Product Team', icon: Package, type: 'item', count: '6 members' }
        ]
      },
      {
        id: 'projects',
        name: 'Projects',
        icon: Briefcase,
        type: 'folder',
        children: [
          {
            id: 'proj-alpha',
            name: 'Project Alpha',
            icon: Folder,
            type: 'folder',
            children: [
              { id: 'alpha-docs', name: 'Documentation', icon: FileText, type: 'item', count: '24 files' },
              { id: 'alpha-code', name: 'Source Code', icon: Code, type: 'item', count: '156 files' },
              { id: 'alpha-assets', name: 'Design Assets', icon: Image, type: 'item', count: '89 files' }
            ]
          },
          {
            id: 'proj-beta',
            name: 'Project Beta',
            icon: Folder,
            type: 'folder',
            children: [
              { id: 'beta-api', name: 'API Layer', icon: Server, type: 'item', count: '45 endpoints' },
              { id: 'beta-db', name: 'Database Schema', icon: Database, type: 'item', count: '23 tables' }
            ]
          }
        ]
      },
      {
        id: 'resources',
        name: 'Resources',
        icon: Archive,
        type: 'folder',
        children: [
          { id: 'res-templates', name: 'Templates', icon: FileText, type: 'item', count: '15 items' },
          { id: 'res-guidelines', name: 'Guidelines', icon: Settings, type: 'item', count: '8 documents' },
          { id: 'res-training', name: 'Training Materials', icon: GraduationCap, type: 'item', count: '32 resources' }
        ]
      },
      {
        id: 'archived',
        name: 'Archived Projects',
        icon: Archive,
        type: 'folder',
        children: [
          { id: 'arch-legacy', name: 'Legacy System', icon: Settings, type: 'item', count: 'Deprecated' },
          { id: 'arch-old', name: 'Old Platform', icon: Server, type: 'item', count: 'Archived' }
        ]
      }
    ]
  };

  // Plain theme styling
  const getCardStyles = () => {
    return `border-0 backdrop-blur-xl transition-all duration-300 bg-white/70 shadow-2xl`;
  };

  // Pagination helpers
  const itemsPerPage = 5;
  const totalPages = Math.ceil(simpleItems.length / itemsPerPage);
  const paginatedItems = simpleItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const contactsPerPage = 4;
  const totalContactPages = Math.ceil(contactsData.length / contactsPerPage);
  const paginatedContacts = contactsData.slice((contactsPage - 1) * contactsPerPage, contactsPage * contactsPerPage);

  const filesPerPage = 4;
  const totalFilePages = Math.ceil(filesData.length / filesPerPage);
  const paginatedFiles = filesData.slice((filesPage - 1) * filesPerPage, filesPage * filesPerPage);

  // Hierarchy helper functions
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const flattenHierarchy = (node: any, level: number = 0): any[] => {
    const result = [{ ...node, level }];
    
    if (node.children && expandedNodes.has(node.id)) {
      node.children.forEach((child: any) => {
        result.push(...flattenHierarchy(child, level + 1));
      });
    }
    
    return result;
  };

  const flattenedHierarchy = flattenHierarchy(hierarchyData);
  const hierarchyItemsPerPage = 8;
  const totalHierarchyPages = Math.ceil(flattenedHierarchy.length / hierarchyItemsPerPage);
  const paginatedHierarchy = flattenedHierarchy.slice(
    (hierarchyPage - 1) * hierarchyItemsPerPage,
    hierarchyPage * hierarchyItemsPerPage
  );

  // Income form helper functions
  const updateIncomeValue = (rowId: number, field: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setIncomeData(prev => 
      prev.map(row => 
        row.id === rowId 
          ? { ...row, [field]: numericValue }
          : row
      )
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateColumnTotal = (field: string) => {
    return incomeData.reduce((sum, row) => sum + row[field as keyof typeof row], 0);
  };

  const calculateTotalIncome = () => {
    return incomeData.reduce((sum, row) => 
      sum + row.employment + row.socialSecurity + row.publicAssistance + row.otherIncome, 0
    );
  };

  // Active Task List Header helper functions
  const generateTimelineDates = (startDate: Date, days: number) => {
    const dates = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatTimelineDate = (date: Date) => {
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayName = dayNames[date.getDay()];
    const dayNumber = date.getDate();
    return { dayName, dayNumber };
  };

  const timelineDates = generateTimelineDates(currentDate, 14); // 2 weeks

  // Property Grid Tree data structure with multiple levels
  const propertyGridData = [
    {
      id: 'general',
      name: 'General',
      type: 'group',
      children: [
        { id: 'description', name: 'Description', type: 'text', value: 'description' },
        { id: 'defaultView', name: 'Default View', type: 'select', value: 'defaultView', options: ['Datasheet', 'Single Form', 'Continuous Forms', 'Split Form'] },
        { id: 'outputAllFields', name: 'Output All Fields', type: 'select', value: 'outputAllFields', options: ['Yes', 'No'] },
        { id: 'topValues', name: 'Top Values', type: 'select', value: 'topValues', options: ['All', '5', '25', '100', '5%', '25%'] },
        { id: 'uniqueValues', name: 'Unique Values', type: 'select', value: 'uniqueValues', options: ['Yes', 'No'] },
        { id: 'uniqueRecords', name: 'Unique Records', type: 'select', value: 'uniqueRecords', options: ['Yes', 'No'] }
      ]
    },
    {
      id: 'data-source',
      name: 'Data Source',
      type: 'group',
      children: [
        { id: 'sourceDatabase', name: 'Source Database', type: 'text', value: 'sourceDatabase' },
        { id: 'sourceConnectStr', name: 'Source Connect Str', type: 'text', value: 'sourceConnectStr' },
        {
          id: 'connection-settings',
          name: 'Connection Settings',
          type: 'group',
          children: [
            { id: 'recordLocks', name: 'Record Locks', type: 'select', value: 'recordLocks', options: ['No Locks', 'All Records', 'Edited Record'] },
            { id: 'recordsetType', name: 'Recordset Type', type: 'select', value: 'recordsetType', options: ['Dynaset', 'Snapshot', 'Dynaset (Inconsistent Updates)'] },
            { id: 'odbcTimeout', name: 'ODBC Timeout', type: 'number', value: 'odbcTimeout' },
            {
              id: 'advanced-connection',
              name: 'Advanced',
              type: 'group',
              children: [
                { id: 'connectionString', name: 'Connection String', type: 'text', value: 'sourceConnectStr' },
                { id: 'retryAttempts', name: 'Retry Attempts', type: 'number', value: 'odbcTimeout' },
                { id: 'connectionTimeout', name: 'Connection Timeout', type: 'number', value: 'odbcTimeout' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'filter-sort',
      name: 'Filter & Sort',
      type: 'group',
      children: [
        { id: 'filter', name: 'Filter', type: 'text', value: 'filter' },
        { id: 'orderBy', name: 'Order By', type: 'text', value: 'orderBy' },
        { id: 'maxRecords', name: 'Max Records', type: 'number', value: 'maxRecords' },
        {
          id: 'load-options',
          name: 'Load Options',
          type: 'group',
          children: [
            { id: 'filterOnLoad', name: 'Filter On Load', type: 'select', value: 'filterOnLoad', options: ['Yes', 'No'] },
            { id: 'orderByOnLoad', name: 'Order By On Load', type: 'select', value: 'orderByOnLoad', options: ['Yes', 'No'] }
          ]
        }
      ]
    },
    {
      id: 'display',
      name: 'Display Settings',
      type: 'group',
      children: [
        { id: 'orientation', name: 'Orientation', type: 'select', value: 'orientation', options: ['Left-to-Right', 'Right-to-Left'] },
        {
          id: 'subdatasheet',
          name: 'Subdatasheet',
          type: 'group',
          children: [
            { id: 'subdatasheetName', name: 'Subdatasheet Name', type: 'text', value: 'subdatasheetName' },
            { id: 'subdatasheetHeight', name: 'Subdatasheet Height', type: 'number', value: 'subdatasheetHeight' },
            { id: 'subdatasheetExpanded', name: 'Subdatasheet Expanded', type: 'select', value: 'subdatasheetExpanded', options: ['Yes', 'No'] },
            {
              id: 'link-fields',
              name: 'Link Fields',
              type: 'group',
              children: [
                { id: 'linkChildFields', name: 'Link Child Fields', type: 'text', value: 'linkChildFields' },
                { id: 'linkMasterFields', name: 'Link Master Fields', type: 'text', value: 'linkMasterFields' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'formatting',
      name: 'Formatting',
      type: 'group',
      children: [
        {
          id: 'colors',
          name: 'Colors',
          type: 'group',
          children: [
            { id: 'backgroundColor', name: 'Background Color', type: 'text', value: 'backgroundColor' },
            { id: 'foregroundColor', name: 'Foreground Color', type: 'text', value: 'foregroundColor' }
          ]
        },
        {
          id: 'typography',
          name: 'Typography',
          type: 'group',
          children: [
            { id: 'fontSize', name: 'Font Size', type: 'number', value: 'fontSize' },
            { id: 'fontWeight', name: 'Font Weight', type: 'select', value: 'fontWeight', options: ['Normal', 'Bold', 'Light'] }
          ]
        }
      ]
    },
    {
      id: 'data-entry',
      name: 'Data Entry',
      type: 'group',
      children: [
        { id: 'allowEdits', name: 'Allow Edits', type: 'select', value: 'allowEdits', options: ['Yes', 'No'] },
        { id: 'allowAdditions', name: 'Allow Additions', type: 'select', value: 'allowAdditions', options: ['Yes', 'No'] },
        { id: 'allowDeletions', name: 'Allow Deletions', type: 'select', value: 'allowDeletions', options: ['Yes', 'No'] },
        { id: 'dataEntry', name: 'Data Entry', type: 'select', value: 'dataEntry', options: ['Yes', 'No'] }
      ]
    }
  ];

  // Property Grid helper functions
  const togglePropertyNode = (nodeId: string) => {
    setExpandedPropertyNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const updatePropertyValue = (propertyKey: string, value: any) => {
    setPropertyValues(prev => ({
      ...prev,
      [propertyKey]: value
    }));
  };

  // Recursively collect all group IDs
  const getAllGroupIds = (items: any[]): string[] => {
    let ids: string[] = [];
    items.forEach(item => {
      if (item.type === 'group') {
        ids.push(item.id);
        if (item.children) {
          ids = ids.concat(getAllGroupIds(item.children));
        }
      }
    });
    return ids;
  };

  const renderPropertyInput = (property: any) => {
    const value = propertyValues[property.value];
    
    switch (property.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => updatePropertyValue(property.value, e.target.value)}
            className="h-8 text-sm"
            placeholder="Enter value..."
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={value || 0}
            onChange={(e) => updatePropertyValue(property.value, parseFloat(e.target.value) || 0)}
            className="h-8 text-sm"
          />
        );
      
      case 'select':
        return (
          <Select
            value={value || property.options[0]}
            onValueChange={(val) => updatePropertyValue(property.value, val)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {property.options.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => updatePropertyValue(property.value, e.target.value)}
            className="h-8 text-sm"
          />
        );
      
      default:
        return <span className="text-sm text-slate-600">{value}</span>;
    }
  };

  // Recursive rendering function for nested property groups
  const renderPropertyItem = (item: any, level: number = 0): React.ReactNode => {
    if (item.type === 'group') {
      const isExpanded = expandedPropertyNodes.has(item.id);
      
      return (
        <div key={item.id} className="border-b border-slate-200 last:border-b-0">
          {/* Group Header */}
          <div
            tabIndex={0}
            className="grid grid-cols-2 bg-slate-100/50 hover:bg-slate-100 cursor-pointer transition-colors"
            onClick={() => togglePropertyNode(item.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePropertyNode(item.id);
              }
            }}
            role="button"
            aria-expanded={isExpanded}
          >
            <div 
              className="col-span-2 px-3 py-2 flex items-center gap-2"
              style={{ paddingLeft: `${level * 20 + 12}px` }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-600" />
              )}
              <span className={`${level === 0 ? 'font-semibold' : 'font-medium'} text-slate-700`}>
                {item.name}
              </span>
            </div>
          </div>
          
          {/* Group Children */}
          {isExpanded && item.children && (
            <div>
              {item.children.map((child: any) => renderPropertyItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    } else {
      // Property row
      return (
        <div
          key={item.id}
          className="grid grid-cols-2 border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50 transition-colors"
          role="row"
        >
          {/* Property Name */}
          <div 
            className="px-3 py-2 border-r border-slate-200 flex items-center"
            style={{ paddingLeft: `${level * 20 + 12}px` }}
          >
            <span className="text-sm text-slate-700">{item.name}</span>
          </div>
          
          {/* Property Value Input */}
          <div className="px-3 py-2 flex items-center">
            {renderPropertyInput(item)}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen p-6 transition-all duration-500 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl tracking-tight transition-colors duration-300 text-slate-900">
              Atom List
            </h1>
            <h2 className="text-2xl transition-colors duration-300 text-slate-600">
              finAtomList: Design Specifications for LWC Component
            </h2>
          </div>
          <p className="text-lg max-w-3xl mx-auto transition-colors duration-300 text-slate-600">
            A comprehensive showcase of modern list patterns with single text items, multi-column layouts, 
            icon-led interfaces, pagination support, and complete keyboard navigation hierarchy.
          </p>
        </div>

        {/* Hierarchical Tree List */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">
              Hierarchical Tree List
            </CardTitle>
            <CardDescription className="text-slate-600">
              Expandable tree structure with nested indentation, keyboard navigation, and proper hierarchy management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              {paginatedHierarchy.map((item, index) => {
                const IconComponent = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedNodes.has(item.id);
                const isFolder = item.type === 'folder';
                
                return (
                  <div
                    key={item.id}
                    tabIndex={0}
                    className="group relative flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-100/50 transition-all duration-200 cursor-pointer"
                    style={{ paddingLeft: `${item.level * 24 + 8}px` }}
                    role="treeitem"
                    aria-expanded={hasChildren ? isExpanded : undefined}
                    aria-level={item.level + 1}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && hasChildren) {
                        e.preventDefault();
                        toggleNode(item.id);
                      } else if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
                        e.preventDefault();
                        toggleNode(item.id);
                      } else if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
                        e.preventDefault();
                        toggleNode(item.id);
                      }
                    }}
                    onClick={() => hasChildren && toggleNode(item.id)}
                  >
                    {/* Connection Lines */}
                    {item.level > 0 && (
                      <>
                        {/* Vertical line from parent */}
                        <div
                          className="absolute w-px bg-slate-300"
                          style={{
                            left: `${item.level * 24 - 8}px`,
                            top: '0',
                            bottom: '50%'
                          }}
                        />
                        {/* Horizontal line to item */}
                        <div
                          className="absolute h-px bg-slate-300"
                          style={{
                            left: `${item.level * 24 - 8}px`,
                            top: '50%',
                            width: '16px'
                          }}
                        />
                      </>
                    )}

                    {/* Expand/Collapse Button */}
                    {hasChildren ? (
                      <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        {isExpanded ? (
                          <ChevronDown className="w-3 h-3 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-slate-500" />
                        )}
                      </div>
                    ) : (
                      <div className="w-4 h-4" />
                    )}

                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {isFolder && hasChildren ? (
                        isExpanded ? (
                          <FolderOpen className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Folder className="w-4 h-4 text-blue-500" />
                        )
                      ) : (
                        <IconComponent className={`w-4 h-4 ${
                          item.type === 'folder' ? 'text-blue-500' : 
                          item.icon === Code ? 'text-green-500' :
                          item.icon === Database ? 'text-purple-500' :
                          item.icon === Server ? 'text-orange-500' :
                          'text-slate-500'
                        }`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div className="min-w-0">
                        <div className={`truncate transition-colors duration-200 ${
                          item.type === 'folder' ? 'font-medium text-slate-700' : 'text-slate-600'
                        } group-hover:text-slate-800`}>
                          {item.name}
                        </div>
                      </div>
                      
                      {/* Count/Meta Information */}
                      {item.count && (
                        <div className="flex-shrink-0 ml-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.count}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination for Hierarchy */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {((hierarchyPage - 1) * hierarchyItemsPerPage) + 1} to {Math.min(hierarchyPage * hierarchyItemsPerPage, flattenedHierarchy.length)} of {flattenedHierarchy.length} items
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (hierarchyPage > 1) setHierarchyPage(hierarchyPage - 1);
                      }}
                      className={hierarchyPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalHierarchyPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setHierarchyPage(page);
                        }}
                        isActive={hierarchyPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (hierarchyPage < totalHierarchyPages) setHierarchyPage(hierarchyPage + 1);
                      }}
                      className={hierarchyPage === totalHierarchyPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

            {/* Hierarchy Controls */}
            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Expand all nodes
                  const allNodeIds = new Set(['root']);
                  const addChildren = (node: any) => {
                    if (node.children) {
                      node.children.forEach((child: any) => {
                        allNodeIds.add(child.id);
                        addChildren(child);
                      });
                    }
                  };
                  addChildren(hierarchyData);
                  setExpandedNodes(allNodeIds);
                }}
              >
                Expand All
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setExpandedNodes(new Set(['root']))}
              >
                Collapse All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Property Grid Tree List */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">
              Property Grid Tree List
            </CardTitle>
            <CardDescription className="text-slate-600">
              Multi-level hierarchical property grid with two-column layout featuring nested groups and various input types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Property Grid Container */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              {propertyGridData.map((item) => renderPropertyItem(item, 0))}
            </div>

            {/* Property Grid Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const allGroupIds = new Set(getAllGroupIds(propertyGridData));
                    setExpandedPropertyNodes(allGroupIds);
                  }}
                >
                  Expand All Groups
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setExpandedPropertyNodes(new Set())}
                >
                  Collapse All Groups
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    console.log('Current property values:', propertyValues);
                  }}
                >
                  Log Values
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => {
                    console.log('Saving properties...', propertyValues);
                    // Save logic here
                  }}
                >
                  Apply Changes
                </Button>
              </div>
            </div>

            {/* Property Grid Information */}
            <div className="mt-6 space-y-4">
              <h3 className="text-blue-600 border-b border-blue-200 pb-2">
                Property Grid Features
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-slate-50/50 border-slate-200">
                  <h4 className="font-medium mb-2 text-slate-700">
                    Grid Layout
                  </h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Two-column property-value layout</li>
                    <li>• Multi-level hierarchical grouping</li>
                    <li>• Nested groups with independent expand/collapse</li>
                    <li>• Progressive indentation for each level</li>
                    <li>• Clean borders separating properties</li>
                    <li>• Hover states for visual feedback</li>
                    <li>• Responsive grid sizing</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border bg-slate-50/50 border-slate-200">
                  <h4 className="font-medium mb-2 text-slate-700">
                    Input Types
                  </h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• <strong>Text inputs</strong> - Free-form text entry</li>
                    <li>• <strong>Number inputs</strong> - Numeric values with validation</li>
                    <li>• <strong>Select dropdowns</strong> - Predefined option lists</li>
                    <li>• <strong>Date pickers</strong> - Calendar-based date selection</li>
                    <li>• Real-time value updates</li>
                    <li>• Proper input validation and formatting</li>
                  </ul>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-slate-50/50 border-slate-200">
                  <h4 className="font-medium mb-2 text-slate-700">
                    Navigation & Interaction
                  </h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Click group headers to expand/collapse</li>
                    <li>• Tab through all input fields</li>
                    <li>• Enter/Space to toggle groups</li>
                    <li>• Arrow keys in select dropdowns</li>
                    <li>• Focus indicators on all interactive elements</li>
                    <li>• Bulk expand/collapse controls</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border bg-slate-50/50 border-slate-200">
                  <h4 className="font-medium mb-2 text-slate-700">
                    Use Cases
                  </h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Settings and configuration panels</li>
                    <li>• Property inspectors (like design tools)</li>
                    <li>• Database field editors</li>
                    <li>• Form builders and metadata editors</li>
                    <li>• Advanced preference screens</li>
                    <li>• Admin configuration interfaces</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-blue-50/50 border-blue-200">
                <h4 className="font-medium mb-2 text-blue-700">
                  Property Grid Pattern
                </h4>
                <p className="text-sm text-blue-600 mb-2">
                  This pattern is commonly used in property inspectors, settings panels, and configuration interfaces:
                </p>
                <ul className="text-sm space-y-1 text-blue-600">
                  <li>• Hierarchical organization keeps related properties grouped together</li>
                  <li>• Two-column layout provides clear property name and value separation</li>
                  <li>• Multiple input types support different data types and constraints</li>
                  <li>• Expand/collapse functionality reduces visual clutter for large property sets</li>
                  <li>• Keyboard navigation ensures accessibility and power-user efficiency</li>
                </ul>
              </div>
            </div>

            {/* Example Property Values Display */}
            <div className="mt-6 space-y-2">
              <h3 className="text-blue-600 border-b border-blue-200 pb-2">
                Current Configuration Preview
              </h3>
              <div className="p-4 rounded-lg border bg-slate-50/50 border-slate-200">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-slate-700">Default View:</span>{' '}
                    <span className="text-slate-600">{propertyValues.defaultView}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Record Locks:</span>{' '}
                    <span className="text-slate-600">{propertyValues.recordLocks}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Recordset Type:</span>{' '}
                    <span className="text-slate-600">{propertyValues.recordsetType}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Max Records:</span>{' '}
                    <span className="text-slate-600">{propertyValues.maxRecords}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Orientation:</span>{' '}
                    <span className="text-slate-600">{propertyValues.orientation}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Font Size:</span>{' '}
                    <span className="text-slate-600">{propertyValues.fontSize}px</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Simple Text List */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">
                Simple Text List
              </CardTitle>
              <CardDescription className="text-slate-600">
                Basic vertical list of text items with pagination and keyboard navigation support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {paginatedItems.map((item, index) => (
                  <div
                    key={`simple-${(currentPage - 1) * itemsPerPage + index}`}
                    tabIndex={0}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-100/50 transition-all duration-200 cursor-pointer"
                    role="listitem"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        console.log(`Selected: ${item}`);
                      }
                    }}
                  >
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>

          {/* Icon-Led List */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">
                Icon-Led List
              </CardTitle>
              <CardDescription className="text-slate-600">
                List items with leading icons for enhanced visual hierarchy and recognition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {achievementsData.slice(0, 5).map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      tabIndex={0}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-100/50 transition-all duration-200 cursor-pointer"
                      role="listitem"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          console.log(`Selected: ${achievement.title}`);
                        }
                      }}
                    >
                      <div className="flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-700 truncate">{achievement.title}</div>
                        <div className="text-sm text-slate-500 truncate">{achievement.description}</div>
                      </div>
                      <div className="flex-shrink-0 text-xs text-slate-400">
                        {achievement.date}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Single Selection List */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">
                Single Selection List
              </CardTitle>
              <CardDescription className="text-slate-600">
                List where only one item can be selected at a time with radio-style behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[
                  { id: 'theme-light', label: 'Light Theme', description: 'Clean, bright interface' },
                  { id: 'theme-dark', label: 'Dark Theme', description: 'Easy on the eyes' },
                  { id: 'theme-auto', label: 'Auto Theme', description: 'Follows system preference' },
                  { id: 'theme-high-contrast', label: 'High Contrast', description: 'Enhanced accessibility' },
                  { id: 'theme-custom', label: 'Custom Theme', description: 'Personalized colors' }
                ].map((option, index) => (
                  <div
                    key={option.id}
                    tabIndex={0}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      selectedSingleItem === option.id
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    }`}
                    role="radio"
                    aria-checked={selectedSingleItem === option.id}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedSingleItem(option.id);
                      }
                    }}
                    onClick={() => setSelectedSingleItem(option.id)}
                  >
                    {/* Radio Button Indicator */}
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedSingleItem === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300'
                    }`}>
                      {selectedSingleItem === option.id && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate transition-colors ${
                        selectedSingleItem === option.id ? 'text-blue-700' : 'text-slate-700'
                      }`}>
                        {option.label}
                      </div>
                      <div className="text-sm text-slate-500 truncate">{option.description}</div>
                    </div>
                    
                    {/* Selection Indicator */}
                    {selectedSingleItem === option.id && (
                      <div className="flex-shrink-0">
                        <Badge variant="default" className="text-xs">
                          Selected
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  Selected: {selectedSingleItem ? selectedSingleItem.replace('theme-', '').replace('-', ' ') : 'None'}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedSingleItem(null)}
                  disabled={!selectedSingleItem}
                >
                  Clear Selection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Multiple Selection List */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">
                Multiple Selection List
              </CardTitle>
              <CardDescription className="text-slate-600">
                List where multiple items can be selected simultaneously with checkbox behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[
                  { id: 'feature-notifications', label: 'Push Notifications', description: 'Real-time alerts and updates' },
                  { id: 'feature-analytics', label: 'Advanced Analytics', description: 'Detailed usage statistics' },
                  { id: 'feature-collaboration', label: 'Team Collaboration', description: 'Share and work together' },
                  { id: 'feature-api', label: 'API Access', description: 'Integrate with external services' },
                  { id: 'feature-security', label: 'Enhanced Security', description: 'Two-factor authentication' },
                  { id: 'feature-support', label: 'Priority Support', description: '24/7 dedicated assistance' }
                ].map((feature, index) => {
                  const isSelected = selectedMultipleItems.has(feature.id);
                  return (
                    <div
                      key={feature.id}
                      tabIndex={0}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      }`}
                      role="checkbox"
                      aria-checked={isSelected}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          const newSelected = new Set(selectedMultipleItems);
                          if (isSelected) {
                            newSelected.delete(feature.id);
                          } else {
                            newSelected.add(feature.id);
                          }
                          setSelectedMultipleItems(newSelected);
                        }
                      }}
                      onClick={() => {
                        const newSelected = new Set(selectedMultipleItems);
                        if (isSelected) {
                          newSelected.delete(feature.id);
                        } else {
                          newSelected.add(feature.id);
                        }
                        setSelectedMultipleItems(newSelected);
                      }}
                    >
                      {/* Checkbox Indicator */}
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate transition-colors ${
                          isSelected ? 'text-blue-700' : 'text-slate-700'
                        }`}>
                          {feature.label}
                        </div>
                        <div className="text-sm text-slate-500 truncate">{feature.description}</div>
                      </div>
                      
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="flex-shrink-0">
                          <Badge variant="default" className="text-xs">
                            Selected
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  Selected: {selectedMultipleItems.size} of 6 features
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const allIds = new Set([
                        'feature-notifications', 'feature-analytics', 'feature-collaboration',
                        'feature-api', 'feature-security', 'feature-support'
                      ]);
                      setSelectedMultipleItems(allIds);
                    }}
                  >
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedMultipleItems(new Set())}
                    disabled={selectedMultipleItems.size === 0}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Multi-Column Contact List */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">
              Multi-Column Contact List
            </CardTitle>
            <CardDescription className="text-slate-600">
              Table-style list with multiple data columns and comprehensive pagination controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-slate-600 border-b border-slate-200">
                <div className="col-span-3">Name</div>
                <div className="col-span-4">Email</div>
                <div className="col-span-3">Phone</div>
                <div className="col-span-2">Department</div>
              </div>
              
              {/* Data Rows */}
              {paginatedContacts.map((contact, index) => (
                <div
                  key={contact.id}
                  tabIndex={0}
                  className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-100/50 transition-all duration-200 cursor-pointer"
                  role="listitem"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      console.log(`Selected contact: ${contact.name}`);
                    }
                  }}
                >
                  <div className="col-span-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-700 truncate">{contact.name}</span>
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 truncate">{contact.email}</span>
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 truncate">{contact.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="secondary" className="text-xs">
                      {contact.department}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {((contactsPage - 1) * contactsPerPage) + 1} to {Math.min(contactsPage * contactsPerPage, contactsData.length)} of {contactsData.length} contacts
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (contactsPage > 1) setContactsPage(contactsPage - 1);
                      }}
                      className={contactsPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalContactPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setContactsPage(page);
                        }}
                        isActive={contactsPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (contactsPage < totalContactPages) setContactsPage(contactsPage + 1);
                      }}
                      className={contactsPage === totalContactPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* File Browser List */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">
                File Browser List
              </CardTitle>
              <CardDescription className="text-slate-600">
                Icon-rich file listing with metadata and type-specific styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {paginatedFiles.map((file, index) => {
                  const IconComponent = file.icon;
                  return (
                    <div
                      key={file.id}
                      tabIndex={0}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-100/50 transition-all duration-200 cursor-pointer"
                      role="listitem"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          console.log(`Selected file: ${file.name}`);
                        }
                      }}
                    >
                      <div className="flex-shrink-0">
                        <IconComponent className={`w-5 h-5 ${
                          file.type === 'folder' ? 'text-blue-500' :
                          file.type === 'image' ? 'text-green-500' :
                          file.type === 'video' ? 'text-purple-500' :
                          file.type === 'audio' ? 'text-orange-500' :
                          'text-slate-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-700 truncate">{file.name}</div>
                        <div className="text-xs text-slate-500">{file.size} • {file.modified}</div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (filesPage > 1) setFilesPage(filesPage - 1);
                      }}
                      className={filesPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalFilePages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setFilesPage(page);
                        }}
                        isActive={filesPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (filesPage < totalFilePages) setFilesPage(filesPage + 1);
                      }}
                      className={filesPage === totalFilePages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>

          {/* Interactive Action List */}
          <Card className={getCardStyles()}>
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">
                Interactive Action List
              </CardTitle>
              <CardDescription className="text-slate-600">
                Action-rich list items with buttons, badges, and complex interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { id: 1, title: "System Backup", status: "Completed", time: "2:30 PM", icon: Shield, actionLabel: "View Log" },
                  { id: 2, title: "Data Sync", status: "In Progress", time: "3:15 PM", icon: Globe, actionLabel: "Monitor" },
                  { id: 3, title: "Report Generation", status: "Pending", time: "4:00 PM", icon: FileText, actionLabel: "Start" },
                  { id: 4, title: "User Import", status: "Failed", time: "4:45 PM", icon: User, actionLabel: "Retry" },
                  { id: 5, title: "Email Campaign", status: "Scheduled", time: "5:30 PM", icon: Mail, actionLabel: "Edit" }
                ].map((item, index) => (
                  <div
                    key={item.id}
                    tabIndex={0}
                    className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-100/50 transition-all duration-200"
                    role="listitem"
                  >
                    <div className="flex-shrink-0">
                      <item.icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-700">{item.title}</div>
                      <div className="text-sm text-slate-500">{item.time}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge 
                        variant={
                          item.status === 'Completed' ? 'default' :
                          item.status === 'In Progress' ? 'secondary' :
                          item.status === 'Failed' ? 'destructive' :
                          'outline'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex-shrink-0">
                      <Button variant="outline" size="sm">
                        {item.actionLabel}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Task List Header */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">
              Active Task List Header
            </CardTitle>
            <CardDescription className="text-slate-600">
              Single-row timeline header for Gantt charts with date navigation and responsive date columns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Timeline Header */}
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Active Task List Header Row */}
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-800 text-white">
                  {/* Title Column */}
                  <div className="flex-shrink-0 w-48 px-4 py-3 border-r border-slate-600">
                    <div className="font-semibold">Active Task List</div>
                  </div>
                  
                  {/* Date Columns */}
                  <div className="flex-1 flex">
                    {timelineDates.map((date, index) => {
                      const { dayName, dayNumber } = formatTimelineDate(date);
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      const isToday = date.toDateString() === new Date().toDateString();
                      
                      return (
                        <div
                          key={index}
                          className={`flex-1 min-w-[60px] px-2 py-3 text-center border-r border-slate-600 last:border-r-0 transition-colors ${
                            isToday ? 'bg-blue-600' : isWeekend ? 'bg-slate-700' : 'bg-slate-800'
                          } hover:bg-slate-700`}
                          title={`${dayName} ${dayNumber} - ${date.toLocaleDateString()}`}
                        >
                          <div className="text-xs font-medium opacity-90">{dayName}</div>
                          <div className={`text-sm font-bold ${isToday ? 'text-white' : ''}`}>
                            {dayNumber}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Header Navigation Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setDate(currentDate.getDate() - 7);
                    setCurrentDate(newDate);
                  }}
                >
                  ← Previous Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentDate(new Date()); // Jump to today
                  }}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setDate(currentDate.getDate() + 7);
                    setCurrentDate(newDate);
                  }}
                >
                  Next Week →
                </Button>
              </div>
              
              <div className="text-sm text-slate-600">
                {timelineDates[0].toLocaleDateString()} - {timelineDates[timelineDates.length - 1].toLocaleDateString()}
              </div>
            </div>

            {/* Alternative Header Variations */}
            <div className="space-y-4">
              <h3 className="text-blue-600 border-b border-blue-200 pb-2">
                Alternative Header Styles
              </h3>
              
              <div className="space-y-3">
                {/* Minimal Header */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-700">Minimal Style</h4>
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px] flex items-center border border-slate-200 rounded-md bg-slate-50">
                      <div className="w-32 px-3 py-2 text-sm font-medium text-slate-700 border-r border-slate-200">
                        Tasks
                      </div>
                      <div className="flex-1 flex">
                        {timelineDates.slice(0, 7).map((date, index) => {
                          const { dayName, dayNumber } = formatTimelineDate(date);
                          return (
                            <div
                              key={index}
                              className="flex-1 px-2 py-2 text-center text-xs border-r border-slate-200 last:border-r-0"
                            >
                              <div className="text-slate-500">{dayName}</div>
                              <div className="font-medium text-slate-700">{dayNumber}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colored Header */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-700">Colored Theme</h4>
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px] flex items-center border border-blue-300 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <div className="w-32 px-3 py-2 text-sm font-semibold border-r border-blue-500">
                        Project Timeline
                      </div>
                      <div className="flex-1 flex">
                        {timelineDates.slice(0, 7).map((date, index) => {
                          const { dayName, dayNumber } = formatTimelineDate(date);
                          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                          return (
                            <div
                              key={index}
                              className={`flex-1 px-2 py-2 text-center text-xs border-r border-blue-500 last:border-r-0 ${
                                isWeekend ? 'bg-blue-800/30' : ''
                              }`}
                            >
                              <div className="text-blue-100">{dayName}</div>
                              <div className="font-bold">{dayNumber}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Header */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-700">Compact Style</h4>
                  <div className="overflow-x-auto">
                    <div className="min-w-[500px] flex items-center border border-slate-300 rounded bg-slate-100">
                      <div className="w-24 px-2 py-1 text-xs font-medium text-slate-700 border-r border-slate-300">
                        Schedule
                      </div>
                      <div className="flex-1 flex">
                        {timelineDates.slice(0, 10).map((date, index) => {
                          const { dayNumber } = formatTimelineDate(date);
                          return (
                            <div
                              key={index}
                              className="flex-1 px-1 py-1 text-center text-xs font-medium text-slate-600 border-r border-slate-300 last:border-r-0"
                            >
                              {dayNumber}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Integration Information */}
            <div className="mt-6 space-y-4">
              <h3 className="text-blue-600 border-b border-blue-200 pb-2">
                Timeline Header Features
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-slate-50/50 border-slate-200">
                  <h4 className="font-medium mb-2 text-slate-700">
                    Header Configuration
                  </h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Customizable title and timeline periods</li>
                    <li>• Responsive date column sizing</li>
                    <li>• Weekend and today highlighting</li>
                    <li>• Multiple visual themes and styles</li>
                    <li>• Date range navigation controls</li>
                    <li>• Accessibility with ARIA labels</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border bg-slate-50/50 border-slate-200">
                  <h4 className="font-medium mb-2 text-slate-700">
                    Gantt Integration
                  </h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Perfect alignment with task rows below</li>
                    <li>• Synchronized date column widths</li>
                    <li>• Compatible with timeline navigation</li>
                    <li>• Supports various time periods (days/weeks/months)</li>
                    <li>• Maintains scroll sync with content</li>
                    <li>• Responsive behavior for mobile devices</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-blue-50/50 border-blue-200">
                <h4 className="font-medium mb-2 text-blue-700">
                  Usage with Gantt Charts
                </h4>
                <p className="text-sm text-blue-600 mb-2">
                  This header component is designed to work seamlessly with Gantt timeline rows:
                </p>
                <ul className="text-sm space-y-1 text-blue-600">
                  <li>• Place this header directly above your Gantt timeline rows</li>
                  <li>• Ensure the timeline dates match your task date ranges</li>
                  <li>• Use navigation controls to pan across longer project timelines</li>
                  <li>• The column count automatically matches your timeline configuration</li>
                  <li>• Visual indicators help users understand current position in time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gantt Chart Timeline Rows */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">
              Gantt Timeline Rows
            </CardTitle>
            <CardDescription className="text-slate-600">
              Timeline visualization with configurable cells and activity periods for project planning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timeline Header */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700 mb-2">3-Week Timeline (21 Days)</div>
              <div className="flex items-center gap-1">
                <div className="w-48 text-sm text-slate-600 font-medium">Project / Task</div>
                <div className="flex-1 grid grid-cols-21 gap-1">
                  {Array.from({ length: 21 }, (_, i) => (
                    <div key={i} className="h-6 flex items-center justify-center text-xs text-slate-500 border-r border-slate-200 last:border-r-0">
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gantt Rows */}
            <div className="space-y-2">
              {[
                { 
                  id: 1, 
                  name: "E-Commerce Platform", 
                  startDay: 1, 
                  endDay: 21, 
                  color: "bg-blue-500", 
                  description: "Full development cycle",
                  progress: 65
                },
                { 
                  id: 2, 
                  name: "User Authentication", 
                  startDay: 2, 
                  endDay: 8, 
                  color: "bg-green-500", 
                  description: "Login & security features",
                  progress: 100
                },
                { 
                  id: 3, 
                  name: "Payment Integration", 
                  startDay: 9, 
                  endDay: 15, 
                  color: "bg-purple-500", 
                  description: "Stripe & PayPal setup",
                  progress: 80
                },
                { 
                  id: 4, 
                  name: "Mobile Responsive", 
                  startDay: 12, 
                  endDay: 18, 
                  color: "bg-orange-500", 
                  description: "Cross-device optimization",
                  progress: 45
                },
                { 
                  id: 5, 
                  name: "Testing & QA", 
                  startDay: 16, 
                  endDay: 21, 
                  color: "bg-red-500", 
                  description: "Quality assurance phase",
                  progress: 20
                },
                { 
                  id: 6, 
                  name: "Documentation", 
                  startDay: 5, 
                  endDay: 20, 
                  color: "bg-indigo-500", 
                  description: "Technical documentation",
                  progress: 30
                }
              ].map((task, index) => (
                <div
                  key={task.id}
                  tabIndex={0}
                  className="flex items-center gap-1 p-2 rounded-lg hover:bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-100/50 transition-all duration-200 cursor-pointer group"
                  role="listitem"
                  aria-label={`${task.name}: ${task.description}, ${task.progress}% complete`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      console.log(`Selected task: ${task.name}`);
                    }
                  }}
                >
                  {/* Task Info */}
                  <div className="w-48 pr-2">
                    <div className="font-medium text-slate-700 truncate text-sm group-hover:text-slate-800 transition-colors">
                      {task.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {task.description}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {task.progress}% complete
                    </div>
                  </div>

                  {/* Timeline Grid */}
                  <div className="flex-1 relative">
                    <div className="grid grid-cols-21 gap-1 h-8">
                      {Array.from({ length: 21 }, (_, i) => {
                        const dayNumber = i + 1;
                        const isActive = dayNumber >= task.startDay && dayNumber <= task.endDay;
                        const isStart = dayNumber === task.startDay;
                        const isEnd = dayNumber === task.endDay;
                        const progressDays = Math.floor((task.endDay - task.startDay + 1) * (task.progress / 100));
                        const isCompleted = dayNumber <= task.startDay + progressDays - 1;
                        
                        return (
                          <div
                            key={i}
                            className={`h-full border border-slate-200 transition-all duration-200 ${
                              isActive 
                                ? `${task.color} ${isCompleted ? 'opacity-100' : 'opacity-40'} ${
                                    isStart ? 'rounded-l-md' : ''
                                  } ${isEnd ? 'rounded-r-md' : ''}` 
                                : 'bg-slate-50 hover:bg-slate-100'
                            }`}
                            title={
                              isActive 
                                ? `Day ${dayNumber}: ${task.name} ${isCompleted ? '(Completed)' : '(Planned)'}` 
                                : `Day ${dayNumber}: Available`
                            }
                          >
                            {isActive && (
                              <div className="h-full flex items-center justify-center">
                                {isStart && (
                                  <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                                )}
                                {isEnd && task.progress === 100 && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Progress Overlay */}
                    <div className="absolute top-0 left-0 h-full flex items-center">
                      <div 
                        className="h-1 bg-white/80 rounded-full"
                        style={{
                          width: `${((task.endDay - task.startDay + 1) * (task.progress / 100)) * (100 / 21)}%`,
                          marginLeft: `${((task.startDay - 1) * (100 / 21))}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Task Actions */}
                  <div className="w-20 flex items-center justify-end gap-1">
                    <Badge 
                      variant={task.progress === 100 ? "default" : task.progress > 50 ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {task.progress === 100 ? "Done" : task.progress > 50 ? "Active" : "Planned"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Gantt Legend */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 bg-blue-500 rounded"></div>
                  <span className="text-slate-600">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 bg-blue-500 opacity-40 rounded"></div>
                  <span className="text-slate-600">Planned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 bg-slate-100 border border-slate-200 rounded"></div>
                  <span className="text-slate-600">Available</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Export Timeline
                </Button>
                <Button variant="outline" size="sm">
                  Add Task
                </Button>
              </div>
            </div>

            {/* Alternative Timeline Configuration Examples */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <h3 className="text-blue-600 border-b border-blue-200 pb-2">
                Alternative Timeline Configurations
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-4">
                {/* 2-Week Timeline */}
                <div className="p-4 rounded-lg border bg-slate-50/50 border-slate-200">
                  <h4 className="text-sm font-medium mb-3 text-slate-700">
                    2-Week Sprint Timeline (14 Days)
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <div className="w-32 text-xs text-slate-600">Sprint Planning</div>
                      <div className="flex-1 flex">
                        {Array.from({ length: 14 }, (_, i) => (
                          <div 
                            key={i} 
                            className={`h-4 flex-1 border-r border-slate-300 last:border-r-0 ${
                              i >= 0 && i <= 1 ? 'bg-green-400' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-32 text-xs text-slate-600">Development</div>
                      <div className="flex-1 flex">
                        {Array.from({ length: 14 }, (_, i) => (
                          <div 
                            key={i} 
                            className={`h-4 flex-1 border-r border-slate-300 last:border-r-0 ${
                              i >= 2 && i <= 10 ? 'bg-blue-400' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-32 text-xs text-slate-600">Testing</div>
                      <div className="flex-1 flex">
                        {Array.from({ length: 14 }, (_, i) => (
                          <div 
                            key={i} 
                            className={`h-4 flex-1 border-r border-slate-300 last:border-r-0 ${
                              i >= 11 && i <= 13 ? 'bg-purple-400' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Timeline */}
                <div className="p-4 rounded-lg border bg-slate-50/50 border-slate-200">
                  <h4 className="text-sm font-medium mb-3 text-slate-700">
                    Monthly Overview (30 Days)
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <div className="w-32 text-xs text-slate-600">Quarter Planning</div>
                      <div className="flex-1 flex">
                        {Array.from({ length: 30 }, (_, i) => (
                          <div 
                            key={i} 
                            className={`h-4 flex-1 border-r border-slate-300 last:border-r-0 ${
                              i >= 0 && i <= 4 ? 'bg-indigo-400' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-32 text-xs text-slate-600">Feature Dev</div>
                      <div className="flex-1 flex">
                        {Array.from({ length: 30 }, (_, i) => (
                          <div 
                            key={i} 
                            className={`h-4 flex-1 border-r border-slate-300 last:border-r-0 ${
                              i >= 5 && i <= 24 ? 'bg-orange-400' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-32 text-xs text-slate-600">Release Prep</div>
                      <div className="flex-1 flex">
                        {Array.from({ length: 30 }, (_, i) => (
                          <div 
                            key={i} 
                            className={`h-4 flex-1 border-r border-slate-300 last:border-r-0 ${
                              i >= 25 && i <= 29 ? 'bg-red-400' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income Form Table */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">
              Income Form Table
            </CardTitle>
            <CardDescription className="text-slate-600">
              Interactive form table with currency inputs, automatic calculations, and total summation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Form Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300">
                {/* Header Row */}
                <thead>
                  <tr className="bg-slate-100/50">
                    <th className="border border-slate-300 px-3 py-2 text-left text-sm font-medium text-slate-700 min-w-[100px]">
                      HH Mbr #
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-left text-sm font-medium text-slate-700 min-w-[180px]">
                      (A) Employment or Wages
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-left text-sm font-medium text-slate-700 min-w-[180px]">
                      (B) Soc. Security/Pensions
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-left text-sm font-medium text-slate-700 min-w-[160px]">
                      (C) Public Assistance
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-left text-sm font-medium text-slate-700 min-w-[140px]">
                      (D) Other Income
                    </th>
                  </tr>
                </thead>
                
                {/* Data Rows */}
                <tbody>
                  {incomeData.map((row, index) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* HH Member Number */}
                      <td className="border border-slate-300 px-3 py-2 text-center">
                        <span className="font-medium text-slate-700">{row.id}</span>
                      </td>
                      
                      {/* Employment Input */}
                      <td className="border border-slate-300 px-3 py-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.employment || ''}
                          onChange={(e) => updateIncomeValue(row.id, 'employment', e.target.value)}
                          className="w-full text-right border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="0"
                          tabIndex={0}
                        />
                      </td>
                      
                      {/* Social Security Input */}
                      <td className="border border-slate-300 px-3 py-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.socialSecurity || ''}
                          onChange={(e) => updateIncomeValue(row.id, 'socialSecurity', e.target.value)}
                          className="w-full text-right border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="0"
                          tabIndex={0}
                        />
                      </td>
                      
                      {/* Public Assistance Input */}
                      <td className="border border-slate-300 px-3 py-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.publicAssistance || ''}
                          onChange={(e) => updateIncomeValue(row.id, 'publicAssistance', e.target.value)}
                          className="w-full text-right border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="0"
                          tabIndex={0}
                        />
                      </td>
                      
                      {/* Other Income Input */}
                      <td className="border border-slate-300 px-3 py-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.otherIncome || ''}
                          onChange={(e) => updateIncomeValue(row.id, 'otherIncome', e.target.value)}
                          className="w-full text-right border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder="0"
                          tabIndex={0}
                        />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Totals Row */}
                  <tr className="bg-slate-100 font-medium">
                    <td className="border border-slate-300 px-3 py-2 text-left">
                      <span className="font-semibold text-slate-800">TOTALS</span>
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right">
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(calculateColumnTotal('employment'))}
                      </span>
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right">
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(calculateColumnTotal('socialSecurity'))}
                      </span>
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right">
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(calculateColumnTotal('publicAssistance'))}
                      </span>
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-right">
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(calculateColumnTotal('otherIncome'))}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Income Summary */}
            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-slate-200">
              <div className="text-sm text-slate-600">
                Add totals from (A) through (D), above
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-lg text-slate-800">
                  TOTAL INCOME (E): {formatCurrency(calculateTotalIncome())}
                </span>
              </div>
            </div>

            {/* Form Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const nextId = Math.max(...incomeData.map(row => row.id)) + 1;
                    setIncomeData(prev => [...prev, {
                      id: nextId,
                      employment: 0,
                      socialSecurity: 0,
                      publicAssistance: 0,
                      otherIncome: 0
                    }]);
                  }}
                >
                  Add Row
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (incomeData.length > 1) {
                      setIncomeData(prev => prev.slice(0, -1));
                    }
                  }}
                  disabled={incomeData.length <= 1}
                >
                  Remove Row
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIncomeData(prev => prev.map(row => ({
                      ...row,
                      employment: 0,
                      socialSecurity: 0,
                      publicAssistance: 0,
                      otherIncome: 0
                    })));
                  }}
                >
                  Clear All
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => {
                    console.log('Form data:', {
                      rows: incomeData,
                      totals: {
                        employment: calculateColumnTotal('employment'),
                        socialSecurity: calculateColumnTotal('socialSecurity'),
                        publicAssistance: calculateColumnTotal('publicAssistance'),
                        otherIncome: calculateColumnTotal('otherIncome'),
                        totalIncome: calculateTotalIncome()
                      }
                    });
                  }}
                >
                  Save Form
                </Button>
              </div>
            </div>

            {/* Form Accessibility Information */}
            <div className="mt-6 space-y-4">
              <h3 className="text-blue-600 border-b border-blue-200 pb-2">
                Form Table Features
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-slate-50/50 border-slate-200">
                  <h4 className="font-medium mb-2 text-slate-700">
                    Input Features
                  </h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Numeric input validation (currency format)</li>
                    <li>• Tab navigation through form fields</li>
                    <li>• Real-time calculation updates</li>
                    <li>• Right-aligned currency display</li>
                    <li>• Placeholder values and validation</li>
                    <li>• Focus states with visual indicators</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border bg-slate-50/50 border-slate-200">
                  <h4 className="font-medium mb-2 text-slate-700">
                    Calculation Features
                  </h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Automatic column totals calculation</li>
                    <li>• Grand total (E) across all categories</li>
                    <li>• Currency formatting with locale support</li>
                    <li>• Dynamic row addition/removal</li>
                    <li>• Form state management and validation</li>
                    <li>• Data export and persistence ready</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-blue-50/50 border-blue-200">
                <h4 className="font-medium mb-2 text-blue-700">
                  Keyboard Navigation
                </h4>
                <p className="text-sm text-blue-600 mb-2">
                  This form table supports full keyboard navigation:
                </p>
                <ul className="text-sm space-y-1 text-blue-600">
                  <li>• <code>Tab</code> - Move to next input field</li>
                  <li>• <code>Shift+Tab</code> - Move to previous input field</li>
                  <li>• <code>Enter</code> - Move to next row, same column</li>
                  <li>• <code>Arrow keys</code> - Navigate between cells (when focused)</li>
                  <li>• <code>Escape</code> - Clear current field and return to 0</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}