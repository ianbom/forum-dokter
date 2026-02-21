import { Head, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowUpRight,
    BarChart3,
    Clock,
    Eye,
    FileText,
    FolderOpen,
    MessageCircle,
    TrendingUp,
    Users,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type RecentPost = {
    id: number;
    title: string;
    views: number;
    comments_count: number;
    is_hidden: boolean;
    created_at: string;
    user: { name: string; profile_photo: string | null } | null;
    category: { name: string; slug: string } | null;
};

type TopCategory = {
    name: string;
    slug: string;
    posts_count: number;
};

type PostPerDay = {
    date: string;
    count: number;
};

type DashboardProps = {
    stats: {
        totalUsers: number;
        totalPosts: number;
        totalComments: number;
        totalCategories: number;
        usersThisMonth: number;
        postsThisMonth: number;
        commentsThisMonth: number;
    };
    recentPosts: RecentPost[];
    topCategories: TopCategory[];
    postsPerDay: PostPerDay[];
};

function getInitials(name: string) {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    gradient,
    iconColor,
}: {
    title: string;
    value: number;
    subtitle: string;
    icon: React.ElementType;
    gradient: string;
    iconColor: string;
}) {
    return (
        <Card className="group relative overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className={`absolute inset-0 opacity-[0.07] ${gradient}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-sm font-medium">{title}</CardDescription>
                <div className={`rounded-xl p-2.5 ${iconColor} bg-opacity-10`}>
                    <Icon className="h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold tracking-tight">{value.toLocaleString('id-ID')}</div>
                <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="font-medium text-emerald-500">{subtitle}</span>
                </div>
            </CardContent>
        </Card>
    );
}

function MiniBarChart({ data }: { data: PostPerDay[] }) {
    const maxCount = Math.max(...data.map((d) => d.count), 1);

    return (
        <div className="flex items-end gap-2 h-36 px-1">
            {data.map((item, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground">{item.count}</span>
                    <div className="relative w-full rounded-t-lg overflow-hidden" style={{ height: `${Math.max((item.count / maxCount) * 100, 8)}%` }}>
                        <div className="absolute inset-0 bg-linear-to-t from-blue-600 to-indigo-400 dark:from-blue-500 dark:to-indigo-300 opacity-90 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">{item.date}</span>
                </div>
            ))}
            {data.length === 0 && (
                <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                    Belum ada data
                </div>
            )}
        </div>
    );
}

export default function Dashboard() {
    const { stats, recentPosts, topCategories, postsPerDay } = usePage<{ props: DashboardProps }>().props as unknown as DashboardProps;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 md:p-8 text-white shadow-xl">
                    <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity className="h-5 w-5 text-blue-200" />
                            <span className="text-sm font-medium text-blue-200">Forum Overview</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="mt-2 text-sm text-blue-100/90 max-w-lg">
                            Pantau aktivitas forum, kelola diskusi, dan lihat statistik komunitas Anda secara real-time.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Pengguna"
                        value={stats.totalUsers}
                        subtitle={`+${stats.usersThisMonth} bulan ini`}
                        icon={Users}
                        gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                        iconColor="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50"
                    />
                    <StatCard
                        title="Total Diskusi"
                        value={stats.totalPosts}
                        subtitle={`+${stats.postsThisMonth} bulan ini`}
                        icon={FileText}
                        gradient="bg-gradient-to-br from-violet-500 to-purple-500"
                        iconColor="text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/50"
                    />
                    <StatCard
                        title="Total Komentar"
                        value={stats.totalComments}
                        subtitle={`+${stats.commentsThisMonth} bulan ini`}
                        icon={MessageCircle}
                        gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
                        iconColor="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50"
                    />
                    <StatCard
                        title="Kategori"
                        value={stats.totalCategories}
                        subtitle="Kategori aktif"
                        icon={FolderOpen}
                        gradient="bg-gradient-to-br from-orange-500 to-amber-500"
                        iconColor="text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50"
                    />
                </div>

                {/* Charts & Sidebar Row */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Posts Chart */}
                    <Card className="group lg:col-span-2 border-0 shadow-md">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-indigo-500" />
                                        Aktivitas Diskusi
                                    </CardTitle>
                                    <CardDescription className="mt-1">Jumlah diskusi dalam 7 hari terakhir</CardDescription>
                                </div>
                                <Badge variant="secondary" className="text-xs">7 Hari</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <MiniBarChart data={postsPerDay} />
                        </CardContent>
                    </Card>

                    {/* Top Categories */}
                    <Card className="border-0 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-emerald-500" />
                                Kategori Populer
                            </CardTitle>
                            <CardDescription>Berdasarkan jumlah diskusi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topCategories.length > 0 ? (
                                <div className="space-y-4">
                                    {topCategories.map((cat, index) => {
                                        const maxPosts = Math.max(...topCategories.map((c) => c.posts_count), 1);
                                        const percentage = (cat.posts_count / maxPosts) * 100;
                                        const colors = [
                                            'from-blue-500 to-indigo-500',
                                            'from-violet-500 to-purple-500',
                                            'from-emerald-500 to-teal-500',
                                            'from-orange-500 to-amber-500',
                                            'from-rose-500 to-pink-500',
                                        ];

                                        return (
                                            <div key={cat.slug} className="space-y-1.5">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium truncate mr-2">{cat.name}</span>
                                                    <span className="text-muted-foreground shrink-0">{cat.posts_count} diskusi</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full bg-linear-to-r ${colors[index % colors.length]} transition-all duration-500`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">Belum ada kategori</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Posts */}
                <Card className="border-0 shadow-md">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-500" />
                                    Diskusi Terbaru
                                </CardTitle>
                                <CardDescription className="mt-1">5 diskusi terbaru di forum</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentPosts.length > 0 ? (
                            <div className="space-y-1">
                                {/* Table Header */}
                                <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <div className="col-span-5">Judul</div>
                                    <div className="col-span-2">Kategori</div>
                                    <div className="col-span-2 text-center">Interaksi</div>
                                    <div className="col-span-1 text-center">Status</div>
                                    <div className="col-span-2 text-right">Waktu</div>
                                </div>

                                {recentPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="group/row grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-muted/50"
                                    >
                                        {/* Title + Author */}
                                        <div className="md:col-span-5 flex items-center gap-3 min-w-0">
                                            <Avatar className="h-9 w-9 shrink-0 ring-2 ring-background shadow-sm">
                                                {post.user?.profile_photo ? (
                                                    <AvatarImage src={post.user.profile_photo} alt={post.user.name} />
                                                ) : null}
                                                <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                                                    {post.user ? getInitials(post.user.name) : '?'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold group-hover/row:text-blue-600 dark:group-hover/row:text-blue-400 transition-colors">
                                                    {post.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    oleh {post.user?.name ?? 'Anonim'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <div className="md:col-span-2 flex items-center">
                                            {post.category ? (
                                                <Badge variant="secondary" className="text-xs truncate max-w-full">
                                                    {post.category.name}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </div>

                                        {/* Interactions */}
                                        <div className="md:col-span-2 flex items-center justify-center gap-3">
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground" title="Views">
                                                <Eye className="h-3.5 w-3.5" />
                                                {post.views}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground" title="Komentar">
                                                <MessageCircle className="h-3.5 w-3.5" />
                                                {post.comments_count}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <div className="md:col-span-1 flex items-center justify-center">
                                            <Badge variant={post.is_hidden ? 'destructive' : 'default'} className="text-[10px] px-2">
                                                {post.is_hidden ? 'Hidden' : 'Aktif'}
                                            </Badge>
                                        </div>

                                        {/* Timestamp */}
                                        <div className="md:col-span-2 flex items-center justify-end">
                                            <span className="text-xs text-muted-foreground">{post.created_at}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
                                <p className="text-sm font-medium text-muted-foreground">Belum ada diskusi</p>
                                <p className="text-xs text-muted-foreground/70 mt-1">Diskusi baru akan muncul disini</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
