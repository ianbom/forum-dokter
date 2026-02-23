import { Head, router, usePage } from '@inertiajs/react';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { CategoryTagInput } from './_components/CategoryTagInput';
import { PostEditorToolbar } from './_components/PostEditorToolbar';
import { TiptapStyles } from './_components/TiptapStyles';

type Category = { id: number; name: string; slug: string };
type PostData = {
    id: number;
    title: string;
    content: string;
    categories: Category[];
};
type PageProps = { post: PostData; categories: Category[] };

export default function PostEdit() {
    const { post, categories } = usePage<PageProps>().props;
    const [title, setTitle] = useState(post.title);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        post.categories.map((c) => c.name.toLowerCase()),
    );
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Posts', href: '/posts' },
        { title: 'Edit Diskusi', href: '#' },
    ];

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
        content: post.content,
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
        router.put(`/posts/${post.id}`, { title: title.trim(), categories: selectedCategories, content }, {
            onError: (errs) => { setErrors(errs); setSubmitting(false); },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Diskusi" />
            <div className="flex flex-col gap-0">
                {/* Hero with Subtle Decorations */}
                <div className="relative overflow-hidden border-b border-border/40 bg-background/80 backdrop-blur-lg">
                    {/* Decorative background effects */}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                    <div className="absolute -top-24 -left-24 h-64 w-64 bg-[#1548d7]/10 dark:bg-[#6b93f5]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 h-48 w-48 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#1548d7]/20 dark:via-[#6b93f5]/20 to-transparent" />

                    <div className="relative mx-auto w-full max-w-4xl px-4 md:px-6 pt-6 md:pt-8 pb-6">
                        <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground hover:text-foreground -ml-3 transition-colors" asChild>
                            <a href={`/posts`}><ArrowLeft className="mr-1.5 h-4 w-4" />Kembali ke Diskusi</a>
                        </Button>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
                            {/* <span className="h-2 w-2 rounded-full bg-[#1548d7] dark:bg-[#6b93f5] shadow-[0_0_10px_rgba(21,72,215,0.6)]" /> */}
                            Edit Diskusi
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2 md:ml-5">Perbarui konten dan detail diskusi Anda.</p>
                    </div>
                </div>

                {/* Form */}
                <div className="mx-auto w-full max-w-4xl px-4 md:px-6 py-6 flex flex-col gap-5">
                    {/* Title & Categories */}
                    {/* <Card className="border-0 shadow-lg overflow-hidden"> */}
                    <CardContent className="p-5 md:p-6 space-y-4">
                        <div>
                            <Input
                                placeholder="Judul diskusi..."
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: '' })); }}
                                className={`text-xl md:text-2xl font-bold placeholder:text-muted-foreground/40 h-auto py-3 px-4 bg-background ${errors.title ? 'ring-1 ring-destructive border-destructive' : ''}`}
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
                    {/* </Card> */}

                    {/* Editor */}
                    {/* <Card className={`border-0 shadow-lg overflow-hidden ${errors.content ? 'ring-1 ring-destructive' : ''}`}> */}
                    <PostEditorToolbar editor={editor} />
                    <EditorContent editor={editor} />
                    {errors.content && <div className="px-5 pb-3"><p className="text-xs text-destructive">{errors.content}</p></div>}
                    {/* </Card> */}

                    {/* Submit */}
                    {/* <Card className="border-0 shadow-lg"> */}
                    <CardContent className="p-4 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Tips: Gunakan toolbar di atas untuk memformat teks, menambahkan gambar, link, dan lainnya.</p>
                        <Button className="bg-[#1548d7] hover:bg-[#1237b0] text-white shadow-md" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </CardContent>
                    {/* </Card> */}
                </div>
            </div>
            <TiptapStyles />
        </AppLayout>
    );
}
