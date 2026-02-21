import { Head, router, usePage } from '@inertiajs/react';
import { FolderOpen, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { type FormEvent, useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    { title: 'Kategori', href: '/categories' },
];

type Category = {
    id: number;
    name: string;
    slug: string;
    posts_count: number;
    created_at: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PageProps = {
    categories: {
        data: Category[];
        links: PaginationLink[];
        meta?: {
            current_page: number;
            last_page: number;
            from: number | null;
            to: number | null;
            total: number;
        };
    };
    filters: {
        search: string;
        sort: string;
        per_page: number;
    };
};

function formatDate(dateStr: string | null) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function CategoryIndex() {
    const { categories, filters } = usePage<{ props: PageProps }>().props as unknown as PageProps;

    const [search, setSearch] = useState(filters.search);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [createName, setCreateName] = useState('');
    const [editName, setEditName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);

    const handleSearch = useCallback(
        (value: string) => {
            setSearch(value);
            router.get(
                '/categories',
                { search: value, sort: filters.sort, per_page: filters.per_page },
                { preserveState: true, replace: true },
            );
        },
        [filters.sort, filters.per_page],
    );

    const handleSort = useCallback(
        (value: string) => {
            router.get(
                '/categories',
                { search: filters.search, sort: value, per_page: filters.per_page },
                { preserveState: true, replace: true },
            );
        },
        [filters.search, filters.per_page],
    );

    const handlePerPage = useCallback(
        (value: string) => {
            router.get(
                '/categories',
                { search: filters.search, sort: filters.sort, per_page: value },
                { preserveState: true, replace: true },
            );
        },
        [filters.search, filters.sort],
    );

    const handleCreate = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            if (!createName.trim()) return;

            setSubmitting(true);
            router.post(
                '/categories',
                { name: createName.trim() },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setCreateOpen(false);
                        setCreateName('');
                    },
                    onFinish: () => setSubmitting(false),
                },
            );
        },
        [createName],
    );

    const handleOpenEdit = useCallback((cat: Category) => {
        setEditingCategory(cat);
        setEditName(cat.name);
        setEditOpen(true);
    }, []);

    const handleUpdate = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            if (!editingCategory || !editName.trim()) return;

            setSubmitting(true);
            router.put(
                `/categories/${editingCategory.id}`,
                { name: editName.trim() },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setEditOpen(false);
                        setEditingCategory(null);
                        setEditName('');
                    },
                    onFinish: () => setSubmitting(false),
                },
            );
        },
        [editingCategory, editName],
    );

    const handleDelete = useCallback((id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
        setDeleting(id);
        router.delete(`/categories/${id}`, {
            preserveScroll: true,
            onFinish: () => setDeleting(null),
        });
    }, []);

    const handlePageChange = useCallback((url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kategori</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola kategori untuk diskusi di forum
                        </p>
                    </div>
                    <Button
                        className="bg-[#1548d7] hover:bg-[#1240b8] text-white gap-2"
                        onClick={() => setCreateOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kategori..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={filters.sort} onValueChange={handleSort}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">Terbaru</SelectItem>
                                        <SelectItem value="oldest">Terlama</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={String(filters.per_page)} onValueChange={handlePerPage}>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-0 shadow-md overflow-hidden">
                    <CardHeader className="sr-only">
                        <h2>Daftar Kategori</h2>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    <TableHead className="w-[60px] text-center">#</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead className="text-center">Jumlah Diskusi</TableHead>
                                    <TableHead>Tanggal Dibuat</TableHead>
                                    <TableHead className="text-center w-[120px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.data.length > 0 ? (
                                    categories.data.map((cat, index) => (
                                        <TableRow key={cat.id} className="group">
                                            <TableCell className="text-center text-muted-foreground text-sm">
                                                {(categories.meta?.from ?? 1) + index}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1548d7]/10 dark:bg-[#6b93f5]/10">
                                                        <FolderOpen className="h-4 w-4 text-[#1548d7] dark:text-[#6b93f5]" />
                                                    </div>
                                                    <span className="font-medium">{cat.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                                    {cat.slug}
                                                </code>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary" className="text-xs">
                                                    {cat.posts_count} diskusi
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(cat.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                        onClick={() => handleOpenEdit(cat)}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        onClick={() => handleDelete(cat.id)}
                                                        disabled={deleting === cat.id}
                                                    >
                                                        {deleting === cat.id ? (
                                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                                            <p className="text-sm text-muted-foreground">Belum ada kategori</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>

                    {/* Pagination */}
                    {categories.links && categories.links.length > 3 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <p className="text-xs text-muted-foreground">
                                Menampilkan {categories.meta?.from ?? 0}–{categories.meta?.to ?? 0} dari{' '}
                                {categories.meta?.total ?? 0}
                            </p>
                            <div className="flex items-center gap-1">
                                {categories.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        className={`h-8 min-w-8 text-xs ${link.active ? 'bg-[#1548d7] hover:bg-[#1240b8]' : ''}`}
                                        disabled={!link.url}
                                        onClick={() => handlePageChange(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Create Modal */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Kategori</DialogTitle>
                        <DialogDescription>Buat kategori baru untuk diskusi forum.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-name">Nama Kategori</Label>
                                <Input
                                    id="create-name"
                                    placeholder="Masukkan nama kategori"
                                    value={createName}
                                    onChange={(e) => setCreateName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#1548d7] hover:bg-[#1240b8] text-white"
                                disabled={submitting || !createName.trim()}
                            >
                                {submitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="mr-2 h-4 w-4" />
                                )}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Kategori</DialogTitle>
                        <DialogDescription>Ubah nama kategori yang sudah ada.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nama Kategori</Label>
                                <Input
                                    id="edit-name"
                                    placeholder="Masukkan nama kategori"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#1548d7] hover:bg-[#1240b8] text-white"
                                disabled={submitting || !editName.trim()}
                            >
                                {submitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Pencil className="mr-2 h-4 w-4" />
                                )}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
