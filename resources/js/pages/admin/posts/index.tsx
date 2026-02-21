import { Head, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
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
    Trash2,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    { title: 'Posts', href: '/posts' },
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

function PostCard({ post }: { post: Post }) {
    const catColor = getCatColor(post.category.name);
    const isTrending = post.views > 2000;
    const initials = getInitials(post.user.name);
    const contentPreview = stripHtml(post.content);

    return (
        <Card
            className={`group relative overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${post.is_hidden ? 'opacity-60' : ''}`}
        >
            <div className={`h-1 bg-linear-to-r ${post.is_hidden
                ? 'from-gray-400 to-gray-300 dark:from-gray-600 dark:to-gray-500'
                : 'from-[#1548d7] to-[#3b6ef5]'
                }`} />

            <CardContent className="p-5">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge className={`${catColor.bg} ${catColor.text} border-0 text-[11px] font-medium gap-1`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${catColor.dot}`} />
                            {post.category.name}
                        </Badge>
                        {post.is_hidden && (
                            <Badge variant="destructive" className="text-[11px] gap-1">
                                <EyeOff className="h-3 w-3" />
                                Hidden
                            </Badge>
                        )}
                        {isTrending && !post.is_hidden && (
                            <Badge className="bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border-0 text-[11px] gap-1">
                                <Flame className="h-3 w-3" />
                                Trending
                            </Badge>
                        )}
                    </div>

                    <h3 className="font-bold leading-snug mb-2 text-base line-clamp-2 transition-colors group-hover:text-[#1548d7] dark:group-hover:text-[#6b93f5]">
                        {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                        {contentPreview}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5" />
                            <span className="font-medium">{formatViews(post.views)}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span className="font-medium">{post.comments_count}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(post.created_at)}</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm">
                            <AvatarFallback className={`${BRAND.bg} text-white text-[10px] font-semibold`}>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate max-w-[140px]">{post.user.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 text-xs ${BRAND.text} ${BRAND.darkText} gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}
                            asChild
                        >
                            <a href={`/posts/${post.id}`}>
                                Detail
                                <ArrowRight className="h-3.5 w-3.5" />
                            </a>
                        </Button>
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
                    </div>
                </div>
            </CardContent>
        </Card>
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

            router.get('/posts', params, { preserveState: true, preserveScroll: true });
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
            <Head title="Kelola Diskusi" />
            <div className="flex flex-col gap-0">
                {/* ═══════════════ Hero Header ═══════════════ */}
                <div className="relative overflow-hidden border-b">
                    <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="rounded-lg bg-[#1548d7]/10 dark:bg-[#6b93f5]/10 p-2">
                                        <Sparkles className="h-5 w-5 text-[#1548d7] dark:text-[#6b93f5]" />
                                    </div>
                                    <h1 className="text-xl md:text-2xl font-bold">Kelola Diskusi</h1>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Kelola semua diskusi forum dokter di satu tempat
                                </p>
                            </div>
                            <Button
                                className="bg-[#1548d7] hover:bg-[#1240b8] text-white shadow-md"
                                asChild
                            >
                                <a href="/posts/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Buat Diskusi Baru
                                </a>
                            </Button>
                        </div>

                        {/* Stat Pills */}
                        <div className="flex items-center gap-3 mt-4 flex-wrap">
                            {[
                                { label: `${posts.meta.total} Total`, icon: Sparkles },
                                { label: `Halaman ${posts.meta.current_page}/${posts.meta.last_page}`, icon: Filter },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground font-medium"
                                >
                                    <stat.icon className="h-3.5 w-3.5" />
                                    {stat.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══════════════ Content Area ═══════════════ */}
                <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-6 flex flex-col gap-6">
                    {/* Filters Bar */}
                    {/* <Card className="border-0 shadow-lg overflow-hidden"> */}
                        <CardContent className="py-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari judul atau penulis..."
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
                        </CardContent>
                    {/* </Card> */}

                    {/* Posts Grid */}
                    {posts.data.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {posts.data.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <Card className="border-0 shadow-lg">
                            <CardContent className="flex flex-col items-center justify-center py-20">
                                <div className={`rounded-2xl p-5 ${BRAND.bgLight} ${BRAND.darkBgLight} mb-5`}>
                                    <Search className={`h-10 w-10 ${BRAND.text} ${BRAND.darkText}`} />
                                </div>
                                <h3 className="text-lg font-bold mb-1">Tidak ada diskusi ditemukan</h3>
                                <p className="text-sm text-muted-foreground text-center max-w-md">
                                    Coba ubah filter pencarian atau kategori untuk menemukan diskusi yang Anda cari.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-5"
                                    onClick={() => {
                                        setSearch('');
                                        router.get('/posts', {}, { preserveState: true });
                                    }}
                                >
                                    Reset Filter
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination */}
                    {posts.data.length > 0 && (
                        // <Card className="border-0 shadow-lg">
                            <CardContent className="py-4">
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
                            </CardContent>
                        // </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
