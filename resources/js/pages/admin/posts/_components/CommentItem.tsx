import { router } from '@inertiajs/react';
import { EditorContent } from '@tiptap/react';
import { CornerDownRight, Loader2, MoreHorizontal, Pencil, Reply, Send, ThumbsUp, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AttachmentCard } from './AttachmentCard';
import type { Attachment } from './AttachmentCard';
import { CommentEditorToolbar } from './CommentEditorToolbar';
import { useCommentEditor } from './useCommentEditor';

const BRAND = {
    bg: 'bg-[#1548d7]',
    bgHover: 'hover:bg-[#1237b0]',
    text: 'text-[#1548d7]',
    bgLight: 'bg-[#1548d7]/10',
    darkText: 'dark:text-[#6b93f5]',
    darkBgLight: 'dark:bg-[#1548d7]/20',
};

export type CommentType = {
    id: number;
    user: { id: number; name: string; specialization: string | null; profile_photo?: string | null };
    content: string;
    created_at: string;
    attachments: Attachment[];
    replies: CommentType[];
};

function getInitials(name: string): string {
    return name.split(' ').filter((_, i) => i < 2).map((w) => w[0]).join('').toUpperCase();
}

function formatShortDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function CommentItem({ comment, postId, depth = 0 }: { comment: CommentType; postId: number; depth?: number }) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [submittingReply, setSubmittingReply] = useState(false);
    const [editing, setEditing] = useState(false);
    const [submittingEdit, setSubmittingEdit] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [liked, setLiked] = useState(false);

    const isNested = depth > 0;
    const initials = getInitials(comment.user.name);

    const replyEditor = useCommentEditor(`Balas ${comment.user.name}...`);
    const editEditor = useCommentEditor('Edit komentar...');

    const handleSubmitReply = useCallback(() => {
        if (!replyEditor) return;
        const html = replyEditor.getHTML();
        if (!html || html === '<p></p>') return;
        setSubmittingReply(true);
        router.post('/comments', { post_id: postId, parent_id: comment.id, content: html }, {
            preserveScroll: true,
            onSuccess: () => { replyEditor.commands.clearContent(); setReplyOpen(false); },
            onFinish: () => setSubmittingReply(false),
        });
    }, [replyEditor, postId, comment.id]);

    const handleStartEdit = useCallback(() => {
        editEditor?.commands.setContent(comment.content);
        setEditing(true);
    }, [editEditor, comment.content]);

    const handleCancelEdit = useCallback(() => {
        setEditing(false);
        editEditor?.commands.clearContent();
    }, [editEditor]);

    const handleSubmitEdit = useCallback(() => {
        if (!editEditor) return;
        const html = editEditor.getHTML();
        if (!html || html === '<p></p>') return;
        setSubmittingEdit(true);
        router.put(`/comments/${comment.id}`, { content: html }, {
            preserveScroll: true,
            onSuccess: () => setEditing(false),
            onFinish: () => setSubmittingEdit(false),
        });
    }, [editEditor, comment.id]);

    const handleDelete = useCallback(() => {
        if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return;
        setDeleting(true);
        router.delete(`/comments/${comment.id}`, { preserveScroll: true, onFinish: () => setDeleting(false) });
    }, [comment.id]);

    return (
        <div className={isNested ? 'ml-5 md:ml-8' : ''}>
            <div className="group relative py-5">
                {isNested && <div className="absolute -left-5 md:-left-8 top-0 bottom-0 w-px bg-border dark:bg-border/50" />}
                {isNested && <div className="absolute -left-5 md:-left-8 top-9 h-px w-4 md:w-7 bg-border dark:bg-border/50" />}

                <div className="flex gap-3">
                    <Avatar className={`${isNested ? 'h-8 w-8' : 'h-10 w-10'} shrink-0 ring-2 ring-background shadow-sm`}>
                        {comment.user.profile_photo && (
                            <AvatarImage src={`/storage/${comment.user.profile_photo}`} alt={comment.user.name} className="object-cover" />
                        )}
                        <AvatarFallback className={`${BRAND.bg} text-white text-xs font-semibold`}>{initials}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="rounded-2xl rounded-tl-sm bg-muted/50 dark:bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/70 dark:hover:bg-muted/40">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-sm font-semibold ${BRAND.text} ${BRAND.darkText}`}>{comment.user.name}</span>
                                    {comment.user.specialization && (
                                        <Badge className={`${BRAND.bgLight} ${BRAND.text} ${BRAND.darkBgLight} ${BRAND.darkText} border-0 text-[10px] font-medium px-1.5 py-0`}>
                                            {comment.user.specialization}
                                        </Badge>
                                    )}
                                    <span className="text-[11px] text-muted-foreground">{formatShortDate(comment.created_at)}</span>
                                </div>
                                {/* <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem onClick={handleStartEdit}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete} disabled={deleting}>
                                            <Trash2 className="mr-2 h-4 w-4" />{deleting ? 'Menghapus...' : 'Hapus'}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu> */}
                            </div>

                            {editing ? (
                                <div className="mt-2 space-y-2">
                                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                                        <CommentEditorToolbar editor={editEditor} />
                                        <EditorContent editor={editEditor} />
                                    </div>
                                    <div className="flex items-center justify-end gap-1.5">
                                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleCancelEdit}>Batal</Button>
                                        <Button size="sm" className={`h-7 text-xs ${BRAND.bg} ${BRAND.bgHover} text-white`} onClick={handleSubmitEdit} disabled={submittingEdit}>
                                            {submittingEdit ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Pencil className="mr-1 h-3 w-3" />}
                                            Simpan
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed text-foreground/85"
                                    dangerouslySetInnerHTML={{ __html: comment.content }}
                                />
                            )}

                            {comment.attachments?.length > 0 && (
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {comment.attachments.map((att) => <AttachmentCard key={att.id} attachment={att} />)}
                                </div>
                            )}
                        </div>

                        <div className="mt-1.5 flex items-center gap-0.5 px-1">
                            <Button variant="ghost" size="sm" className={`h-7 px-2 text-xs gap-1 ${liked ? `${BRAND.text} ${BRAND.darkText}` : 'text-muted-foreground'}`} onClick={() => setLiked(!liked)}>
                                <ThumbsUp className={`h-3.5 w-3.5 ${liked ? 'fill-current' : ''}`} />{liked ? 1 : 0}
                            </Button>
                            {!isNested && (
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground gap-1" onClick={() => setReplyOpen(!replyOpen)}>
                                    <Reply className="h-3.5 w-3.5" />Balas
                                </Button>
                            )}
                        </div>

                        {replyOpen && (
                            <div className="mt-2 ml-1 flex gap-2.5 items-start">
                                <CornerDownRight className="mt-3 h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                                        <CommentEditorToolbar editor={replyEditor} />
                                        <EditorContent editor={replyEditor} />
                                    </div>
                                    <div className="flex items-center justify-end gap-1.5">
                                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setReplyOpen(false); replyEditor?.commands.clearContent(); }}>Batal</Button>
                                        <Button size="sm" className={`h-7 text-xs ${BRAND.bg} ${BRAND.bgHover} text-white`} onClick={handleSubmitReply} disabled={submittingReply}>
                                            {submittingReply ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Send className="mr-1 h-3 w-3" />}
                                            Kirim
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {comment.replies?.map((reply) => (
                <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
            ))}
        </div>
    );
}
