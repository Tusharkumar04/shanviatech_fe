import { useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Link2,
  Undo2,
  Redo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  id?: string;
}

interface ToolButton {
  icon: typeof Bold;
  command: string;
  arg?: string;
  label: string;
}

const TOOLS: ToolButton[] = [
  { icon: Bold, command: 'bold', label: 'Bold' },
  { icon: Italic, command: 'italic', label: 'Italic' },
  { icon: Underline, command: 'underline', label: 'Underline' },
  { icon: Heading2, command: 'formatBlock', arg: 'h2', label: 'Heading' },
  { icon: List, command: 'insertUnorderedList', label: 'Bullet list' },
  { icon: ListOrdered, command: 'insertOrderedList', label: 'Numbered list' },
];

/**
 * Lightweight, dependency-free rich text editor built on a contentEditable
 * surface. Emits HTML so it round-trips with the backend's HTML fields.
 */
export function RichTextEditor({
  value = '',
  onChange,
  placeholder,
  id,
}: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Sync external value into the DOM without disrupting the caret while typing.
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    onChange(ref.current?.innerHTML ?? '');
  };

  const onLink = () => {
    const url = window.prompt('Enter URL');
    if (url) exec('createLink', url);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-input shadow-soft focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 focus-within:ring-offset-background">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 p-1">
        {TOOLS.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            onClick={() => exec(tool.command, tool.arg)}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <tool.icon className="h-4 w-4" />
          </button>
        ))}
        <button
          type="button"
          title="Insert link"
          onClick={onLink}
          className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            title="Undo"
            onClick={() => exec('undo')}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Redo"
            onClick={() => exec('redo')}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        id={id}
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className={cn(
          'rte-editor prose-content min-h-[160px] max-w-none px-3 py-2.5 focus:outline-none',
        )}
      />
    </div>
  );
}
