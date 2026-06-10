import { useState } from "react";
import {
  LayoutDashboard, LineChart, PieChart, TrendingUp,
  Users, UserCheck, UserPlus, Building2,
  FileText, FolderOpen, Upload, Download,
  Zap, Globe, Link, Webhook,
  Settings, HelpCircle, Lock
} from "lucide-react";

type GroupItem = { label: string; icon: React.ReactNode; badge?: string };
type Group = { heading: string; items: GroupItem[] };

const groups: Group[] = [
  {
    heading: "Overview",
    items: [
      { label: "Dashboard", icon: <LayoutDashboard size={15} /> },
      { label: "Analytics", icon: <LineChart size={15} /> },
      { label: "Reports", icon: <PieChart size={15} /> },
      { label: "Trends", icon: <TrendingUp size={15} /> },
    ],
  },
  {
    heading: "Team",
    items: [
      { label: "Members", icon: <Users size={15} /> },
      { label: "Permissions", icon: <UserCheck size={15} /> },
      { label: "Invites", icon: <UserPlus size={15} />, badge: "3" },
      { label: "Organizations", icon: <Building2 size={15} /> },
    ],
  },
  {
    heading: "Content",
    items: [
      { label: "Documents", icon: <FileText size={15} /> },
      { label: "Files", icon: <FolderOpen size={15} /> },
      { label: "Uploads", icon: <Upload size={15} /> },
      { label: "Exports", icon: <Download size={15} /> },
    ],
  },
  {
    heading: "Integrations",
    items: [
      { label: "Automations", icon: <Zap size={15} />, badge: "New" },
      { label: "Domains", icon: <Globe size={15} /> },
      { label: "API Keys", icon: <Link size={15} /> },
      { label: "Webhooks", icon: <Webhook size={15} /> },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Settings", icon: <Settings size={15} /> },
      { label: "Security", icon: <Lock size={15} /> },
      { label: "Help & Support", icon: <HelpCircle size={15} /> },
    ],
  },
];

export function NavGrouped() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="w-56 h-full flex flex-col bg-background border-r border-border">
      {/* Logo */}
      <div className="h-14 px-5 flex items-center border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-primary" />
          <span className="font-semibold text-sm">Platform</span>
        </div>
      </div>

      {/* Groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {groups.map((group) => (
          <div key={group.heading} className="mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-1">
              {group.heading}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = active === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => setActive(item.label)}
                    className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors
                      ${isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium
                        ${item.badge === "New"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                        }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
