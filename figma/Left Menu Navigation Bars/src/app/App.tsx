import { NavClassic } from "./components/nav-classic";
import { NavGrouped } from "./components/nav-grouped";
import { NavDark } from "./components/nav-dark";
import { NavPill } from "./components/nav-pill";
import { NavIconRail } from "./components/nav-icon-rail";
import { NavAccordion } from "./components/nav-accordion";

type NavMeta = { label: string; desc: string; component: React.ReactNode };

const navs: NavMeta[] = [
  {
    label: "Classic + Nested",
    desc: "Collapsible tree, search, badges, user footer",
    component: <NavClassic />,
  },
  {
    label: "Grouped Sections",
    desc: "Section headings, flat items per group",
    component: <NavGrouped />,
  },
  {
    label: "Dark Tree",
    desc: "Dark bg, deep nesting, monospace feel",
    component: <NavDark />,
  },
  {
    label: "Pill Style",
    desc: "Rounded pills, tags, creator-tool vibe",
    component: <NavPill />,
  },
  {
    label: "Icon Rail",
    desc: "Icon-only with hover tooltips and badges",
    component: <NavIconRail />,
  },
  {
    label: "Accordion",
    desc: "Bordered indent, color-coded groups",
    component: <NavAccordion />,
  },
];

export default function App() {
  {/* MARKER-MAKE-KIT-INVOKED */}
  return (
    <div className="min-h-screen bg-muted/40 p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-foreground">Left Navigation Styles</h1>
          <p className="text-muted-foreground mt-1">Six distinct sidebar patterns — nested, grouped, icon-rail, accordion, pill, and dark tree.</p>
        </div>

        {/* Grid of navs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {navs.map((nav) => (
            <div key={nav.label} className="flex flex-col gap-2">
              {/* Label */}
              <div>
                <span className="text-sm font-semibold text-foreground">{nav.label}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{nav.desc}</p>
              </div>
              {/* Nav preview */}
              <div className="rounded-xl border border-border overflow-hidden shadow-sm" style={{ height: 520 }}>
                {nav.component}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
