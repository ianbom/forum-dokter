import { Head, router, usePage } from '@inertiajs/react';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { CategoryTagInput } from './_components/CategoryTagInput';
import { PostEditorToolbar } from './_components/PostEditorToolbar';
import { TiptapStyles } from './_components/TiptapStyles';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Posts', href: '/posts' },
    { title: 'Buat Diskusi', href: '#' },
];

type Category = { id: number; name: string; slug: string };
type PageProps = { categories: Category[] };

export default function PostCreate() {
    const { categories } = usePage<PageProps>().props;
    const [title, setTitle] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Underline,
            Highlight.configure({ multicolor: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#1548d7] dark:text-[#6b93f5] underline cursor-pointer' } }),
            Image.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto my-4 shadow-sm' }, allowBase64: false }),
            Placeholder.configure({ placeholder: 'Mulai tulis diskusi Anda di sini...' }),
        ],
        editorProps: { attributes: { class: 'prose prose-neutral dark:prose-invert max-w-none min-h-[400px] px-6 py-4 focus:outline-none text-[15px] leading-[1.8]' } },
    });

    const handleSubmit = () => {
        if (!editor) return;
        const content = editor.getHTML();
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = 'Judul wajib diisi.';
        if (selectedCategories.length === 0) newErrors.categories = 'Minimal satu kategori wajib diisi.';
        if (!content || content === '<p></p>') newErrors.content = 'Konten wajib diisi.';
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        setErrors({});
        setSubmitting(true);
        router.post('/posts', { title: title.trim(), categories: selectedCategories, content }, {
            onError: (errs) => { setErrors(errs); setSubmitting(false); },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Diskusi Baru" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#1548d7] via-[#1d5aef] to-[#3b6ef5] p-6 md:p-8 text-white shadow-xl">
                    <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10">
                        <Button variant="ghost" size="sm" className="mb-4 text-white/70 hover:text-white hover:bg-white/10" asChild>
                            <a href="/posts"><ArrowLeft className="mr-1.5 h-4 w-4" />Kembali ke Diskusi</a>
                        </Button>
                        <h1 className="text-xl md:text-2xl font-bold text-white">Buat Diskusi Baru</h1>
                        <p className="text-sm text-white/60 mt-1">Bagikan pengetahuan dan pengalaman klinis Anda dengan rekan sejawat</p>
                    </div>
                </div>

                {/* Form */}
                <div className="mx-auto w-full max-w-4xl flex flex-col gap-5">
                    {/* Title & Categories */}
                    <CardContent className="p-5 md:p-6 space-y-4">
                        <div>
                            <Input
                                placeholder="Judul diskusi..."
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: '' })); }}
                                className={`border-0 bg-transparent text-xl md:text-2xl font-bold placeholder:text-muted-foreground/40 focus-visible:ring-0 shadow-none px-0 h-auto py-2 ${errors.title ? 'ring-1 ring-destructive rounded-md px-3' : ''}`}
                            />
                            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <CategoryTagInput
                                value={selectedCategories}
                                onChange={(tags) => { setSelectedCategories(tags); if (errors.categories) setErrors((p) => ({ ...p, categories: '' })); }}
                                suggestions={categories}
                                error={errors.categories}
                            />
                        </div>
                    </CardContent>

                    {/* Editor */}
                    <div className={`border-1 shadow-sm overflow-hidden ${errors.content ? 'ring-1 ring-destructive' : ''}`}>
                        <PostEditorToolbar editor={editor} />
                        <EditorContent editor={editor} />
                        {errors.content && <div className="px-5 pb-3"><p className="text-xs text-destructive">{errors.content}</p></div>}
                    </div>

                    {/* Submit */}
                    <CardContent className="p-4 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Tips: Gunakan toolbar di atas untuk memformat teks, menambahkan gambar, link, dan lainnya.</p>
                        <Button className="bg-[#1548d7] hover:bg-[#1237b0] text-white shadow-md" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            {submitting ? 'Mengirim...' : 'Publikasikan'}
                        </Button>
                    </CardContent>
                </div>
            </div>
            <TiptapStyles />
        </AppLayout>
    );
}
