import React, { useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import {
  RotateCcw,
  GripVertical,
  Inbox,
  Bug,
  Zap,
  BookOpen,
  Shield,
  Star,
  X,
} from 'lucide-react';

const DRAG_TYPE = 'WORK_ITEM';

type WorkItemType = 'feature' | 'bug' | 'chore' | 'spike' | 'security';
type Priority = 'critical' | 'high' | 'medium' | 'low';

interface WorkItem {
  id: string;
  title: string;
  type: WorkItemType;
  priority: Priority;
  points: number;
  tag: string;
}

interface WorkTeam {
  id: string;
  name: string;
  emoji: string;
  accentBg: string;
  accentText: string;
  borderColor: string;
  items: WorkItem[];
}

const TYPE_META: Record<WorkItemType, { icon: React.ReactNode; label: string; color: string }> = {
  feature: { icon: <Star className="h-3 w-3" />, label: 'Feature', color: 'bg-blue-100 text-blue-700' },
  bug: { icon: <Bug className="h-3 w-3" />, label: 'Bug', color: 'bg-rose-100 text-rose-700' },
  chore: { icon: <BookOpen className="h-3 w-3" />, label: 'Chore', color: 'bg-slate-100 text-slate-600' },
  spike: { icon: <Zap className="h-3 w-3" />, label: 'Spike', color: 'bg-amber-100 text-amber-700' },
  security: { icon: <Shield className="h-3 w-3" />, label: 'Security', color: 'bg-purple-100 text-purple-700' },
};

const PRIORITY_META: Record<Priority, { label: string; dot: string }> = {
  critical: { label: 'Critical', dot: 'bg-rose-500' },
  high: { label: 'High', dot: 'bg-orange-400' },
  medium: { label: 'Medium', dot: 'bg-yellow-400' },
  low: { label: 'Low', dot: 'bg-slate-300' },
};

const INITIAL_BACKLOG: WorkItem[] = [
  { id: 'w1', title: 'OAuth2 SSO integration', type: 'feature', priority: 'high', points: 8, tag: 'Auth' },
  { id: 'w2', title: 'Fix payment timeout on retry', type: 'bug', priority: 'critical', points: 3, tag: 'Billing' },
  { id: 'w3', title: 'Upgrade Node.js to v22', type: 'chore', priority: 'medium', points: 2, tag: 'Infra' },
  { id: 'w4', title: 'Explore vector DB options', type: 'spike', priority: 'low', points: 5, tag: 'AI' },
  { id: 'w5', title: 'Dashboard data export CSV', type: 'feature', priority: 'medium', points: 5, tag: 'Analytics' },
  { id: 'w6', title: 'Rate limiting middleware', type: 'security', priority: 'high', points: 3, tag: 'API' },
  { id: 'w7', title: 'Onboarding flow redesign', type: 'feature', priority: 'high', points: 13, tag: 'UX' },
  { id: 'w8', title: 'Memory leak in WebSocket handler', type: 'bug', priority: 'critical', points: 5, tag: 'Backend' },
  { id: 'w9', title: 'Delete stale feature flags', type: 'chore', priority: 'low', points: 1, tag: 'Cleanup' },
  { id: 'w10', title: 'Multi-currency pricing display', type: 'feature', priority: 'medium', points: 8, tag: 'Billing' },
  { id: 'w11', title: 'Audit log for admin actions', type: 'security', priority: 'high', points: 5, tag: 'Compliance' },
  { id: 'w12', title: 'Storybook component library', type: 'chore', priority: 'low', points: 3, tag: 'DX' },
];

const INITIAL_TEAMS: WorkTeam[] = [
  { id: 'alpha', name: 'Alpha', emoji: '🔵', accentBg: 'bg-blue-50', accentText: 'text-blue-700', borderColor: 'border-blue-200', items: [] },
  { id: 'beta', name: 'Beta', emoji: '🟢', accentBg: 'bg-emerald-50', accentText: 'text-emerald-700', borderColor: 'border-emerald-200', items: [] },
  { id: 'gamma', name: 'Gamma', emoji: '🟣', accentBg: 'bg-violet-50', accentText: 'text-violet-700', borderColor: 'border-violet-200', items: [] },
  { id: 'delta', name: 'Delta', emoji: '🟠', accentBg: 'bg-amber-50', accentText: 'text-amber-700', borderColor: 'border-amber-200', items: [] },
];

const DraggableWorkItem: React.FC<{ item: WorkItem }> = ({ item }) => {
  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE,
    item: { item },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const typeMeta = TYPE_META[item.type];
  const priorityMeta = PRIORITY_META[item.priority];

  return (
    <div
      ref={drag}
      className={`flex items-start gap-2 p-3 bg-white border border-slate-200 rounded-lg cursor-move
        hover:border-slate-400 hover:shadow-sm transition-all duration-150
        ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}`}
    >
      <GripVertical className="h-4 w-4 text-slate-300 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start gap-2">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${priorityMeta.dot}`} />
          <p className="text-sm text-slate-800 leading-snug">{item.title}</p>
        </div>
        <div className="flex items-center gap-1.5 pl-3.5">
          <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${typeMeta.color}`}>
            {typeMeta.icon}
            {typeMeta.label}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
            {item.tag}
          </span>
          <span className="text-[10px] text-slate-400 ml-auto">{item.points}pt</span>
        </div>
      </div>
    </div>
  );
};

const TeamWorkDropZone: React.FC<{
  team: WorkTeam;
  onDrop: (teamId: string, item: WorkItem) => void;
  onRemove: (teamId: string, itemId: string) => void;
}> = ({ team, onDrop, onRemove }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DRAG_TYPE,
    drop: (dragged: { item: WorkItem }) => {
      onDrop(team.id, dragged.item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  const totalPoints = team.items.reduce((sum, i) => sum + i.points, 0);

  return (
    <div
      ref={drop}
      className={`flex flex-col rounded-xl border-2 overflow-hidden transition-all duration-200
        ${isActive ? 'border-slate-400 shadow-lg' : `${team.borderColor} border-dashed`}`}
    >
      {/* Header */}
      <div className={`${team.accentBg} px-4 py-2.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{team.emoji}</span>
          <span className={`text-sm font-semibold ${team.accentText}`}>{team.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-medium ${team.accentText} opacity-70`}>{totalPoints}pts</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/60 ${team.accentText} border ${team.borderColor}`}>
            {team.items.length}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className={`flex-1 p-2.5 min-h-[200px] transition-colors duration-200 ${isActive ? 'bg-slate-50' : 'bg-white'}`}>
        {team.items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
            <Inbox className="h-5 w-5 opacity-40" />
            <p className="text-xs">{isActive ? 'Release to assign' : 'Drop items here'}</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {team.items.map((workItem) => {
              const typeMeta = TYPE_META[workItem.type];
              const priorityMeta = PRIORITY_META[workItem.priority];
              return (
                <div key={workItem.id}
                  className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 group"
                >
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${priorityMeta.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 leading-snug">{workItem.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`inline-flex items-center gap-0.5 text-[9px] px-1 py-0.5 rounded font-medium ${typeMeta.color}`}>
                        {typeMeta.icon}
                        {typeMeta.label}
                      </span>
                      <span className="text-[9px] text-slate-400">{workItem.points}pt</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(team.id, workItem.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-rose-500 text-slate-400 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const WorkItemTeamDragDrop: React.FC = () => {
  const [backlog, setBacklog] = useState<WorkItem[]>(INITIAL_BACKLOG);
  const [teams, setTeams] = useState<WorkTeam[]>(INITIAL_TEAMS);

  const handleDrop = useCallback((teamId: string, item: WorkItem) => {
    const targetTeam = teams.find(t => t.id === teamId);
    if (targetTeam?.items.find(i => i.id === item.id)) {
      toast(`Already assigned to ${targetTeam.name}`);
      return;
    }

    setBacklog(prev => prev.filter(i => i.id !== item.id));
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return { ...team, items: [...team.items, item] };
      }
      return { ...team, items: team.items.filter(i => i.id !== item.id) };
    }));
    toast.success(`Assigned "${item.title}" to ${targetTeam?.name}`);
  }, [teams]);

  const handleRemove = useCallback((teamId: string, itemId: string) => {
    const team = teams.find(t => t.id === teamId);
    const workItem = team?.items.find(i => i.id === itemId);
    if (!workItem) return;

    setTeams(prev => prev.map(t =>
      t.id === teamId ? { ...t, items: t.items.filter(i => i.id !== itemId) } : t
    ));
    setBacklog(prev => {
      const next = [...prev, workItem];
      return next.sort((a, b) =>
        INITIAL_BACKLOG.findIndex(i => i.id === a.id) - INITIAL_BACKLOG.findIndex(i => i.id === b.id)
      );
    });
    toast(`"${workItem.title}" returned to backlog`);
  }, [teams]);

  const handleReset = () => {
    setBacklog(INITIAL_BACKLOG);
    setTeams(INITIAL_TEAMS.map(t => ({ ...t, items: [] })));
    toast('Backlog reset');
  };

  const assigned = INITIAL_BACKLOG.length - backlog.length;
  const totalAssignedPoints = teams.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.points, 0), 0);

  // Filter controls
  const [filter, setFilter] = useState<WorkItemType | 'all'>('all');
  const filteredBacklog = filter === 'all' ? backlog : backlog.filter(i => i.type === filter);

  return (
    <div className="flex gap-6">
      {/* Backlog panel */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">Sprint Backlog</p>
            <p className="text-xs text-slate-500 mt-0.5">{backlog.length} items · {INITIAL_BACKLOG.reduce((s,i)=>s+i.points,0) - totalAssignedPoints}pts remaining</p>
          </div>
          {assigned > 0 && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 text-xs gap-1">
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          )}
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap gap-1">
          {(['all', 'feature', 'bug', 'chore', 'spike', 'security'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] px-2 py-1 rounded-full border transition-colors
                ${filter === f
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
            >
              {f === 'all' ? 'All' : TYPE_META[f].label}
            </button>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
          <ScrollArea className="h-[480px]">
            <div className="p-2.5 space-y-2">
              {filteredBacklog.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-xs text-slate-400 text-center">
                  {backlog.length === 0 ? 'All items assigned!' : 'No items match filter'}
                </div>
              ) : (
                filteredBacklog.map(item => (
                  <DraggableWorkItem key={item.id} item={item} />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Progress bar */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Items assigned</span>
            <span>{assigned}/{INITIAL_BACKLOG.length}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${(assigned / INITIAL_BACKLOG.length) * 100}%` }}
            />
          </div>
          {/* Point distribution */}
          {teams.some(t => t.items.length > 0) && (
            <div className="flex gap-1 mt-1">
              {teams.map(t => {
                const pts = t.items.reduce((s, i) => s + i.points, 0);
                const totalPts = INITIAL_BACKLOG.reduce((s, i) => s + i.points, 0);
                const pct = (pts / totalPts) * 100;
                if (pct === 0) return null;
                return (
                  <div
                    key={t.id}
                    title={`${t.name}: ${pts}pts`}
                    className={`h-1 rounded-full ${t.accentBg} border ${t.borderColor}`}
                    style={{ width: `${pct}%` }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Teams grid */}
      <div className="flex-1 grid grid-cols-2 gap-4">
        {teams.map(team => (
          <TeamWorkDropZone
            key={team.id}
            team={team}
            onDrop={handleDrop}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
};
