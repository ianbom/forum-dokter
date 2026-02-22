import {
    Bold,
    Heading2,
    Heading3,
    Highlighter,
    ImagePlus,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Loader2,
    Quote,
    Strikethrough,
    UnderlineIcon,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import type { useEditor } from '@tiptap/react';

function MiniButton({
    onClick,
    isActive = false,
    title,
    children,
}: {
    onClick: () => void;
    isActive?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`inline-flex items-center justify-center rounded p-1 text-sm transition-colors ${isActive
                ? 'bg-[#1548d7]/10 text-[#1548d7] dark:bg-[#1548d7]/20 dark:text-[#6b93f5]'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
        >
            {children}
        </button>
    );
}

export function CommentEditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file || !editor) return;

            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            try {
                const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
                const response = await fetch('/posts/upload-image', {
                    method: 'POST',
                    headers: { 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
                    body: formData,
                });
                if (!response.ok) return;
                const data = await response.json();
                if (data.url) editor.chain().focus().setImage({ src: data.url }).run();
            } catch {
                console.error('Image upload failed');
            } finally {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        },
        [editor],
    );

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Masukkan URL:', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/20 dark:bg-muted/10 px-2 py-1.5">
            <MiniButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold"><Bold className="h-3.5 w-3.5" /></MiniButton>
            <MiniButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic"><Italic className="h-3.5 w-3.5" /></MiniButton>
            <MiniButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline"><UnderlineIcon className="h-3.5 w-3.5" /></MiniButton>
            <MiniButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough"><Strikethrough className="h-3.5 w-3.5" /></MiniButton>
            <MiniButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Highlight"><Highlighter className="h-3.5 w-3.5" /></MiniButton>

            <Separator orientation="vertical" className="mx-1 h-5" />

            <MiniButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 className="h-3.5 w-3.5" /></MiniButton>
            <MiniButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 className="h-3.5 w-3.5" /></MiniButton>

            <Separator orientation="vertical" className="mx-1 h-5" />

            <MiniButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List"><List className="h-3.5 w-3.5" /></MiniButton>
            <MiniButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List"><ListOrdered className="h-3.5 w-3.5" /></MiniButton>
            <MiniButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote"><Quote className="h-3.5 w-3.5" /></MiniButton>

            <Separator orientation="vertical" className="mx-1 h-5" />

            <MiniButton onClick={setLink} isActive={editor.isActive('link')} title="Link"><LinkIcon className="h-3.5 w-3.5" /></MiniButton>
            <MiniButton onClick={() => fileInputRef.current?.click()} title="Upload Gambar">
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
            </MiniButton>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>
    );
}
