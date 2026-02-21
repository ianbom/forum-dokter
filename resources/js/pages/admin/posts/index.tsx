import { Head } from '@inertiajs/react';
import {
    Calendar,
    Eye,
    EyeOff,
    Filter,
    MessageCircle,
    MoreHorizontal,
    Pencil,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Posts', href: '/admin/posts' },
];

type Post = {
    id: number;
    title: string;
    content: string;
    views: number;
    is_hidden: boolean;
    created_at: string;
    user: { name: string; initials: string };
    category: { name: string; slug: string };
    comments_count: number;
};

const dummyPosts: Post[] = [
    {
        id: 1,
        title: 'Penanganan Awal Demam pada Anak di Bawah 5 Tahun',
        content: 'Demam merupakan salah satu keluhan paling umum pada anak. Orang tua perlu mengetahui langkah awal penanganan demam sebelum membawa anak ke dokter. Pemberian obat penurun panas yang tepat sangat penting...',
        views: 1240,
        is_hidden: false,
        created_at: '2026-02-21',
        user: { name: 'Dr. Andi Pratama', initials: 'AP' },
        category: { name: 'Pediatri', slug: 'pediatri' },
        comments_count: 24,
    },
    {
        id: 2,
        title: 'Manajemen Hipertensi pada Pasien Geriatri',
        content: 'Hipertensi pada pasien lanjut usia memerlukan pendekatan yang berbeda. Target tekanan darah dan pemilihan obat anti-hipertensi harus disesuaikan dengan kondisi komorbid dan risiko efek samping...',
        views: 890,
        is_hidden: false,
        created_at: '2026-02-20',
        user: { name: 'Dr. Siti Nurhaliza', initials: 'SN' },
        category: { name: 'Kardiologi', slug: 'kardiologi' },
        comments_count: 18,
    },
    {
        id: 3,
        title: 'Tatalaksana Terbaru Diabetes Melitus Tipe 2',
        content: 'Perkembangan terbaru dalam penatalaksanaan DM tipe 2 mencakup penggunaan inhibitor SGLT2 dan agonis GLP-1 yang menunjukkan manfaat kardiovaskular dan renal selain efek penurunan glukosa...',
        views: 2150,
        is_hidden: false,
        created_at: '2026-02-19',
        user: { name: 'Dr. Budi Santoso', initials: 'BS' },
        category: { name: 'Endokrinologi', slug: 'endokrinologi' },
        comments_count: 35,
    },
    {
        id: 4,
        title: 'Diagnosis Banding Nyeri Dada di IGD',
        content: 'Nyeri dada merupakan keluhan yang sering dijumpai di IGD dan memerlukan evaluasi cepat dan tepat. Dokter perlu membedakan antara sindrom koroner akut, diseksi aorta, emboli paru, dan penyebab lainnya...',
        views: 3420,
        is_hidden: false,
        created_at: '2026-02-18',
        user: { name: 'Dr. Rina Wulandari', initials: 'RW' },
        category: { name: 'Kardiologi', slug: 'kardiologi' },
        comments_count: 42,
    },
    {
        id: 5,
        title: 'Terapi Antibiotik Empiris pada Infeksi Saluran Kemih',
        content: 'Pemilihan antibiotik empiris pada ISK harus mempertimbangkan pola resistensi lokal. Panduan terbaru merekomendasikan penggunaan nitrofurantoin atau fosfomycin sebagai lini pertama ISK tanpa komplikasi...',
        views: 760,
        is_hidden: true,
        created_at: '2026-02-17',
        user: { name: 'Dr. Hendra Wijaya', initials: 'HW' },
        category: { name: 'Urologi', slug: 'urologi' },
        comments_count: 12,
    },
    {
        id: 6,
        title: 'Pendekatan Multidisiplin dalam Penanganan Stroke Akut',
        content: 'Penanganan stroke akut memerlukan kerjasama tim yang terkoordinasi antara dokter jaga IGD, neurolog, radiolog, dan perawat terlatih. Golden period dalam penanganan stroke iskemik adalah...',
        views: 1890,
        is_hidden: false,
        created_at: '2026-02-16',
        user: { name: 'Dr. Maya Sari', initials: 'MS' },
        category: { name: 'Neurologi', slug: 'neurologi' },
        comments_count: 29,
    },
    {
        id: 7,
        title: 'Vaksinasi COVID-19 Booster: Update Rekomendasi Terkini',
        content: 'WHO dan IDAI telah mengeluarkan rekomendasi terbaru mengenai vaksinasi booster COVID-19. Kelompok prioritas dan interval pemberian booster perlu disesuaikan dengan perkembangan varian virus...',
        views: 4560,
        is_hidden: false,
        created_at: '2026-02-15',
        user: { name: 'Dr. Ahmad Fauzi', initials: 'AF' },
        category: { name: 'Imunologi', slug: 'imunologi' },
        comments_count: 67,
    },
    {
        id: 8,
        title: 'Penanganan Luka Bakar Derajat II dan III',
        content: 'Luka bakar derajat II dan III memerlukan penanganan khusus untuk mencegah infeksi dan mempercepat penyembuhan. Debridement yang tepat dan pemilihan dressing modern sangat berpengaruh...',
        views: 530,
        is_hidden: true,
        created_at: '2026-02-14',
        user: { name: 'Dr. Lisa Permata', initials: 'LP' },
        category: { name: 'Bedah', slug: 'bedah' },
        comments_count: 8,
    },
];

const categories = ['Semua', 'Pediatri', 'Kardiologi', 'Endokrinologi', 'Urologi', 'Neurologi', 'Imunologi', 'Bedah'];

function formatViews(views: number): string {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views.toString();
}

const BRAND = {
    bg: 'bg-[#1548d7]',
    bgHover: 'hover:bg-[#1237b0]',
    text: 'text-[#1548d7]',
    border: 'border-[#1548d7]',
    ring: 'ring-[#1548d7]/20',
    bgLight: 'bg-[#1548d7]/10',
    darkText: 'dark:text-[#6b93f5]',
    darkBgLight: 'dark:bg-[#1548d7]/20',
};

export default function PostsIndex() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredPosts = dummyPosts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.user.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'Semua' || post.category.name === selectedCategory;
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && !post.is_hidden) ||
            (statusFilter === 'hidden' && post.is_hidden);
        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Diskusi" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kelola Diskusi</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {filteredPosts.length} dari {dummyPosts.length} diskusi ditampilkan
                        </p>
                    </div>
                    <Button className={`${BRAND.bg} ${BRAND.bgHover} text-white shadow-md`}>
                        + Buat Diskusi Baru
                    </Button>
                </div>

                {/* Filters Bar */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="py-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari judul atau penulis..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 focus-visible:ring-[#1548d7]/30"
                                />
                            </div>

                            {/* Category Filter */}
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full sm:w-44">
                                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Status Filter */}
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="hidden">Tersembunyi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Posts Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredPosts.map((post) => (
                            <Card
                                key={post.id}
                                className={`group relative overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${post.is_hidden ? 'opacity-70' : ''
                                    }`}
                            >
                                {/* Color accent top line */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#1548d7] to-[#3b6ef5] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <Avatar className="h-9 w-9 shrink-0 ring-2 ring-background shadow-sm">
                                                <AvatarFallback
                                                    className={`${BRAND.bg} text-white text-xs font-semibold`}
                                                >
                                                    {post.user.initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">{post.user.name}</p>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{post.created_at}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dropdown Menu */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44">
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Lihat Detail
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
                                </CardHeader>

                                <CardContent className="pb-3">
                                    {/* Category Badge + Status */}
                                    <div className="flex items-center gap-2 mb-2.5">
                                        <Badge
                                            className={`${BRAND.bgLight} ${BRAND.text} ${BRAND.darkBgLight} ${BRAND.darkText} border-0 text-[11px] font-medium`}
                                        >
                                            {post.category.name}
                                        </Badge>
                                        {post.is_hidden && (
                                            <Badge variant="destructive" className="text-[11px]">
                                                <EyeOff className="mr-1 h-3 w-3" />
                                                Hidden
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className={`font-semibold leading-snug line-clamp-2 mb-2 transition-colors group-hover:${BRAND.text}`}>
                                        {post.title}
                                    </h3>

                                    {/* Content Preview */}
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                        {post.content}
                                    </p>
                                </CardContent>

                                <CardFooter className="border-t pt-3 pb-4">
                                    <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5" title="Views">
                                                <Eye className="h-3.5 w-3.5" />
                                                <span className="font-medium">{formatViews(post.views)}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5" title="Komentar">
                                                <MessageCircle className="h-3.5 w-3.5" />
                                                <span className="font-medium">{post.comments_count}</span>
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`h-7 px-2.5 text-xs ${BRAND.text} ${BRAND.darkText} hover:${BRAND.bgLight}`}
                                        >
                                            Detail →
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className={`rounded-full p-4 ${BRAND.bgLight} ${BRAND.darkBgLight} mb-4`}>
                                <Search className={`h-8 w-8 ${BRAND.text} ${BRAND.darkText}`} />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">Tidak ada diskusi ditemukan</h3>
                            <p className="text-sm text-muted-foreground text-center max-w-sm">
                                Coba ubah filter pencarian atau kategori untuk menemukan diskusi yang Anda cari.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
