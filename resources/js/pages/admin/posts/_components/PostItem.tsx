import { router } from '@inertiajs/react';
import { Calendar, Eye, EyeOff, Flame, MessageCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { BRAND, formatDate, getCatColor, getInitials, stripHtml, type Post } from './types';

export function PostItem({ post, canEdit }: { post: Post, canEdit: boolean }) {
    const isTrending = post.views > 2000;
    const initials = getInitials(post.user.name);
    const contentPreview = stripHtml(post.content);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    return (
        <article className={`group relative border-b border-border/60 last:border-b-0 ${post.is_hidden ? 'opacity-60' : ''}`}>
            <div className="flex gap-4 px-5 py-5 transition-colors hover:bg-accent/40">
                {/* Main content */}
                <div className="flex-1 min-w-0">
                    {/* Author row */}
                    <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                        <Avatar className="h-7 w-7 ring-1 ring-border shadow-sm">
                            {post.user.profile_photo && (
                                <AvatarImage src={`/storage/${post.user.profile_photo}`} alt={post.user.name} className="object-cover" />
                            )}
                            <AvatarFallback className={`${BRAND.bg} text-white text-[9px] font-semibold`}>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate">{post.user.name}</span>
                        {post.categories.map((cat) => {
                            const catColor = getCatColor(cat.name);
                            return (
                                <Badge key={cat.id} className={`${catColor.bg} ${catColor.text} border-0 text-[11px] font-medium gap-1 py-0.5`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${catColor.dot}`} />
                                    {cat.name}
                                </Badge>
                            );
                        })}
                        {post.is_hidden && (
                            <Badge variant="destructive" className="text-[10px] gap-1 py-0.5">
                                <EyeOff className="h-3 w-3" />
                                Hidden
                            </Badge>
                        )}
                        {isTrending && !post.is_hidden && (
                            <Badge className="bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border-0 text-[10px] gap-1 py-0.5">
                                <Flame className="h-3 w-3" />
                                Trending
                            </Badge>
                        )}
                    </div>

                    {/* Title */}
                    <a href={`/posts/${post.id}`} className="block">
                        <h3 className="text-lg font-bold leading-snug mb-1.5 line-clamp-2 transition-colors group-hover:text-[#1548d7] dark:group-hover:text-[#6b93f5]">
                            {post.title}
                        </h3>
                    </a>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                        {contentPreview}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(post.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5" />
                            <span className="font-medium">{post.views.toLocaleString('id-ID')}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span className="font-medium">{post.comments_count}</span>
                        </span>
                    </div>
                </div>

                {/* Actions */}
                {canEdit && (
                    <div className="flex flex-col items-end justify-between shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 transition-opacity"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem asChild>
                                    <a href={`/posts/${post.id}/edit`}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive cursor-pointer"
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setShowDeleteAlert(true);
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

            </div>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Diskusi</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus diskusi ini? Tindakan ini tidak dapat dibatalkan dan semua data beserta komentar di dalamnya akan terhapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.delete(`/posts/${post.id}`, { preserveScroll: true })}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </article>
    );
}
