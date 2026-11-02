import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { fileToBase64 } from '@/lib/utils';
import type { ImageValue } from '@/types/common';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: ImageValue;
  onChange: (value: ImageValue) => void;
  id?: string;
  /** HTML accept filter, e.g. `application/pdf`. Defaults to images + PDF. */
  accept?: string;
  /** Max file size in megabytes. Files larger than this are rejected. */
  maxSizeMb?: number;
}

// Turns an `accept` string into a human-readable extension hint, e.g. "PDF".
function describeAccept(accept: string): string {
  return accept
    .split(',')
    .map((part) => {
      const token = part.trim().toLowerCase();
      if (token === 'application/pdf' || token === '.pdf') return 'PDF';
      if (token.startsWith('image/')) return 'image';
      const slash = token.lastIndexOf('/');
      return (slash >= 0 ? token.slice(slash + 1) : token.replace('.', '')).toUpperCase();
    })
    .join(', ');
}

function matchesAccept(file: File, accept: string): boolean {
  const name = file.name.toLowerCase();
  return accept.split(',').some((part) => {
    const token = part.trim().toLowerCase();
    if (!token) return false;
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return file.type.startsWith(token.slice(0, -1));
    return file.type === token;
  });
}

function previewUrl(value?: ImageValue): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.file) return value.file;
  return null;
}

export function ImageUpload({
  value,
  onChange,
  id,
  accept = 'image/*,application/pdf',
  maxSizeMb,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const preview = previewUrl(value);

  const handleFile = async (file?: File | null) => {
    if (!file) return;

    if (!matchesAccept(file, accept)) {
      setError(`Only ${describeAccept(accept)} files are allowed`);
      return;
    }

    if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
      setError(`File must not exceed ${maxSizeMb}MB`);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      onChange({ file: base64, filename: file.name });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {preview ? (
        <div className="group relative overflow-hidden rounded-lg border border-border">
          <img
            src={preview}
            alt="Preview"
            className="h-40 w-full bg-muted object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-black hover:bg-white"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="grid h-8 w-8 place-items-center rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            'flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent/40',
            dragOver && 'border-primary bg-accent/60',
          )}
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <ImagePlus className="h-6 w-6" />
              <span className="text-xs font-medium">
                Click or drag a file to upload
              </span>
            </>
          )}
        </button>
      )}

      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
