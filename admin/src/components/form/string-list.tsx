import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StringListProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function StringList({ value = [], onChange, placeholder }: StringListProps) {
  const update = (index: number, next: string) =>
    onChange(value.map((item, i) => (i === index ? next : item)));

  const remove = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  const add = () => onChange([...value, '']);

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" />
          <Input
            value={item}
            placeholder={placeholder || `Item ${index + 1}`}
            onChange={(e) => update(index, e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4" />
        Add item
      </Button>
    </div>
  );
}
