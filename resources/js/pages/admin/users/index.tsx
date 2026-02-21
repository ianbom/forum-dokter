import { Head } from '@inertiajs/react';
import {
    MoreHorizontal,
    Pencil,
    Search,
    Shield,
    Trash2,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';
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
    created_at: string;
};

const dummyUsers: User[] = [
    {
        id: 1,
        name: 'Dr. Andi Pratama',
        email: 'andi.pratama@hospital.id',
        specialization: 'Pediatri',
        bio: 'Dokter spesialis anak dengan pengalaman 12 tahun di RS Jakarta.',
        role: 'admin',
        created_at: '2026-01-05',
    },
    {
        id: 2,
        name: 'Dr. Siti Nurhaliza',
        email: 'siti.nurhaliza@hospital.id',
        specialization: 'Kardiologi',
        bio: 'Ahli kardiologi interventional, fokus pada pemasangan stent jantung.',
        role: 'user',
        created_at: '2026-01-10',
    },
    {
        id: 3,
        name: 'Dr. Budi Santoso',
        email: 'budi.santoso@hospital.id',
        specialization: 'Endokrinologi',
        bio: 'Spesialis endokrin dan metabolik, peneliti aktif di bidang diabetes.',
        role: 'user',
        created_at: '2026-01-15',
    },
    {
        id: 4,
        name: 'Dr. Rina Wulandari',
        email: 'rina.wulandari@hospital.id',
        specialization: 'Neurologi',
        bio: 'Neurolog dengan sub-spesialisasi stroke dan penyakit neurodegeneratif.',
        role: 'user',
        created_at: '2026-01-22',
    },
    {
        id: 5,
        name: 'Dr. Hendra Wijaya',
        email: 'hendra.wijaya@hospital.id',
        specialization: 'Urologi',
        bio: 'Spesialis urologi dengan keahlian bedah minimal invasif.',
        role: 'user',
        created_at: '2026-02-01',
    },
    {
        id: 6,
        name: 'Dr. Maya Sari',
        email: 'maya.sari@hospital.id',
        specialization: 'Dermatologi',
        bio: 'Dokter kulit dan kelamin dengan fokus pada dermatologi estetik.',
        role: 'admin',
        created_at: '2026-02-05',
    },
    {
        id: 7,
        name: 'Dr. Ahmad Fauzi',
        email: 'ahmad.fauzi@hospital.id',
        specialization: 'Imunologi',
        bio: 'Ahli imunologi dan alergi, aktif dalam program vaksinasi nasional.',
        role: 'user',
        created_at: '2026-02-10',
    },
    {
        id: 8,
        name: 'Dr. Lisa Permata',
        email: 'lisa.permata@hospital.id',
        specialization: 'Bedah Umum',
        bio: 'Dokter bedah umum dengan pengalaman 8 tahun di unit gawat darurat.',
        role: 'user',
        created_at: '2026-02-14',
    },
    {
        id: 9,
        name: 'Dr. Reza Firmansyah',
        email: 'reza.firmansyah@hospital.id',
        specialization: null,
        bio: null,
        role: 'user',
        created_at: '2026-02-18',
    },
    {
        id: 10,
        name: 'Dr. Dewi Anggraini',
        email: 'dewi.anggraini@hospital.id',
        specialization: 'Obstetri & Ginekologi',
        bio: 'Spesialis kebidanan dan kandungan dengan fokus pada kehamilan risiko tinggi.',
        role: 'user',
        created_at: '2026-02-20',
    },
];

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
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const filteredUsers = dummyUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            (user.specialization?.toLowerCase().includes(search.toLowerCase()) ?? false);
        const matchesRole =
            roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const totalUsers = dummyUsers.length;
    const adminCount = dummyUsers.filter((u) => u.role === 'admin').length;
    const userCount = dummyUsers.filter((u) => u.role === 'user').length;

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
                                <UserPlus className={`h-5 w-5 ${BRAND.text} ${BRAND.darkText}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalUsers}</p>
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
                                <p className="text-2xl font-bold">{adminCount}</p>
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
                                <p className="text-2xl font-bold">{userCount}</p>
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
                                        className="pl-9 w-full sm:w-72 focus-visible:ring-[#1548d7]/30"
                                    />
                                </div>
                                {/* Role Filter */}
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger className="w-full sm:w-36">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Role</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
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
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user, idx) => (
                                            <TableRow
                                                key={user.id}
                                                className="group transition-colors"
                                            >
                                                {/* Index */}
                                                <TableCell className="pl-6 font-medium text-muted-foreground">
                                                    {idx + 1}
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

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t px-6 py-3">
                            <p className="text-xs text-muted-foreground">
                                Menampilkan <span className="font-semibold">{filteredUsers.length}</span> dari{' '}
                                <span className="font-semibold">{totalUsers}</span> pengguna
                            </p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-8 text-xs" disabled>
                                    Sebelumnya
                                </Button>
                                <Button variant="outline" size="sm" className={`h-8 text-xs ${BRAND.bg} ${BRAND.bgHover} text-white border-0`}>
                                    1
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-xs" disabled>
                                    Selanjutnya
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
