import { useState } from "react";
import {
  Sparkles, BookOpen, Pencil, Image, Mic,
  Bookmark, Clock, Trash2, Plus, Hash
} from "lucide-react";

type Section = { label: string; icon: React.ReactNode };
type Tag = { label: string; color: string };

const mainItems: Section[] = [
  { label: "Discover", icon: <Sparkles size={15} /> },
  { label: "Library", icon: <BookOpen size={15} /> },
  { label: "Write", icon: <Pencil size={15} /> },
  { label: "Media", icon: <Image size={15} /> },
  { label: "Podcasts", icon: <Mic size={15} /> },
];

const saved: Section[] = [
  { label: "Bookmarks", icon: <Bookmark size={15} /> },
  { label: "History", icon: <Clock size={15} /> },
  { label: "Trash", icon: <Trash2 size={15} /> },
];

const tags: Tag[] = [
  { label: "design", color: "#6366f1" },
  { label: "tech", color: "#ec4899" },
  { label: "writing", color: "#f59e0b" },
  { label: "research", color: "#10b981" },
  { label: "ideas", color: "#3b82f6" },
];

export function NavPill() {
  const [active, setActive] = useState("Discover");

  const renderItem = (item: Section) => {
    const isActive = active === item.label;
    return (
      <button
        key={item.label}
        onClick={() => setActive(item.label)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-full text-sm transition-all
          ${isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
      >
        <span className="shrink-0">{item.icon}</span>
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="w-52 h-full flex flex-col bg-background border-r border-border">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <p className="font-semibold text-base tracking-tight">Readwise</p>
        <p className="text-xs text-muted-foreground mt-0.5">Your reading hub</p>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        {/* Main */}
        <div className="space-y-0.5 mb-5">
          {mainItems.map(renderItem)}
        </div>

        {/* Saved */}
        <div className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-2">Saved</p>
          <div className="space-y-0.5">
            {saved.map(renderItem)}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Tags</p>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Plus size={12} />
            </button>
          </div>
          <div className="space-y-0.5">
            {tags.map((tag) => {
              const isActive = active === tag.label;
              return (
                <button
                  key={tag.label}
                  onClick={() => setActive(tag.label)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-full text-sm transition-all
                    ${isActive ? "bg-muted" : "hover:bg-muted/60"}`}
                >
                  <Hash size={13} style={{ color: tag.color }} />
                  <span className={isActive ? "text-foreground" : "text-muted-foreground"}>{tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
