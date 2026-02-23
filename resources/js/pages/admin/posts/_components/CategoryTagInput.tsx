import { X, Plus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import type { Category } from './types';
import { getCatColor } from './types';

type Props = {
    value: string[];
    onChange: (tags: string[]) => void;
    suggestions?: Category[];
    error?: string;
};

export function CategoryTagInput({ value, onChange, suggestions = [], error }: Props) {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const addTag = useCallback(
        (tag: string) => {
            const normalized = tag.toLowerCase().trim();
            if (!normalized || value.includes(normalized) || value.length >= 5) return;
            onChange([...value, normalized]);
            setInput('');
            setShowSuggestions(false);
        },
        [value, onChange],
    );

    const removeTag = useCallback(
        (tag: string) => {
            onChange(value.filter((t) => t !== tag));
        },
        [value, onChange],
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
            e.preventDefault();
            addTag(input);
        }
        if (e.key === 'Backspace' && !input && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    };

    const filtered = suggestions.filter(
        (s) =>
            s.name.toLowerCase().includes(input.toLowerCase()) &&
            !value.includes(s.name.toLowerCase()),
    );

    // close suggestions on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const isLimitReached = value.length >= 5;

    return (
        <div ref={containerRef} className="relative">
            <div
                className={`flex flex-wrap items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${error ? 'ring-1 ring-destructive' : 'border-input'} ${isLimitReached ? 'bg-muted/30 cursor-not-allowed' : ''}`}
                onClick={() => { if (!isLimitReached) inputRef.current?.focus(); }}
            >
                {value.map((tag) => {
                    const color = getCatColor(tag);
                    return (
                        <Badge
                            key={tag}
                            className={`${color.bg} ${color.text} border-0 text-[11px] font-medium gap-1 py-0.5 pr-1 cursor-default`}
                        >
                            <span className={`h-1.5 w-1.5 rounded-full ${color.dot}`} />
                            {tag}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                                className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    );
                })}
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    disabled={isLimitReached}
                    placeholder={
                        isLimitReached
                            ? 'Maksimal 5 kategori'
                            : value.length === 0
                                ? 'Ketik kategori, tekan Enter / tap +'
                                : 'Tambah...'
                    }
                    className="flex-1 min-w-[80px] bg-transparent outline-none placeholder:text-muted-foreground/50 text-sm disabled:cursor-not-allowed"
                    enterKeyHint="enter"
                />

                {!isLimitReached && input.trim() && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            addTag(input);
                            inputRef.current?.focus();
                        }}
                        className="ml-auto rounded-md p-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {/* Autocomplete dropdown */}
            {showSuggestions && input.length > 0 && filtered.length > 0 && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-48 overflow-y-auto">
                    {filtered.slice(0, 8).map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors text-left"
                            onMouseDown={(e) => { e.preventDefault(); addTag(s.name); }}
                        >
                            <span className={`h-1.5 w-1.5 rounded-full ${getCatColor(s.name).dot}`} />
                            {s.name}
                        </button>
                    ))}
                </div>
            )}

            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
    );
}
