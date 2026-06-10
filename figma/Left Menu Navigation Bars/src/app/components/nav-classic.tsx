import { useState } from "react";
import {
  Home, BarChart2, Users, Settings, FileText, Bell, Shield,
  ChevronDown, ChevronRight, Inbox, Calendar, Search, Star, Archive
} from "lucide-react";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  badge?: number;
  children?: { label: string; icon?: React.ReactNode }[];
};

const items: NavItem[] = [
  { label: "Dashboard", icon: <Home size={16} /> },
  { label: "Inbox", icon: <Inbox size={16} />, badge: 4 },
  {
    label: "Analytics", icon: <BarChart2 size={16} />,
    children: [
      { label: "Overview" },
      { label: "Reports" },
      { label: "Exports" },
    ],
  },
  {
    label: "People", icon: <Users size={16} />,
    children: [
      { label: "Contacts" },
      { label: "Teams" },
      { label: "Roles" },
    ],
  },
  { label: "Calendar", icon: <Calendar size={16} /> },
  { label: "Documents", icon: <FileText size={16} /> },
  { label: "Starred", icon: <Star size={16} /> },
  { label: "Archive", icon: <Archive size={16} /> },
];

const bottomItems: NavItem[] = [
  { label: "Notifications", icon: <Bell size={16} />, badge: 2 },
  { label: "Security", icon: <Shield size={16} /> },
  { label: "Settings", icon: <Settings size={16} /> },
];

export function NavClassic() {
  const [active, setActive] = useState("Dashboard");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const toggle = (label: string) =>
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );

  const renderItem = (item: NavItem, depth = 0) => {
    const isActive = active === item.label;
    const isExpanded = expanded.includes(item.label);
    const hasChildren = !!item.children?.length;

    return (
      <div key={item.label}>
        <button
          onClick={() => {
            setActive(item.label);
            if (hasChildren) toggle(item.label);
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors
            ${depth > 0 ? "pl-8" : ""}
            ${isActive
              ? "bg-primary text-primary-foreground"
              : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
            }`}
        >
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge != null && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <span className="shrink-0">
              {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </span>
          )}
        </button>
        {hasChildren && isExpanded && (
          <div className="mt-0.5 mb-0.5">
            {item.children!.map((child) =>
              renderItem({ label: child.label, icon: child.icon ?? <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" /> }, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-56 h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-semibold">A</span>
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Acme Corp</p>
            <p className="text-xs text-muted-foreground mt-0.5">Workspace</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-muted/60 text-muted-foreground text-sm">
          <Search size={13} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 overflow-y-auto space-y-0.5">
        {items.map((item) => renderItem(item))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-2 border-t border-sidebar-border space-y-0.5">
        {bottomItems.map((item) => renderItem(item))}
      </div>

      {/* User */}
      <div className="px-3 py-3 border-t border-sidebar-border flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">JD</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-none truncate">Jane Doe</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">jane@acme.com</p>
        </div>
      </div>
    </div>
  );
}
