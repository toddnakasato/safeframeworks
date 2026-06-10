import { useState } from "react";
import {
  Compass, Layers, Code2, GitBranch, Terminal,
  Package, Shield, Radio, ChevronDown, ChevronRight,
  Cpu, Cloud, Database, Activity
} from "lucide-react";

type TreeItem = {
  label: string;
  icon?: React.ReactNode;
  tag?: string;
  children?: TreeItem[];
};

const tree: TreeItem[] = [
  {
    label: "Explorer",
    icon: <Compass size={14} />,
    children: [
      { label: "Overview", icon: <Layers size={14} /> },
      { label: "Services", icon: <Radio size={14} />, tag: "12" },
      { label: "Deployments", icon: <Cloud size={14} /> },
    ],
  },
  {
    label: "Compute",
    icon: <Cpu size={14} />,
    children: [
      { label: "Instances", icon: <Terminal size={14} /> },
      { label: "Functions", icon: <Code2 size={14} />, tag: "β" },
      { label: "Containers", icon: <Package size={14} /> },
    ],
  },
  {
    label: "Data",
    icon: <Database size={14} />,
    children: [
      { label: "Databases", icon: <Database size={14} /> },
      { label: "Storage", icon: <Cloud size={14} /> },
      { label: "Pipelines", icon: <GitBranch size={14} /> },
    ],
  },
  { label: "Monitoring", icon: <Activity size={14} /> },
  { label: "Security", icon: <Shield size={14} /> },
];

export function NavDark() {
  const [active, setActive] = useState("Overview");
  const [expanded, setExpanded] = useState<string[]>(["Explorer"]);

  const toggle = (label: string) =>
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );

  const renderTree = (items: TreeItem[], depth = 0) =>
    items.map((item) => {
      const hasChildren = !!item.children?.length;
      const isExpanded = expanded.includes(item.label);
      const isActive = active === item.label;

      return (
        <div key={item.label}>
          <button
            onClick={() => {
              if (hasChildren) toggle(item.label);
              else setActive(item.label);
            }}
            className={`w-full flex items-center gap-2 py-1.5 text-[13px] rounded-md transition-colors
              ${depth === 0 ? "px-3" : "px-3"}
              ${depth > 0 ? `pl-${6 + depth * 4}` : ""}
              ${isActive
                ? "bg-white/10 text-white"
                : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            style={{ paddingLeft: depth > 0 ? 12 + depth * 14 : 12 }}
          >
            {item.icon && (
              <span className={`shrink-0 ${isActive ? "text-white" : "text-white/40"}`}>
                {item.icon}
              </span>
            )}
            <span className="flex-1 text-left font-medium">{item.label}</span>
            {item.tag && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                {item.tag}
              </span>
            )}
            {hasChildren && (
              <span className="text-white/30 shrink-0">
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </span>
            )}
          </button>
          {hasChildren && isExpanded && (
            <div>{renderTree(item.children!, depth + 1)}</div>
          )}
        </div>
      );
    });

  return (
    <div className="w-52 h-full flex flex-col" style={{ background: "#0f1117" }}>
      {/* Logo */}
      <div className="h-14 px-4 flex items-center gap-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(99,102,241,0.9)" }}>
          <Terminal size={12} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-white/90">NexCloud</span>
        <span className="ml-auto text-[10px] text-white/30 border rounded px-1" style={{ borderColor: "rgba(255,255,255,0.1)" }}>v2</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-1.5 overflow-y-auto space-y-0.5">
        {renderTree(tree)}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium text-white" style={{ background: "rgba(99,102,241,0.5)" }}>
            M
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-white/70 truncate">marcus@nex.io</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
        </div>
      </div>
    </div>
  );
}
