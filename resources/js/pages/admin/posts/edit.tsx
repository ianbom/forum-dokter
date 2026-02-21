import { Head, router, usePage } from '@inertiajs/react';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    ArrowLeft,
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
    Save,
    Strikethrough,
    UnderlineIcon,
    Undo,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Category = {
    id: number;
    name: string;
    slug: string;
};

type PostData = {
    id: number;
    title: string;
    content: string;
    category_id: number;
    category: { id: number; name: string; slug: string };
};

type PageProps = {
    post: PostData;
    categories: Category[];
};

function ToolbarButton({
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

function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const addImage = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

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
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Upload failed:', response.status, errorText);
                    return;
                }

                const data = await response.json();
                if (data.url) {
                    editor.chain().focus().setImage({ src: data.url }).run();
                }
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
            { icon: uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />, title: 'Upload Gambar', action: addImage, active: false },
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
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
            />
        </div>
    );
}

export default function PostEdit() {
    const { post, categories } = usePage<PageProps>().props;
    const [title, setTitle] = useState(post.title);
    const [categoryId, setCategoryId] = useState(String(post.category_id));
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Posts', href: '/posts' },
        { title: 'Edit Diskusi', href: '#' },
    ];

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            Highlight.configure({ multicolor: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-[#1548d7] dark:text-[#6b93f5] underline cursor-pointer' },
            }),
            Image.configure({
                HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto my-4 shadow-sm' },
                allowBase64: false,
            }),
            Placeholder.configure({
                placeholder: 'Mulai tulis diskusi Anda di sini...',
            }),
        ],
        content: post.content,
        editorProps: {
            attributes: {
                class: 'prose prose-neutral dark:prose-invert max-w-none min-h-[400px] px-6 py-4 focus:outline-none text-[15px] leading-[1.8]',
            },
        },
    });

    const handleSubmit = () => {
        if (!editor) return;

        const content = editor.getHTML();
        const newErrors: Record<string, string> = {};

        if (!title.trim()) newErrors.title = 'Judul wajib diisi.';
        if (!categoryId) newErrors.category_id = 'Kategori wajib dipilih.';
        if (!content || content === '<p></p>') newErrors.content = 'Konten wajib diisi.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setSubmitting(true);

        router.put(
            `/posts/${post.id}`,
            {
                title: title.trim(),
                category_id: categoryId,
                content,
            },
            {
                onError: (errs) => {
                    setErrors(errs);
                    setSubmitting(false);
                },
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Diskusi" />
            <div className="flex flex-col gap-0">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-linear-to-br from-[#1548d7] via-[#1d5aef] to-[#3b6ef5]">
                    <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-white/5" />
                    <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/5" />

                    <div className="relative mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mb-4 text-white/70 hover:text-white hover:bg-white/10"
                            asChild
                        >
                            <a href={`/posts/${post.id}`}>
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                Kembali ke Diskusi
                            </a>
                        </Button>

                        <h1 className="text-xl md:text-2xl font-bold text-white">Edit Diskusi</h1>
                        <p className="text-sm text-white/60 mt-1">
                            Perbarui konten diskusi Anda
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto w-full max-w-4xl px-4 md:px-6 py-6 flex flex-col gap-5">
                    {/* Title & Category Row */}
                    <Card className="border-0 shadow-lg overflow-hidden">
                        <CardContent className="p-5 md:p-6 space-y-4">
                            <div>
                                <Input
                                    placeholder="Judul diskusi..."
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                                    }}
                                    className={`border-0 bg-transparent text-xl md:text-2xl font-bold placeholder:text-muted-foreground/40 focus-visible:ring-0 shadow-none px-0 h-auto py-2 ${errors.title ? 'ring-1 ring-destructive rounded-md px-3' : ''
                                        }`}
                                />
                                {errors.title && (
                                    <p className="text-xs text-destructive mt-1">{errors.title}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex-1 min-w-[200px]">
                                    <Select
                                        value={categoryId}
                                        onValueChange={(val) => {
                                            setCategoryId(val);
                                            if (errors.category_id) setErrors((prev) => ({ ...prev, category_id: '' }));
                                        }}
                                    >
                                        <SelectTrigger className={errors.category_id ? 'ring-1 ring-destructive' : ''}>
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={String(cat.id)}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && (
                                        <p className="text-xs text-destructive mt-1">{errors.category_id}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Editor */}
                    <Card className={`border-0 shadow-lg overflow-hidden ${errors.content ? 'ring-1 ring-destructive' : ''}`}>
                        <EditorToolbar editor={editor} />
                        <EditorContent editor={editor} />
                        {errors.content && (
                            <div className="px-5 pb-3">
                                <p className="text-xs text-destructive">{errors.content}</p>
                            </div>
                        )}
                    </Card>

                    {/* Submit Bar */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-4 flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                                Tips: Gunakan toolbar di atas untuk memformat teks, menambahkan gambar, link, dan lainnya.
                            </p>
                            <Button
                                className="bg-[#1548d7] hover:bg-[#1237b0] text-white shadow-md"
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Tiptap Editor Styles */}
            <style>{`
                .tiptap p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: var(--muted-foreground);
                    opacity: 0.4;
                    pointer-events: none;
                    height: 0;
                }
                .tiptap {
                    min-height: 400px;
                }
                .tiptap img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 1rem auto;
                    display: block;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .tiptap img.ProseMirror-selectednode {
                    outline: 2px solid #1548d7;
                    outline-offset: 2px;
                    border-radius: 0.5rem;
                }
                .tiptap blockquote {
                    border-left: 3px solid #1548d7;
                    padding-left: 1rem;
                    font-style: italic;
                    color: var(--muted-foreground);
                }
                .tiptap pre {
                    background: var(--muted);
                    border-radius: 0.5rem;
                    padding: 1rem;
                    font-family: monospace;
                    overflow-x: auto;
                }
                .tiptap mark {
                    background-color: #fef08a;
                    border-radius: 0.125rem;
                    padding: 0.125rem 0.25rem;
                }
                .dark .tiptap mark {
                    background-color: #854d0e;
                    color: #fef9c3;
                }
                .tiptap hr {
                    border: none;
                    border-top: 2px solid var(--border);
                    margin: 1.5rem 0;
                }
                .tiptap a {
                    color: #1548d7;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .dark .tiptap a {
                    color: #6b93f5;
                }
                .tiptap ul, .tiptap ol {
                    padding-left: 1.5rem;
                }
                .tiptap h1 {
                    font-size: 1.875rem;
                    font-weight: 700;
                    line-height: 1.3;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                .tiptap h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    line-height: 1.3;
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                }
                .tiptap h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    line-height: 1.4;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </AppLayout>
    );
}
