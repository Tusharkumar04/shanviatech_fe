import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { fileToBase64 } from '@/lib/utils';
import type { ImageValue } from '@/types/common';

interface ImageListProps {
  value?: ImageValue[];
  onChange: (value: ImageValue[]) => void;
}

function srcOf(item: ImageValue): string {
  if (typeof item === 'string') return item;
  if (item && typeof item === 'object' && item.file) return item.file;
  return '';
}

export function ImageList({ value = [], onChange }: ImageListProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setLoading(true);
    try {
      const items = await Promise.all(
        Array.from(files).map(async (file) => ({
          file: await fileToBase64(file),
          filename: file.name,
        })),
      );
      onChange([...value, ...items]);
    } finally {
      setLoading(false);
    }
  };

  const remove = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((item, index) => (
          <div
            key={index}
            className="group relative aspect-video overflow-hidden rounded-lg border border-border"
          >
            <img
              src={srcOf(item)}
              alt={`Image ${index + 1}`}
              className="h-full w-full bg-muted object-cover"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-md bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-video flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-input bg-muted/30 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent/40"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <ImagePlus className="h-5 w-5" />
              <span className="text-[11px] font-medium">Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
