import { DocumentPart } from './DocumentViewer';

interface PartCardProps {
  part: DocumentPart;
  index: number;
  isChild?: boolean;
}

const partTypeColors: Record<string, { bg: string; border: string; text: string }> = {
  header: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
  section: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700' },
  table: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' },
  'text-block': { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700' },
  footer: { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700' },
};

export function PartCard({ part, index, isChild }: PartCardProps) {
  const colors = partTypeColors[part.type] || partTypeColors['text-block'];
  
  return (
    <div 
      className={`rounded-lg border-2 ${colors.border} ${colors.bg} p-4 transition-all hover:shadow-md`}
      style={{ marginLeft: `${part.level * 24}px` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 rounded bg-white/70 border border-current/20">
              Part {index + 1}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${colors.text} bg-white/70 border border-current/20`}>
              {part.type}
            </span>
          </div>
          <h4 className={colors.text}>{part.label}</h4>
        </div>
      </div>
      
      {/* Fields */}
      {part.fields && part.fields.length > 0 && (
        <div className="mt-4 space-y-2">
          {part.fields.map((field, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm">
              <span className="opacity-60 min-w-[120px] shrink-0">{field.label}:</span>
              <span className={colors.text}>{field.value}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-current/20 grid grid-cols-2 gap-2 text-xs opacity-60">
        <div>Height: {part.bounds.height}%</div>
        <div>Width: {part.bounds.width}%</div>
      </div>
    </div>
  );
}
