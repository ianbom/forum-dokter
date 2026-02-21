import { Head, router, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Pencil,
    Search,
    Shield,
    SortAsc,
    Trash2,
    UserPlus,
    Users,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
];

type User = {
    id: number;
    name: string;
    email: string;
    specialization: string | null;
    bio: string | null;
    role: 'admin' | 'user';
    posts_count: number;
    comments_count: number;
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedUsers = {
    data: User[];
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

type Filters = {
    search: string;
    role: string;
    sort: string;
    per_page: number;
};

type Counts = {
    total: number;
    admin: number;
    user: number;
};

type PageProps = {
    users: PaginatedUsers;
    counts: Counts;
    filters: Filters;
};

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const BRAND = {
    bg: 'bg-[#1548d7]',
    bgHover: 'hover:bg-[#1237b0]',
    text: 'text-[#1548d7]',
    bgLight: 'bg-[#1548d7]/10',
    darkText: 'dark:text-[#6b93f5]',
    darkBgLight: 'dark:bg-[#1548d7]/20',
};

export default function UsersIndex() {
    const { users, counts, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search);

    const applyFilters = useCallback(
        (newFilters: Partial<Filters>) => {
            const params: Record<string, string> = {};
            const merged = { ...filters, ...newFilters };

            if (merged.search) params.search = merged.search;
            if (merged.role) params.role = merged.role;
            if (merged.sort && merged.sort !== 'latest') params.sort = merged.sort;
            if (merged.per_page && merged.per_page !== 10) params.per_page = String(merged.per_page);

            router.get('/users', params, { preserveState: true, preserveScroll: true });
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
            <Head title="Kelola Pengguna" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kelola Pengguna</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola semua akun pengguna forum
                        </p>
                    </div>
                    <Button className={`${BRAND.bg} ${BRAND.bgHover} text-white shadow-md`}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Tambah Pengguna
                    </Button>
                </div>

                {/* Stats Summary */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="flex items-center gap-4 py-4">
                            <div className={`rounded-xl p-3 ${BRAND.bgLight} ${BRAND.darkBgLight}`}>
                                <Users className={`h-5 w-5 ${BRAND.text} ${BRAND.darkText}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{counts.total}</p>
                                <p className="text-xs text-muted-foreground">Total Pengguna</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="flex items-center gap-4 py-4">
                            <div className="rounded-xl p-3 bg-amber-500/10 dark:bg-amber-500/20">
                                <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{counts.admin}</p>
                                <p className="text-xs text-muted-foreground">Admin</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="flex items-center gap-4 py-4">
                            <div className="rounded-xl p-3 bg-emerald-500/10 dark:bg-emerald-500/20">
                                <UserPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{counts.user}</p>
                                <p className="text-xs text-muted-foreground">User Biasa</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Card */}
                <Card className="border-0 shadow-sm overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle className="text-base">Daftar Pengguna</CardTitle>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama, email, spesialisasi..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="pl-9 w-full sm:w-72 focus-visible:ring-[#1548d7]/30"
                                    />
                                </div>
                                {/* Role Filter */}
                                <Select
                                    value={filters.role || '_all'}
                                    onValueChange={(val) => applyFilters({ role: val === '_all' ? '' : val })}
                                >
                                    <SelectTrigger className="w-full sm:w-36">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="_all">Semua Role</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                    </SelectContent>
                                </Select>
                                {/* Sort */}
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
                                        <SelectItem value="name_asc">Nama A-Z</SelectItem>
                                        <SelectItem value="name_desc">Nama Z-A</SelectItem>
                                        <SelectItem value="most_posts">Post Terbanyak</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                                        <TableHead className="w-12 pl-6">#</TableHead>
                                        <TableHead className="min-w-[220px]">Pengguna</TableHead>
                                        <TableHead className="min-w-[160px]">Spesialisasi</TableHead>
                                        <TableHead className="min-w-[100px] text-center">Role</TableHead>
                                        <TableHead className="min-w-[110px]">Bergabung</TableHead>
                                        <TableHead className="w-12 pr-6 text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length > 0 ? (
                                        users.data.map((user, idx) => (
                                            <TableRow
                                                key={user.id}
                                                className="group transition-colors"
                                            >
                                                {/* Index */}
                                                <TableCell className="pl-6 font-medium text-muted-foreground">
                                                    {(users.meta.from ?? 0) + idx}
                                                </TableCell>

                                                {/* User Info */}
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 shrink-0 ring-2 ring-background shadow-sm">
                                                            <AvatarFallback
                                                                className={`${BRAND.bg} text-white text-xs font-semibold`}
                                                            >
                                                                {getInitials(user.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-sm truncate">
                                                                {user.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Specialization */}
                                                <TableCell>
                                                    {user.specialization ? (
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs font-medium"
                                                        >
                                                            {user.specialization}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">
                                                            Belum diisi
                                                        </span>
                                                    )}
                                                </TableCell>

                                                {/* Role */}
                                                <TableCell className="text-center">
                                                    {user.role === 'admin' ? (
                                                        <Badge className="bg-amber-500/15 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300 border-0 text-xs font-medium">
                                                            <Shield className="mr-1 h-3 w-3" />
                                                            Admin
                                                        </Badge>
                                                    ) : (
                                                        <Badge className={`${BRAND.bgLight} ${BRAND.text} ${BRAND.darkBgLight} ${BRAND.darkText} border-0 text-xs font-medium`}>
                                                            User
                                                        </Badge>
                                                    )}
                                                </TableCell>

                                                {/* Date */}
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="pr-6 text-right">
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
                                                            <DropdownMenuItem>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit Profil
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Shield className="mr-2 h-4 w-4" />
                                                                Ubah Role
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus Akun
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <div className={`rounded-full p-3 ${BRAND.bgLight} ${BRAND.darkBgLight}`}>
                                                        <Search className={`h-6 w-6 ${BRAND.text} ${BRAND.darkText}`} />
                                                    </div>
                                                    <p className="text-sm font-medium">Tidak ada pengguna ditemukan</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Coba ubah kata kunci pencarian atau filter
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Footer / Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t px-6 py-3 gap-3">
                            <p className="text-xs text-muted-foreground">
                                Menampilkan{' '}
                                <span className="font-semibold">{users.meta.from ?? 0}</span>–
                                <span className="font-semibold">{users.meta.to ?? 0}</span> dari{' '}
                                <span className="font-semibold">{users.meta.total}</span> pengguna
                            </p>
                            <div className="flex items-center gap-1">
                                {users.meta.links.map((link, i) => {
                                    if (i === 0) {
                                        return (
                                            <Button
                                                key="prev"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                disabled={!link.url}
                                                onClick={() => goToPage(link.url)}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                        );
                                    }
                                    if (i === users.meta.links.length - 1) {
                                        return (
                                            <Button
                                                key="next"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
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
                                            className={`h-8 w-8 text-xs ${link.active ? `${BRAND.bg} ${BRAND.bgHover} text-white border-0` : ''}`}
                                            disabled={!link.url}
                                            onClick={() => goToPage(link.url)}
                                        >
                                            {link.label}
                                        </Button>
                                    );
                                })}
                            </div>
                            <Select
                                value={String(filters.per_page)}
                                onValueChange={(val) => applyFilters({ per_page: Number(val) })}
                            >
                                <SelectTrigger className="w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 / hal</SelectItem>
                                    <SelectItem value="10">10 / hal</SelectItem>
                                    <SelectItem value="25">25 / hal</SelectItem>
                                    <SelectItem value="50">50 / hal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
