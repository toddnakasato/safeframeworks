import { useState } from "react";
import {
  Home, Search, Bell, Bookmark, MessageSquare,
  TrendingUp, Users, Settings, HelpCircle, User
} from "lucide-react";

type RailItem = { label: string; icon: React.ReactNode; badge?: number };

const main: RailItem[] = [
  { label: "Home", icon: <Home size={20} /> },
  { label: "Search", icon: <Search size={20} /> },
  { label: "Trending", icon: <TrendingUp size={20} /> },
  { label: "Notifications", icon: <Bell size={20} />, badge: 5 },
  { label: "Messages", icon: <MessageSquare size={20} />, badge: 12 },
  { label: "Bookmarks", icon: <Bookmark size={20} /> },
  { label: "Community", icon: <Users size={20} /> },
];

const bottom: RailItem[] = [
  { label: "Profile", icon: <User size={20} /> },
  { label: "Help", icon: <HelpCircle size={20} /> },
  { label: "Settings", icon: <Settings size={20} /> },
];

export function NavIconRail() {
  const [active, setActive] = useState("Home");
  const [hovered, setHovered] = useState<string | null>(null);

  const renderRailItem = (item: RailItem) => {
    const isActive = active === item.label;
    const isHovered = hovered === item.label;

    return (
      <div key={item.label} className="relative group">
        <button
          onClick={() => setActive(item.label)}
          onMouseEnter={() => setHovered(item.label)}
          onMouseLeave={() => setHovered(null)}
          className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all
            ${isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
        >
          {item.icon}
          {item.badge != null && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold">
              {item.badge > 9 ? "9+" : item.badge}
            </span>
          )}
        </button>
        {/* Tooltip */}
        {isHovered && (
          <div className="absolute left-12 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <div className="bg-foreground text-background text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
              {item.label}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-16 h-full flex flex-col items-center bg-sidebar border-r border-sidebar-border py-3 gap-1">
      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-3">
        <span className="text-primary-foreground font-bold text-sm">X</span>
      </div>

      {/* Main items */}
      <div className="flex-1 flex flex-col gap-1">
        {main.map(renderRailItem)}
      </div>

      {/* Bottom items */}
      <div className="flex flex-col gap-1">
        {bottom.map(renderRailItem)}
      </div>

      {/* Avatar */}
      <div className="mt-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold">
        JD
      </div>
    </div>
  );
}
