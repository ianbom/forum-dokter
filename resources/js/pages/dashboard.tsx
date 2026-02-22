import { Head, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowUpRight,
    Clock,
    Eye,
    FileText,
    FolderOpen,
    MessageCircle,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

type RecentPost = {
    id: number;
    title: string;
    views: number;
    comments_count: number;
    is_hidden: boolean;
    created_at: string;
    user: { name: string; profile_photo: string | null } | null;
    categories: { name: string; slug: string }[];
};

type TopCategory = {
    name: string;
    slug: string;
    posts_count: number;
};

type ChartDataPoint = {
    date: string;
    users: number;
    posts: number;
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
    chartData: ChartDataPoint[];
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

/* ═══════════════════════════════════
   Interactive Area Chart Component
   ═══════════════════════════════════ */

const usersChartConfig = {
    users: {
        label: 'Pengguna Baru',
        color: 'oklch(0.448 0.238 264)',
    },
} satisfies ChartConfig;

const postsChartConfig = {
    posts: {
        label: 'Diskusi Baru',
        color: 'oklch(0.55 0.24 264)',
    },
} satisfies ChartConfig;

type TimeRange = '7d' | '30d' | '90d';

function InteractiveAreaChart({
    data,
    dataKey,
    config,
    title,
    description,
}: {
    data: ChartDataPoint[];
    dataKey: 'users' | 'posts';
    config: ChartConfig;
    title: string;
    description: string;
}) {
    const [timeRange, setTimeRange] = useState<TimeRange>('30d');

    const filteredData = useMemo(() => {
        const now = new Date();
        let daysToSubtract = 90;
        if (timeRange === '7d') daysToSubtract = 7;
        else if (timeRange === '30d') daysToSubtract = 30;

        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - daysToSubtract);

        return data.filter((item) => new Date(item.date) >= startDate);
    }, [data, timeRange]);

    const total = useMemo(
        () => filteredData.reduce((sum, item) => sum + item[dataKey], 0),
        [filteredData, dataKey],
    );

    return (
        <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-col gap-2 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription className="text-xs">{description}</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-2xl font-bold">{total.toLocaleString('id-ID')}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
                        <SelectTrigger className="w-[140px] h-8 text-xs" aria-label="Select time range">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">7 hari terakhir</SelectItem>
                            <SelectItem value="30d">30 hari terakhir</SelectItem>
                            <SelectItem value="90d">Semua (90 hari)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="pt-4 px-2 sm:px-6">
                <ChartContainer config={config} className="aspect-auto h-[220px] w-full">
                    <AreaChart data={filteredData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={`var(--color-${dataKey})`} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={`var(--color-${dataKey})`} stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value: string) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                            }}
                            className="text-xs"
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            width={30}
                            allowDecimals={false}
                            className="text-xs"
                        />
                        <ChartTooltip
                            cursor={{ stroke: 'var(--border)', strokeDasharray: '4 4' }}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value: string) => {
                                        return new Date(value).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey={dataKey}
                            type="monotone"
                            fill={`url(#fill-${dataKey})`}
                            stroke={`var(--color-${dataKey})`}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

/* ═════════════════════════
   Main Dashboard Component
   ═════════════════════════ */

export default function Dashboard() {
    const { stats, recentPosts, topCategories, chartData } = usePage<{ props: DashboardProps }>().props as unknown as DashboardProps;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#1548d7] via-[#1d5aef] to-[#3b6ef5] p-6 md:p-8 text-white shadow-xl">
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

                {/* Area Charts */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <InteractiveAreaChart
                        data={chartData}
                        dataKey="users"
                        config={usersChartConfig}
                        title="Pengguna Baru"
                        description="Jumlah pendaftaran pengguna baru per hari"
                    />
                    <InteractiveAreaChart
                        data={chartData}
                        dataKey="posts"
                        config={postsChartConfig}
                        title="Diskusi Baru"
                        description="Jumlah diskusi yang dibuat per hari"
                    />
                </div>

                {/* Categories & Recent Posts Row */}
                <div className="grid gap-6 lg:grid-cols-3">
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

                    {/* Recent Posts */}
                    <Card className="lg:col-span-2 border-0 shadow-md">
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
                                            <div className="md:col-span-5 flex items-center gap-3 min-w-0">
                                                <Avatar className="h-9 w-9 shrink-0 ring-2 ring-background shadow-sm">
                                                    {post.user?.profile_photo ? (
                                                        <AvatarImage src={post.user.profile_photo} alt={post.user.name} />
                                                    ) : null}
                                                    <AvatarFallback className="bg-linear-to-br from-[#1548d7] to-[#3b6ef5] text-white text-xs font-semibold">
                                                        {post.user ? getInitials(post.user.name) : '?'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold group-hover/row:text-[#1548d7] dark:group-hover/row:text-[#6b93f5] transition-colors">
                                                        {post.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        oleh {post.user?.name ?? 'Anonim'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 flex items-center gap-1.5 flex-wrap">
                                                {post.categories.length > 0 ? (
                                                    post.categories.map((cat) => (
                                                        <Badge key={cat.slug} variant="secondary" className="text-[10px] truncate max-w-[80px]">
                                                            {cat.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </div>

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

                                            <div className="md:col-span-1 flex items-center justify-center">
                                                <Badge variant={post.is_hidden ? 'destructive' : 'default'} className="text-[10px] px-2">
                                                    {post.is_hidden ? 'Hidden' : 'Aktif'}
                                                </Badge>
                                            </div>

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
            </div>
        </AppLayout>
    );
}
