import { useState } from "react";
import {
  ShoppingCart, Package, Tag, Truck,
  CreditCard, BarChart, RefreshCcw, Star,
  Store, Megaphone, Mail, Globe,
  ChevronDown, Dot
} from "lucide-react";

type AccordionGroup = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  children: { label: string; badge?: string }[];
};

const groups: AccordionGroup[] = [
  {
    id: "orders",
    label: "Orders",
    icon: <ShoppingCart size={15} />,
    color: "#6366f1",
    children: [
      { label: "All Orders", badge: "234" },
      { label: "Pending", badge: "12" },
      { label: "Fulfilled" },
      { label: "Cancelled" },
      { label: "Returns", badge: "3" },
    ],
  },
  {
    id: "catalog",
    label: "Catalog",
    icon: <Package size={15} />,
    color: "#ec4899",
    children: [
      { label: "Products" },
      { label: "Collections" },
      { label: "Pricing" },
      { label: "Tags & Attributes" },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    icon: <Star size={15} />,
    color: "#f59e0b",
    children: [
      { label: "All Customers" },
      { label: "Segments" },
      { label: "Loyalty" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: <CreditCard size={15} />,
    color: "#10b981",
    children: [
      { label: "Transactions" },
      { label: "Payouts" },
      { label: "Invoices" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart size={15} />,
    color: "#3b82f6",
    children: [
      { label: "Overview" },
      { label: "Sales" },
      { label: "Traffic" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: <Megaphone size={15} />,
    color: "#8b5cf6",
    children: [
      { label: "Campaigns" },
      { label: "Email", badge: "New" },
      { label: "Discounts" },
    ],
  },
];

export function NavAccordion() {
  const [active, setActive] = useState("All Orders");
  const [expanded, setExpanded] = useState<string[]>(["orders"]);

  const toggle = (id: string) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  return (
    <div className="w-56 h-full flex flex-col bg-background border-r border-border">
      {/* Header */}
      <div className="h-14 px-4 flex items-center gap-2.5 border-b border-border">
        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "#6366f1" }}>
          <Store size={13} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">Shopfront</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Groups */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {groups.map((group) => {
          const isExpanded = expanded.includes(group.id);
          return (
            <div key={group.id} className="mb-0.5">
              {/* Group header */}
              <button
                onClick={() => toggle(group.id)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm hover:bg-muted/60 transition-colors"
              >
                <span className="shrink-0" style={{ color: group.color }}>{group.icon}</span>
                <span className="flex-1 text-left font-medium text-foreground/80">{group.label}</span>
                <ChevronDown
                  size={13}
                  className={`text-muted-foreground transition-transform duration-200 ${isExpanded ? "" : "-rotate-90"}`}
                />
              </button>

              {/* Children */}
              {isExpanded && (
                <div className="ml-3 mt-0.5 mb-1 border-l-2 border-border pl-2 space-y-0.5">
                  {group.children.map((child) => {
                    const isActive = active === child.label;
                    return (
                      <button
                        key={child.label}
                        onClick={() => setActive(child.label)}
                        className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm transition-colors
                          ${isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                          }`}
                      >
                        <Dot size={14} className={isActive ? "text-primary" : "text-muted-foreground/40"} />
                        <span className="flex-1 text-left">{child.label}</span>
                        {child.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full
                            ${child.badge === "New"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                            }`}>
                            {child.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer icons */}
      <div className="px-3 py-2 border-t border-border flex items-center gap-3">
        {[Globe, RefreshCcw, Truck, Mail].map((Icon, i) => (
          <button key={i} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon size={15} />
          </button>
        ))}
      </div>
    </div>
  );
}
