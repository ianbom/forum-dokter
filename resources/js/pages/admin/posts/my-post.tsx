import { Head, router, usePage } from '@inertiajs/react';
import {
    Bookmark,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    Filter,
    Flame,
    MessageCircle,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    SortAsc,
    Sparkles,
    Stethoscope,
    Trash2,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Postingan Saya', href: '/my-posts' },
];

type Post = {
    id: number;
    title: string;
    content: string;
    views: number;
    is_hidden: boolean;
    created_at: string;
    user: { id: number; name: string };
    category: { id: number; name: string; slug: string };
    comments_count: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedPosts = {
    data: Post[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
        links: PaginationLink[];
    };
};

type Category = {
    id: number;
    name: string;
    slug: string;
};

type Filters = {
    search: string;
    category: string;
    status: string;
    sort: string;
    per_page: number;
};

type PageProps = {
    posts: PaginatedPosts;
    categories: Category[];
    filters: Filters;
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    Pediatri: { bg: 'bg-sky-500/10 dark:bg-sky-500/20', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-500' },
    Kardiologi: { bg: 'bg-rose-500/10 dark:bg-rose-500/20', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' },
    Endokrinologi: { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
    Urologi: { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
    Neurologi: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
    Imunologi: { bg: 'bg-orange-500/10 dark:bg-orange-500/20', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
    Bedah: { bg: 'bg-teal-500/10 dark:bg-teal-500/20', text: 'text-teal-700 dark:text-teal-300', dot: 'bg-teal-500' },
};

const DEFAULT_CAT_COLOR = { bg: 'bg-[#1548d7]/10 dark:bg-[#1548d7]/20', text: 'text-[#1548d7] dark:text-[#6b93f5]', dot: 'bg-[#1548d7]' };

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter((_, i) => i < 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

function formatViews(views: number): string {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views.toString();
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}

function getCatColor(name: string) {
    return CATEGORY_COLORS[name] ?? DEFAULT_CAT_COLOR;
}

const BRAND = {
    bg: 'bg-[#1548d7]',
    text: 'text-[#1548d7]',
    bgLight: 'bg-[#1548d7]/10',
    darkText: 'dark:text-[#6b93f5]',
    darkBgLight: 'dark:bg-[#1548d7]/20',
};

function PostItem({ post }: { post: Post }) {
    const catColor = getCatColor(post.category.name);
    const isTrending = post.views > 2000;
    const initials = getInitials(post.user.name);
    const contentPreview = stripHtml(post.content);

    return (
        <article className={`group relative border-b border-border/60 last:border-b-0 ${post.is_hidden ? 'opacity-60' : ''}`}>
            <div className="flex gap-4 px-5 py-5 transition-colors hover:bg-accent/40">
                {/* Main content */}
                <div className="flex-1 min-w-0">
                    {/* Author row */}
                    <div className="flex items-center gap-2.5 mb-2.5">
                        <Avatar className="h-7 w-7 ring-1 ring-border shadow-sm">
                            <AvatarFallback className={`${BRAND.bg} text-white text-[9px] font-semibold`}>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate">{post.user.name}</span>
                        <span className="text-xs text-muted-foreground">in</span>
                        <Badge className={`${catColor.bg} ${catColor.text} border-0 text-[11px] font-medium gap-1 py-0.5`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${catColor.dot}`} />
                            {post.category.name}
                        </Badge>
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

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(post.created_at)}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5" />
                            <span className="font-medium">{formatViews(post.views)}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span className="font-medium">{post.comments_count}</span>
                        </span>
                    </div>
                </div>

                {/* Right side actions */}
                <div className="flex flex-col items-end justify-between shrink-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem asChild>
                                <a href={`/posts/${post.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Lihat Detail
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                {post.is_hidden ? (
                                    <>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Tampilkan
                                    </>
                                ) : (
                                    <>
                                        <EyeOff className="mr-2 h-4 w-4" />
                                        Sembunyikan
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                        <Bookmark className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </article>
    );
}

export default function PostsIndex() {
    const { posts, categories, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search);

    const applyFilters = useCallback(
        (newFilters: Partial<Filters>) => {
            const params: Record<string, string> = {};

            const merged = { ...filters, ...newFilters };

            if (merged.search) params.search = merged.search;
            if (merged.category) params.category = merged.category;
            if (merged.status) params.status = merged.status;
            if (merged.sort && merged.sort !== 'latest') params.sort = merged.sort;
            if (merged.per_page && merged.per_page !== 12) params.per_page = String(merged.per_page);

            router.get('/my-posts', params, { preserveState: true, preserveScroll: true });
        },
        [filters],
    );

    const handleSearch = useCallback(() => {
        applyFilters({ search });
    }, [search, applyFilters]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') handleSearch();
        },
        [handleSearch],
    );

    const goToPage = useCallback(
        (url: string | null) => {
            if (url) router.get(url, {}, { preserveState: true, preserveScroll: true });
        },
        [],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Postingan Saya" />
            <div className="flex flex-col gap-0">
                {/* ═══════════════ Hero Banner (full width) ═══════════════ */}
                <div className="relative overflow-hidden bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] dark:from-[#0a0a14] dark:via-[#111827] dark:to-[#0a0a14]">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#1548d7]/30 blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-emerald-500/20 blur-3xl" />
                    </div>
                    <div className="relative flex items-center justify-between px-6 py-8 md:px-10 md:py-10">
                        <div className="max-w-xl">
                            <h1 className="text-2xl font-bold text-white md:text-3xl leading-tight mb-2">
                                Postingan Saya. <br />
                                <span className="text-slate-400">Semua diskusi yang Anda buat.</span>
                            </h1>
                            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-md">
                                Kelola semua diskusi yang pernah Anda bagikan di forum. Edit, sembunyikan, atau hapus kapan saja.
                            </p>
                            <Button
                                className="bg-[#1548d7] hover:bg-[#1240b8] text-white shadow-lg shadow-blue-500/25"
                                asChild
                            >
                                <a href="/posts/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Buat Diskusi Baru
                                </a>
                            </Button>
                        </div>
                        {/* Illustration */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="relative">
                                <div className="h-36 w-36 rounded-2xl bg-linear-to-br from-[#1548d7]/20 to-[#3b6ef5]/10 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <Stethoscope className="h-16 w-16 text-[#6b93f5]" />
                                </div>
                                <div className="absolute -top-3 -right-3 h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                    <MessageCircle className="h-4 w-4 text-emerald-400" />
                                </div>
                                <div className="absolute -bottom-3 -left-3 h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-amber-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ Search & Filter Bar ═══════════════ */}
                <div className="border-b border-border/60">
                    <div className="px-5 py-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari judul diskusi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="pl-9 focus-visible:ring-[#1548d7]/30"
                                />
                            </div>
                            <Separator orientation="vertical" className="hidden sm:block h-8" />
                            <Select
                                value={filters.category || '_all'}
                                onValueChange={(val) => applyFilters({ category: val === '_all' ? '' : val })}
                            >
                                <SelectTrigger className="w-full sm:w-44">
                                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="_all">Semua Kategori</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(val) => applyFilters({ status: val === 'all' ? '' : val })}
                            >
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="hidden">Tersembunyi</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.sort}
                                onValueChange={(val) => applyFilters({ sort: val })}
                            >
                                <SelectTrigger className="w-full sm:w-44">
                                    <SortAsc className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Terbaru</SelectItem>
                                    <SelectItem value="oldest">Terlama</SelectItem>
                                    <SelectItem value="most_viewed">Views Terbanyak</SelectItem>
                                    <SelectItem value="most_commented">Komentar Terbanyak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ Post Feed ═══════════════ */}
                {posts.data.length > 0 ? (
                    <div className="divide-y-0">
                        {posts.data.map((post) => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-5">
                        <div className={`rounded-2xl p-5 ${BRAND.bgLight} ${BRAND.darkBgLight} mb-5`}>
                            <Search className={`h-10 w-10 ${BRAND.text} ${BRAND.darkText}`} />
                        </div>
                        <h3 className="text-lg font-bold mb-1">Belum ada diskusi</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-md">
                            Anda belum membuat diskusi apapun. Mulai berbagi pengetahuan klinis sekarang!
                        </p>
                        <Button
                            variant="outline"
                            className="mt-5"
                            onClick={() => {
                                setSearch('');
                                router.get('/my-posts', {}, { preserveState: true });
                            }}
                        >
                            Reset Filter
                        </Button>
                    </div>
                )}

                {/* ═══════════════ Pagination ═══════════════ */}
                {posts.data.length > 0 && (
                    <div className="border-t border-border/60 px-5 py-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan <span className="font-semibold">{posts.meta.from}</span>–
                                <span className="font-semibold">{posts.meta.to}</span> dari{' '}
                                <span className="font-semibold">{posts.meta.total}</span> diskusi
                            </p>
                            {posts.meta.last_page > 1 && (
                                <div className="flex items-center gap-1">
                                    {posts.meta.links.map((link, i) => {
                                        if (i === 0) {
                                            return (
                                                <Button
                                                    key="prev"
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-9 w-9"
                                                    disabled={!link.url}
                                                    onClick={() => goToPage(link.url)}
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                            );
                                        }
                                        if (i === posts.meta.links.length - 1) {
                                            return (
                                                <Button
                                                    key="next"
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-9 w-9"
                                                    disabled={!link.url}
                                                    onClick={() => goToPage(link.url)}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            );
                                        }
                                        return (
                                            <Button
                                                key={link.label}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="icon"
                                                className={`h-9 w-9 ${link.active ? 'bg-[#1548d7] hover:bg-[#1237b0] text-white border-0' : ''}`}
                                                disabled={!link.url}
                                                onClick={() => goToPage(link.url)}
                                            >
                                                {link.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                            <Select
                                value={String(filters.per_page)}
                                onValueChange={(val) => applyFilters({ per_page: Number(val) })}
                            >
                                <SelectTrigger className="w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="6">6 / page</SelectItem>
                                    <SelectItem value="12">12 / page</SelectItem>
                                    <SelectItem value="24">24 / page</SelectItem>
                                    <SelectItem value="50">50 / page</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
