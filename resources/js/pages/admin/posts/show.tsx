import { Head, router, usePage } from '@inertiajs/react';
import { EditorContent } from '@tiptap/react';
import { ArrowLeft, Calendar, Clock, Eye, EyeOff, Loader2, MessageCircle, MoreHorizontal, Paperclip, Pencil, Send, Share2, ThumbsUp, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { AttachmentCard } from './_components/AttachmentCard';
import type { Attachment } from './_components/AttachmentCard';
import { CommentEditorToolbar } from './_components/CommentEditorToolbar';
import { CommentItem } from './_components/CommentItem';
import type { CommentType } from './_components/CommentItem';
import { TiptapStyles } from './_components/TiptapStyles';
import { useCommentEditor } from './_components/useCommentEditor';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Posts', href: '/posts' },
    { title: 'Detail Diskusi', href: '#' },
];

const BRAND = {
    bg: 'bg-[#1548d7]', bgHover: 'hover:bg-[#1237b0]', text: 'text-[#1548d7]',
    bgLight: 'bg-[#1548d7]/10', darkText: 'dark:text-[#6b93f5]', darkBgLight: 'dark:bg-[#1548d7]/20',
};

type PostData = {
    id: number; title: string; content: string; views: number;
    is_hidden: boolean; created_at: string; comments_count: number;
    user: { id: number; name: string; specialization: string | null; bio: string | null; posts_count: number; comments_count: number };
    categories: { id: number; name: string; slug: string }[];
    attachments: Attachment[];
    comments: CommentType[];
};

type PageProps = { post: PostData };

function getInitials(name: string) {
    return name.split(' ').filter((_, i) => i < 2).map((w) => w[0]).join('').toUpperCase();
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }) + ' WIB';
}

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
        router.post('/comments', { post_id: post.id, content: html }, {
            preserveScroll: true,
            onSuccess: () => commentEditor.commands.clearContent(),
            onFinish: () => setSubmittingComment(false),
        });
    }, [commentEditor, post.id]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title} />
            <div className="flex flex-col gap-0 p-0">
                {/* Hero */}
                <div className="relative overflow-hidden bg-linear-to-br from-primary via-primary to-[#3b6ef5]">
                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />
                    <div className="relative mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
                        <Button variant="ghost" size="sm" className="mb-4 text-white/70 hover:text-white hover:bg-white/10" asChild>
                            <a href="/posts"><ArrowLeft className="mr-1.5 h-4 w-4" />Kembali ke Diskusi</a>
                        </Button>
                        <div className="flex items-start gap-2 mb-3 flex-wrap">
                            {post.categories.map((cat) => (
                                <Badge key={cat.id} className="bg-white/15 text-white border-white/20 text-xs backdrop-blur-sm">{cat.name}</Badge>
                            ))}
                            {post.is_hidden && (
                                <Badge className="bg-red-500/30 text-white border-red-300/30 text-xs">
                                    <EyeOff className="mr-1 h-3 w-3" />Hidden
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug mb-4 max-w-3xl">{post.title}</h1>
                        <div className="flex items-center gap-3 mb-5">
                            <Avatar className="h-10 w-10 ring-2 ring-white/30 shadow-lg">
                                <AvatarFallback className="bg-white/20 text-white font-semibold text-sm backdrop-blur-sm">{userInitials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold text-white">{post.user.name}</p>
                                <div className="flex items-center gap-2 text-xs text-white/60">
                                    {post.user.specialization && <><span>{post.user.specialization}</span><span>•</span></>}
                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(post.created_at)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {[
                                { icon: Eye, label: `${post.views.toLocaleString('id-ID')} views` },
                                { icon: MessageCircle, label: `${commentsCount} komentar` },
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs text-white/80">
                                    <stat.icon className="h-3.5 w-3.5" />{stat.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6">
                    <div className="flex flex-col gap-6 min-w-0">
                        {/* Article Actions + Body */}
                        <CardContent className="p-5 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5"><ThumbsUp className="h-3.5 w-3.5" />Suka</Button>
                                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5"><Share2 className="h-3.5 w-3.5" />Share</Button>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5"><MoreHorizontal className="h-3.5 w-3.5" />Kelola</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                        <DropdownMenuItem asChild>
                                            <a href={`/posts/${post.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit Diskusi</a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem><EyeOff className="mr-2 h-4 w-4" />Sembunyikan</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <Separator className="mb-6" />
                            <article
                                className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-[1.8] text-[15px]"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                            {post.attachments?.length > 0 && (
                                <div className="mt-8 pt-6 border-t">
                                    <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                        <div className={`rounded-lg p-1.5 ${BRAND.bgLight} ${BRAND.darkBgLight}`}>
                                            <Paperclip className={`h-4 w-4 ${BRAND.text} ${BRAND.darkText}`} />
                                        </div>
                                        Lampiran ({post.attachments.length})
                                    </h4>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {post.attachments.map((att) => <AttachmentCard key={att.id} attachment={att} />)}
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        {/* Comment Input */}
                        <CardHeader className="pb-0 pt-5 px-5 md:px-8">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Pencil className={`h-4 w-4 ${BRAND.text} ${BRAND.darkText}`} />Tulis Komentar
                            </h3>
                        </CardHeader>
                        <CardContent className="p-5 md:px-8 md:pb-6">
                            <div className="flex gap-3 items-start">
                                <Avatar className="h-9 w-9 shrink-0 ring-2 ring-background shadow-sm mt-0.5">
                                    <AvatarFallback className={`${BRAND.bg} text-white text-xs font-semibold`}>AD</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-3">
                                    <div className="rounded-xl border bg-muted/20 dark:bg-muted/10 overflow-hidden transition-colors focus-within:border-[#1548d7]/40 focus-within:shadow-sm">
                                        <CommentEditorToolbar editor={commentEditor} />
                                        <EditorContent editor={commentEditor} />
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <Button className={`${BRAND.bg} ${BRAND.bgHover} text-white shadow-md text-xs h-8`} onClick={handleSubmitComment} disabled={submittingComment}>
                                            {submittingComment ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-1.5 h-3.5 w-3.5" />}
                                            {submittingComment ? 'Mengirim...' : 'Kirim Komentar'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        {/* Comments List */}
                        <CardHeader className="pb-2 px-5 md:px-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold flex items-center gap-2.5">
                                    <div className={`rounded-lg p-1.5 ${BRAND.bgLight} ${BRAND.darkBgLight}`}>
                                        <MessageCircle className={`h-4 w-4 ${BRAND.text} ${BRAND.darkText}`} />
                                    </div>
                                    Diskusi <span className={`text-sm font-normal ${BRAND.text} ${BRAND.darkText}`}>({commentsCount})</span>
                                </h3>
                                <Badge variant="outline" className="text-xs gap-1"><Clock className="h-3 w-3" />Terbaru</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="px-5 md:px-8 pb-6">
                            {post.comments?.length > 0 ? (
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
                                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">Jadilah yang pertama memberikan tanggapan pada diskusi ini</p>
                                </div>
                            )}
                        </CardContent>
                    </div>
                </div>
            </div>
            <TiptapStyles />
        </AppLayout>
    );
}
