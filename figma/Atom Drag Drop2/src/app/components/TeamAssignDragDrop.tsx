import React, { useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import {
  UserMinus,
  GripVertical,
  Users,
  X,
} from 'lucide-react';

const DRAG_TYPE = 'PERSON';

interface Person {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
}

interface Team {
  id: string;
  name: string;
  color: string;
  accentBg: string;
  accentText: string;
  borderColor: string;
  emoji: string;
  members: Person[];
}

const INITIAL_ROSTER: Person[] = [
  { id: 'p1', name: 'Alex Rivera', role: 'Frontend Eng', avatar: 'AR', skills: ['React', 'TypeScript'] },
  { id: 'p2', name: 'Jordan Kim', role: 'Backend Eng', avatar: 'JK', skills: ['Go', 'PostgreSQL'] },
  { id: 'p3', name: 'Sam Patel', role: 'Designer', avatar: 'SP', skills: ['Figma', 'Motion'] },
  { id: 'p4', name: 'Morgan Lee', role: 'Data Analyst', avatar: 'ML', skills: ['Python', 'SQL'] },
  { id: 'p5', name: 'Casey Chen', role: 'DevOps', avatar: 'CC', skills: ['K8s', 'Terraform'] },
  { id: 'p6', name: 'Taylor Wong', role: 'Product Mgr', avatar: 'TW', skills: ['Roadmap', 'OKRs'] },
  { id: 'p7', name: 'Drew Hassan', role: 'QA Engineer', avatar: 'DH', skills: ['Selenium', 'Jest'] },
  { id: 'p8', name: 'Quinn Ndiaye', role: 'ML Engineer', avatar: 'QN', skills: ['PyTorch', 'MLflow'] },
  { id: 'p9', name: 'Riley Obi', role: 'Fullstack Eng', avatar: 'RO', skills: ['Node', 'Vue'] },
  { id: 'p10', name: 'Avery Moss', role: 'UX Researcher', avatar: 'AM', skills: ['Interviews', 'A/B'] },
];

const INITIAL_TEAMS: Team[] = [
  {
    id: 'platform',
    name: 'Platform',
    color: 'bg-blue-600',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-700',
    borderColor: 'border-blue-200',
    emoji: '⚙️',
    members: [],
  },
  {
    id: 'growth',
    name: 'Growth',
    color: 'bg-emerald-600',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    emoji: '🚀',
    members: [],
  },
  {
    id: 'product',
    name: 'Product',
    color: 'bg-violet-600',
    accentBg: 'bg-violet-50',
    accentText: 'text-violet-700',
    borderColor: 'border-violet-200',
    emoji: '🎯',
    members: [],
  },
  {
    id: 'data',
    name: 'Data & AI',
    color: 'bg-amber-600',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
    borderColor: 'border-amber-200',
    emoji: '🧠',
    members: [],
  },
];

// Avatar colors cycle
const AVATAR_COLORS = [
  'bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500',
  'bg-teal-500', 'bg-orange-500',
];

const DraggablePerson: React.FC<{ person: Person; colorIndex: number }> = ({ person, colorIndex }) => {
  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE,
    item: { person },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const avatarColor = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];

  return (
    <div
      ref={drag}
      className={`flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-move
        hover:border-slate-400 hover:shadow-sm transition-all duration-150
        ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}`}
    >
      <GripVertical className="h-4 w-4 text-slate-300 flex-shrink-0" />
      <div className={`w-8 h-8 ${avatarColor} rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
        {person.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{person.name}</p>
        <p className="text-xs text-slate-500">{person.role}</p>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        {person.skills.slice(0, 1).map(s => (
          <span key={s} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};

const TeamDropZone: React.FC<{
  team: Team;
  onDrop: (teamId: string, person: Person) => void;
  onRemove: (teamId: string, personId: string) => void;
  personColorMap: Record<string, number>;
}> = ({ team, onDrop, onRemove, personColorMap }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DRAG_TYPE,
    drop: (item: { person: Person }) => {
      onDrop(team.id, item.person);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={`flex flex-col rounded-xl border-2 transition-all duration-200 overflow-hidden
        ${isActive ? 'border-slate-400 shadow-md' : `${team.borderColor} border-dashed`}`}
    >
      {/* Team header */}
      <div className={`${team.accentBg} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">{team.emoji}</span>
          <span className={`text-sm font-semibold ${team.accentText}`}>{team.name}</span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${team.accentBg} ${team.accentText} border ${team.borderColor}`}>
          {team.members.length}
        </span>
      </div>

      {/* Drop area */}
      <div className={`flex-1 p-3 min-h-[160px] transition-colors duration-200
        ${isActive ? 'bg-slate-50' : 'bg-white'}`}
      >
        {team.members.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
            <Users className="h-6 w-6 opacity-40" />
            <p className="text-xs">{isActive ? 'Release to assign' : 'Drop people here'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {team.members.map((person) => {
              const colorIdx = personColorMap[person.id] ?? 0;
              const avatarColor = AVATAR_COLORS[colorIdx % AVATAR_COLORS.length];
              return (
                <div key={person.id}
                  className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 group"
                >
                  <div className={`w-7 h-7 ${avatarColor} rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                    {person.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{person.name}</p>
                    <p className="text-[10px] text-slate-500">{person.role}</p>
                  </div>
                  <button
                    onClick={() => onRemove(team.id, person.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-rose-500 text-slate-400"
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

export const TeamAssignDragDrop: React.FC = () => {
  const [roster, setRoster] = useState<Person[]>(INITIAL_ROSTER);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);

  // Stable color index per person id
  const personColorMap: Record<string, number> = {};
  INITIAL_ROSTER.forEach((p, i) => { personColorMap[p.id] = i; });

  const handleDrop = useCallback((teamId: string, person: Person) => {
    // Check if already on that team
    const targetTeam = teams.find(t => t.id === teamId);
    if (targetTeam?.members.find(m => m.id === person.id)) {
      toast(`${person.name} is already on ${targetTeam.name}`);
      return;
    }

    // Remove from roster and any other team
    setRoster(prev => prev.filter(p => p.id !== person.id));
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return { ...team, members: [...team.members, person] };
      }
      return { ...team, members: team.members.filter(m => m.id !== person.id) };
    }));
    toast.success(`${person.name} assigned to ${targetTeam?.name}`);
  }, [teams]);

  const handleRemove = useCallback((teamId: string, personId: string) => {
    const team = teams.find(t => t.id === teamId);
    const person = team?.members.find(m => m.id === personId);
    if (!person) return;

    setTeams(prev => prev.map(t =>
      t.id === teamId ? { ...t, members: t.members.filter(m => m.id !== personId) } : t
    ));
    setRoster(prev => {
      // Restore in original order
      const originalIndex = INITIAL_ROSTER.findIndex(p => p.id === personId);
      const next = [...prev];
      next.splice(originalIndex, 0, person);
      return next.sort((a, b) =>
        INITIAL_ROSTER.findIndex(p => p.id === a.id) - INITIAL_ROSTER.findIndex(p => p.id === b.id)
      );
    });
    toast(`${person.name} returned to roster`);
  }, [teams]);

  const handleReset = () => {
    setRoster(INITIAL_ROSTER);
    setTeams(INITIAL_TEAMS.map(t => ({ ...t, members: [] })));
    toast('Reset to unassigned');
  };

  const assigned = INITIAL_ROSTER.length - roster.length;

  return (
    <div className="flex gap-6">
      {/* Roster panel */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">Unassigned Roster</p>
            <p className="text-xs text-slate-500 mt-0.5">{roster.length} of {INITIAL_ROSTER.length} people</p>
          </div>
          {assigned > 0 && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 text-xs gap-1">
              <UserMinus className="h-3 w-3" />
              Reset
            </Button>
          )}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
          <ScrollArea className="h-[520px]">
            <div className="p-3 space-y-2">
              {roster.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-xs text-slate-400 text-center">
                  Everyone has been<br />assigned to a team
                </div>
              ) : (
                roster.map((person) => (
                  <DraggablePerson
                    key={person.id}
                    person={person}
                    colorIndex={personColorMap[person.id]}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Progress */}
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span>Assignment progress</span>
            <span>{assigned}/{INITIAL_ROSTER.length}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(assigned / INITIAL_ROSTER.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Teams grid */}
      <div className="flex-1 grid grid-cols-2 gap-4">
        {teams.map((team) => (
          <TeamDropZone
            key={team.id}
            team={team}
            onDrop={handleDrop}
            onRemove={handleRemove}
            personColorMap={personColorMap}
          />
        ))}
      </div>
    </div>
  );
};
