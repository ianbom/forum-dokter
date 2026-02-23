import { Flame, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BRAND, getInitials, type Post } from './types';

export function TrendingSidebar({ trendingPosts }: { trendingPosts: Post[] }) {
    if (!trendingPosts || trendingPosts.length === 0) return null;

    return (
        <div className="sticky shadow-xs">
            <CardHeader className="pb-3 px-5 pt-5 relative overflow-hidden bg-linear-to-b from-[#1548d7]/5 dark:from-[#6b93f5]/5 to-transparent">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <div className={`rounded-md p-1.5 ${BRAND.bg} text-white shadow-xs`}>
                        <Flame className="h-3.5 w-3.5" />
                    </div>
                    Top Diskusi
                </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
                <div className="flex flex-col gap-4">
                    {trendingPosts.map((post, index) => {
                        const initials = getInitials(post.user.name);
                        return (
                            <a
                                key={post.id}
                                href={`/posts/${post.id}`}
                                className="group flex flex-col gap-2 p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start gap-2.5">
                                    <div className="flex bg-muted text-muted-foreground font-mono text-xs font-bold leading-none w-5 h-5 items-center justify-center rounded-sm shrink-0 mt-0.5 group-hover:bg-[#1548d7] group-hover:text-white transition-colors">
                                        {index + 1}
                                    </div>
                                    <h4 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground/90 group-hover:text-[#1548d7] dark:group-hover:text-[#6b93f5] transition-colors">
                                        {post.title}
                                    </h4>
                                </div>
                                <div className="flex items-center justify-between pl-7.5">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-5 w-5 ring-1 ring-border shadow-xs">
                                            {post.user.profile_photo && (
                                                <AvatarImage src={`/storage/${post.user.profile_photo}`} alt={post.user.name} className="object-cover" />
                                            )}
                                            <AvatarFallback className={`${BRAND.bgLight} ${BRAND.text} ${BRAND.darkBgLight} ${BRAND.darkText} text-[8px] font-semibold`}>
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-muted-foreground font-medium truncate max-w-[100px]">{post.user.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </CardContent>
        </div>
    );
}
