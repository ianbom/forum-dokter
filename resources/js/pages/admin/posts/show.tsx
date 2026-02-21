import { Head, router, usePage } from '@inertiajs/react';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    ArrowLeft,
    Bold,
    Calendar,
    Clock,
    CornerDownRight,
    Download,
    Eye,
    EyeOff,
    FileIcon,
    FileText,
    Heading2,
    Heading3,
    Highlighter,
    ImageIcon,
    ImagePlus,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Loader2,
    MessageCircle,
    MoreHorizontal,
    Paperclip,
    Pencil,
    Quote,
    Reply,
    Send,
    Share2,
    Strikethrough,
    ThumbsUp,
    Trash2,
    TrendingUp,
    UnderlineIcon,
    Users,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Posts', href: '/posts' },
    { title: 'Detail Diskusi', href: '#' },
];

type Attachment = {
    id: number;
    file_name: string;
    file_type: string;
    file_size: number;
    file_path: string;
};

type CommentType = {
    id: number;
    user: { id: number; name: string; specialization: string | null };
    content: string;
    created_at: string;
    attachments: Attachment[];
    replies: CommentType[];
};

type PostData = {
    id: number;
    title: string;
    content: string;
    views: number;
    is_hidden: boolean;
    created_at: string;
    comments_count: number;
    user: {
        id: number;
        name: string;
        specialization: string | null;
        bio: string | null;
        posts_count: number;
        comments_count: number;
    };
    category: { id: number; name: string; slug: string };
    attachments: Attachment[];
    comments: CommentType[];
};

type PageProps = {
    post: PostData;
};

const BRAND = {
    bg: 'bg-[#1548d7]',
    bgHover: 'hover:bg-[#1237b0]',
    text: 'text-[#1548d7]',
    bgLight: 'bg-[#1548d7]/10',
    darkText: 'dark:text-[#6b93f5]',
    darkBgLight: 'dark:bg-[#1548d7]/20',
};

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter((_, i) => i < 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

function formatFileSize(bytes: number): string {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} B`;
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }) + ' WIB';
}

function formatShortDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function AttachmentFileIcon({ type }: { type: string }) {
    if (type === 'image') return <ImageIcon className="h-4 w-4" />;
    if (type === 'pdf') return <FileText className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
}

function AttachmentCard({ attachment }: { attachment: Attachment }) {
    const isImage = attachment.file_type === 'image';
    const fileUrl = attachment.file_path.startsWith('http')
        ? attachment.file_path
        : `/storage/${attachment.file_path}`;

    if (isImage) {
        return (
            <div className="group/att relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="relative aspect-video w-full bg-muted/30">
                    <img
                        src={fileUrl}
                        alt={attachment.file_name}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity group-hover/att:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-3 opacity-0 transition-opacity group-hover/att:opacity-100">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">{attachment.file_name}</p>
                            <p className="text-xs text-white/70">{formatFileSize(attachment.file_size)}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-white hover:bg-white/20" asChild>
                            <a href={fileUrl} download>
                                <Download className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group/att relative flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                <AttachmentFileIcon type={attachment.file_type} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{attachment.file_name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(attachment.file_size)}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-60 transition-opacity group-hover/att:opacity-100" asChild>
                <a href={fileUrl} download>
                    <Download className="h-4 w-4" />
                </a>
            </Button>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════
   Mini Tiptap Toolbar — used in both comment box & reply box
   ════════════════════════════════════════════════════════════ */

function MiniToolbarButton({
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

function CommentEditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
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
                if (data.url) {
                    editor.chain().focus().setImage({ src: data.url }).run();
                }
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
            <MiniToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
                <Bold className="h-3.5 w-3.5" />
            </MiniToolbarButton>
            <MiniToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
                <Italic className="h-3.5 w-3.5" />
            </MiniToolbarButton>
            <MiniToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
                <UnderlineIcon className="h-3.5 w-3.5" />
            </MiniToolbarButton>
            <MiniToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
                <Strikethrough className="h-3.5 w-3.5" />
            </MiniToolbarButton>
            <MiniToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Highlight">
                <Highlighter className="h-3.5 w-3.5" />
            </MiniToolbarButton>

            <Separator orientation="vertical" className="mx-1 h-5" />

            <MiniToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
                <Heading2 className="h-3.5 w-3.5" />
            </MiniToolbarButton>
            <MiniToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
                <Heading3 className="h-3.5 w-3.5" />
            </MiniToolbarButton>

            <Separator orientation="vertical" className="mx-1 h-5" />

            <MiniToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
                <List className="h-3.5 w-3.5" />
            </MiniToolbarButton>
            <MiniToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
                <ListOrdered className="h-3.5 w-3.5" />
            </MiniToolbarButton>
            <MiniToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
                <Quote className="h-3.5 w-3.5" />
            </MiniToolbarButton>

            <Separator orientation="vertical" className="mx-1 h-5" />

            <MiniToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Link">
                <LinkIcon className="h-3.5 w-3.5" />
            </MiniToolbarButton>
            <MiniToolbarButton
                onClick={() => fileInputRef.current?.click()}
                title="Upload Gambar"
            >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
            </MiniToolbarButton>

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

function useCommentEditor(placeholder: string) {
    return useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [2, 3] } }),
            Underline,
            Highlight.configure({ multicolor: false }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-[#1548d7] dark:text-[#6b93f5] underline cursor-pointer' },
            }),
            Image.configure({
                HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto my-3 shadow-sm' },
                allowBase64: false,
            }),
            Placeholder.configure({ placeholder }),
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-sm prose-neutral dark:prose-invert max-w-none min-h-[100px] px-4 py-3 focus:outline-none text-sm leading-relaxed',
            },
        },
    });
}

/* ═══════════════════════════════════
   Comment Item (with reply support)
   ═══════════════════════════════════ */

function CommentItem({ comment, postId, depth = 0 }: { comment: CommentType; postId: number; depth?: number }) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [submittingReply, setSubmittingReply] = useState(false);
    const [liked, setLiked] = useState(false);
    const isNested = depth > 0;
    const initials = getInitials(comment.user.name);

    const replyEditor = useCommentEditor(`Balas ${comment.user.name}...`);

    const handleSubmitReply = useCallback(() => {
        if (!replyEditor) return;
        const html = replyEditor.getHTML();
        if (!html || html === '<p></p>') return;

        setSubmittingReply(true);
        router.post(
            '/comments',
            {
                post_id: postId,
                parent_id: comment.id,
                content: html,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    replyEditor.commands.clearContent();
                    setReplyOpen(false);
                },
                onFinish: () => setSubmittingReply(false),
            },
        );
    }, [replyEditor, postId, comment.id]);

    return (
        <div className={isNested ? 'ml-5 md:ml-8' : ''}>
            <div className="group relative py-5">
                {isNested && (
                    <div className="absolute -left-5 md:-left-8 top-0 bottom-0 w-px bg-border dark:bg-border/50" />
                )}
                {isNested && (
                    <div className="absolute -left-5 md:-left-8 top-9 h-px w-4 md:w-7 bg-border dark:bg-border/50" />
                )}

                <div className="flex gap-3">
                    <Avatar className={`${isNested ? 'h-8 w-8' : 'h-10 w-10'} shrink-0 ring-2 ring-background shadow-sm`}>
                        <AvatarFallback className={`${BRAND.bg} text-white text-xs font-semibold`}>
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="rounded-2xl rounded-tl-sm bg-muted/50 dark:bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/70 dark:hover:bg-muted/40">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-sm font-semibold ${BRAND.text} ${BRAND.darkText}`}>
                                        {comment.user.name}
                                    </span>
                                    {comment.user.specialization && (
                                        <Badge
                                            className={`${BRAND.bgLight} ${BRAND.text} ${BRAND.darkBgLight} ${BRAND.darkText} border-0 text-[10px] font-medium px-1.5 py-0`}
                                        >
                                            {comment.user.specialization}
                                        </Badge>
                                    )}
                                    <span className="text-[11px] text-muted-foreground">{formatShortDate(comment.created_at)}</span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Render comment content as HTML from Tiptap */}
                            <div
                                className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed text-foreground/85"
                                dangerouslySetInnerHTML={{ __html: comment.content }}
                            />

                            {comment.attachments && comment.attachments.length > 0 && (
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {comment.attachments.map((att) => (
                                        <AttachmentCard key={att.id} attachment={att} />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-1.5 flex items-center gap-0.5 px-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-7 px-2 text-xs gap-1 ${liked ? `${BRAND.text} ${BRAND.darkText}` : 'text-muted-foreground'}`}
                                onClick={() => setLiked(!liked)}
                            >
                                <ThumbsUp className={`h-3.5 w-3.5 ${liked ? 'fill-current' : ''}`} />
                                {liked ? 1 : 0}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs text-muted-foreground gap-1"
                                onClick={() => setReplyOpen(!replyOpen)}
                            >
                                <Reply className="h-3.5 w-3.5" />
                                Balas
                            </Button>
                        </div>

                        {/* Reply Editor (Tiptap) */}
                        {replyOpen && (
                            <div className="mt-2 ml-1 flex gap-2.5 items-start">
                                <CornerDownRight className="mt-3 h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                                        <CommentEditorToolbar editor={replyEditor} />
                                        <EditorContent editor={replyEditor} />
                                    </div>
                                    <div className="flex items-center justify-end gap-1.5">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs"
                                            onClick={() => {
                                                setReplyOpen(false);
                                                replyEditor?.commands.clearContent();
                                            }}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            size="sm"
                                            className={`h-7 text-xs ${BRAND.bg} ${BRAND.bgHover} text-white`}
                                            onClick={handleSubmitReply}
                                            disabled={submittingReply}
                                        >
                                            {submittingReply ? (
                                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                            ) : (
                                                <Send className="mr-1 h-3 w-3" />
                                            )}
                                            Kirim
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {comment.replies && comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
            ))}
        </div>
    );
}

/* ═══════════════════════════
   Main PostShow Component
   ═══════════════════════════ */

export default function PostShow() {
    const { post } = usePage<PageProps>().props;
    const [submittingComment, setSubmittingComment] = useState(false);

    const commentEditor = useCommentEditor('Bagikan pendapat atau pengalaman klinis Anda...');

    const userInitials = getInitials(post.user.name);
    const commentsCount = post.comments_count ?? 0;

    const handleSubmitComment = useCallback(() => {
        if (!commentEditor) return;
        const html = commentEditor.getHTML();
        if (!html || html === '<p></p>') return;

        setSubmittingComment(true);
        router.post(
            '/comments',
            {
                post_id: post.id,
                content: html,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    commentEditor.commands.clearContent();
                },
                onFinish: () => setSubmittingComment(false),
            },
        );
    }, [commentEditor, post.id]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title} />
            <div className="flex flex-col gap-0 p-0">
                {/* ═══════════════ Hero Header ═══════════════ */}
                <div className="relative overflow-hidden bg-linear-to-br from-[#1548d7] via-[#1d5aef] to-[#3b6ef5]">
                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />
                    <div className="absolute top-1/2 left-1/3 h-32 w-32 rounded-full bg-white/3" />

                    <div className="relative mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mb-4 text-white/70 hover:text-white hover:bg-white/10"
                            asChild
                        >
                            <a href="/posts">
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                Kembali ke Diskusi
                            </a>
                        </Button>

                        <div className="flex items-start gap-2 mb-3 flex-wrap">
                            <Badge className="bg-white/15 text-white border-white/20 text-xs backdrop-blur-sm">
                                {post.category.name}
                            </Badge>
                            {post.is_hidden && (
                                <Badge className="bg-red-500/30 text-white border-red-300/30 text-xs">
                                    <EyeOff className="mr-1 h-3 w-3" />
                                    Hidden
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug mb-4 max-w-3xl">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-3 mb-5">
                            <Avatar className="h-10 w-10 ring-2 ring-white/30 shadow-lg">
                                <AvatarFallback className="bg-white/20 text-white font-semibold text-sm backdrop-blur-sm">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold text-white">{post.user.name}</p>
                                <div className="flex items-center gap-2 text-xs text-white/60">
                                    {post.user.specialization && (
                                        <>
                                            <span>{post.user.specialization}</span>
                                            <span>•</span>
                                        </>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(post.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            {[
                                { icon: Eye, label: `${post.views.toLocaleString('id-ID')} views` },
                                { icon: MessageCircle, label: `${commentsCount} komentar` },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs text-white/80"
                                >
                                    <stat.icon className="h-3.5 w-3.5" />
                                    {stat.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══════════════ Main Content ═══════════════ */}
                <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr]">
                        {/* ──── Left Column ──── */}
                        <div className="flex flex-col gap-6 min-w-0">
                            {/* <Card className="border-0 shadow-lg overflow-hidden"> */}
                                <CardContent className="p-5 md:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                                                <ThumbsUp className="h-3.5 w-3.5" />
                                                Suka
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                                                <Share2 className="h-3.5 w-3.5" />
                                                Share
                                            </Button>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                    Kelola
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44">
                                                <DropdownMenuItem asChild>
                                                    <a href={`/posts/${post.id}/edit`}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit Diskusi
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <EyeOff className="mr-2 h-4 w-4" />
                                                    Sembunyikan
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <Separator className="mb-6" />

                                    {/* Article Body — renders HTML from Tiptap */}
                                    <article
                                        className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-[1.8] text-[15px]"
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />

                                    {/* Attachments */}
                                    {post.attachments && post.attachments.length > 0 && (
                                        <div className="mt-8 pt-6 border-t">
                                            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                                <div className={`rounded-lg p-1.5 ${BRAND.bgLight} ${BRAND.darkBgLight}`}>
                                                    <Paperclip className={`h-4 w-4 ${BRAND.text} ${BRAND.darkText}`} />
                                                </div>
                                                Lampiran ({post.attachments.length})
                                            </h4>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {post.attachments.map((att) => (
                                                    <AttachmentCard key={att.id} attachment={att} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            {/* </Card> */}

                            {/* Comment Input Card — Tiptap Editor */}
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <CardHeader className="pb-0 pt-5 px-5 md:px-8">
                                    <h3 className="text-sm font-semibold flex items-center gap-2">
                                        <Pencil className={`h-4 w-4 ${BRAND.text} ${BRAND.darkText}`} />
                                        Tulis Komentar
                                    </h3>
                                </CardHeader>
                                <CardContent className="p-5 md:px-8 md:pb-6">
                                    <div className="flex gap-3 items-start">
                                        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-background shadow-sm mt-0.5">
                                            <AvatarFallback className={`${BRAND.bg} text-white text-xs font-semibold`}>
                                                AD
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-3">
                                            <div className="rounded-xl border bg-muted/20 dark:bg-muted/10 overflow-hidden transition-colors focus-within:border-[#1548d7]/40 focus-within:shadow-sm">
                                                <CommentEditorToolbar editor={commentEditor} />
                                                <EditorContent editor={commentEditor} />
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <Button
                                                    className={`${BRAND.bg} ${BRAND.bgHover} text-white shadow-md text-xs h-8`}
                                                    onClick={handleSubmitComment}
                                                    disabled={submittingComment}
                                                >
                                                    {submittingComment ? (
                                                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                                    ) : (
                                                        <Send className="mr-1.5 h-3.5 w-3.5" />
                                                    )}
                                                    {submittingComment ? 'Mengirim...' : 'Kirim Komentar'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Comments Section */}
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <CardHeader className="pb-2 px-5 md:px-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-semibold flex items-center gap-2.5">
                                            <div className={`rounded-lg p-1.5 ${BRAND.bgLight} ${BRAND.darkBgLight}`}>
                                                <MessageCircle className={`h-4 w-4 ${BRAND.text} ${BRAND.darkText}`} />
                                            </div>
                                            Diskusi
                                            <span className={`text-sm font-normal ${BRAND.text} ${BRAND.darkText}`}>
                                                ({commentsCount})
                                            </span>
                                        </h3>
                                        <Badge variant="outline" className="text-xs gap-1">
                                            <Clock className="h-3 w-3" />
                                            Terbaru
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="px-5 md:px-8 pb-6">
                                    {post.comments && post.comments.length > 0 ? (
                                        <div className="divide-y divide-border/60">
                                            {post.comments.map((comment) => (
                                                <CommentItem key={comment.id} comment={comment} postId={post.id} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className={`rounded-2xl p-5 ${BRAND.bgLight} ${BRAND.darkBgLight} mb-4`}>
                                                <MessageCircle className={`h-10 w-10 ${BRAND.text} ${BRAND.darkText}`} />
                                            </div>
                                            <p className="font-semibold">Belum ada komentar</p>
                                            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                                                Jadilah yang pertama memberikan tanggapan pada diskusi ini
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tiptap Styles for comment content and editors */}
            <style>{`
                .tiptap p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: var(--muted-foreground);
                    opacity: 0.4;
                    pointer-events: none;
                    height: 0;
                }
                .tiptap img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 0.75rem auto;
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

function getUniqueParticipants(comments: CommentType[]): number {
    const ids = new Set<number>();
    function collect(list: CommentType[]) {
        for (const c of list) {
            ids.add(c.user.id);
            if (c.replies) collect(c.replies);
        }
    }
    collect(comments ?? []);
    return ids.size;
}
