import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    ImagePlus,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Loader2,
    Minus,
    Quote,
    Redo,
    Strikethrough,
    UnderlineIcon,
    Undo,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import type { useEditor } from '@tiptap/react';

export function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`inline-flex items-center justify-center rounded-md p-1.5 text-sm transition-colors disabled:opacity-40 ${isActive
                ? 'bg-[#1548d7]/10 text-[#1548d7] dark:bg-[#1548d7]/20 dark:text-[#6b93f5]'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
        >
            {children}
        </button>
    );
}

export function PostEditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
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
            } catch (error) {
                console.error('Image upload failed:', error);
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

    const groups = [
        [
            { icon: <Bold className="h-4 w-4" />, title: 'Bold', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
            { icon: <Italic className="h-4 w-4" />, title: 'Italic', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
            { icon: <UnderlineIcon className="h-4 w-4" />, title: 'Underline', action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
            { icon: <Strikethrough className="h-4 w-4" />, title: 'Strikethrough', action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
            { icon: <Code className="h-4 w-4" />, title: 'Code', action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code') },
            { icon: <Highlighter className="h-4 w-4" />, title: 'Highlight', action: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive('highlight') },
        ],
        [
            { icon: <Heading1 className="h-4 w-4" />, title: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
            { icon: <Heading2 className="h-4 w-4" />, title: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
            { icon: <Heading3 className="h-4 w-4" />, title: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
        ],
        [
            { icon: <List className="h-4 w-4" />, title: 'Bullet List', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
            { icon: <ListOrdered className="h-4 w-4" />, title: 'Ordered List', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
            { icon: <Quote className="h-4 w-4" />, title: 'Blockquote', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
            { icon: <Minus className="h-4 w-4" />, title: 'Horizontal Rule', action: () => editor.chain().focus().setHorizontalRule().run(), active: false },
        ],
        [
            { icon: <AlignLeft className="h-4 w-4" />, title: 'Align Left', action: () => editor.chain().focus().setTextAlign('left').run(), active: editor.isActive({ textAlign: 'left' }) },
            { icon: <AlignCenter className="h-4 w-4" />, title: 'Align Center', action: () => editor.chain().focus().setTextAlign('center').run(), active: editor.isActive({ textAlign: 'center' }) },
            { icon: <AlignRight className="h-4 w-4" />, title: 'Align Right', action: () => editor.chain().focus().setTextAlign('right').run(), active: editor.isActive({ textAlign: 'right' }) },
        ],
        [
            { icon: <LinkIcon className="h-4 w-4" />, title: 'Link', action: setLink, active: editor.isActive('link') },
            { icon: uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />, title: 'Upload Gambar', action: () => fileInputRef.current?.click(), active: false },
        ],
        [
            { icon: <Undo className="h-4 w-4" />, title: 'Undo', action: () => editor.chain().focus().undo().run(), active: false },
            { icon: <Redo className="h-4 w-4" />, title: 'Redo', action: () => editor.chain().focus().redo().run(), active: false },
        ],
    ];

    return (
        <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-3 py-2 dark:bg-muted/10">
            {groups.map((group, gi) => (
                <div key={gi} className="flex items-center">
                    {gi > 0 && <Separator orientation="vertical" className="mx-1.5 h-6" />}
                    {group.map((item, i) => (
                        <ToolbarButton key={i} onClick={item.action} isActive={item.active} title={item.title}>
                            {item.icon}
                        </ToolbarButton>
                    ))}
                </div>
            ))}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>
    );
}
