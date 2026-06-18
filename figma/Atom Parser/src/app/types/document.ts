export interface DocumentPart {
  id: string;
  type: string;
  label: string;
  bounds: { x: number; y: number; width: number; height: number };
  parentId?: string;
  level: number;
  fields: { label: string; value: string }[];
}
