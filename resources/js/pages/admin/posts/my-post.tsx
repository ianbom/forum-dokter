import { Head, router, usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { HeroBanner } from './_components/HeroBanner';
import { PostEmptyState } from './_components/PostEmptyState';
import { PostFilterBar } from './_components/PostFilterBar';
import { PostItem } from './_components/PostItem';
import { PostPagination } from './_components/PostPagination';
import type { Filters, PaginatedPosts } from './_components/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Postingan Saya', href: '/my-posts' },
];

type PageProps = {
    posts: PaginatedPosts;
    filters: Filters;
};

export default function MyPostsPage() {
    const { posts, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search);

    const applyFilters = useCallback(
        (newFilters: Partial<Filters>) => {
            const merged = { ...filters, ...newFilters };
            const params: Record<string, string> = {};
            if (merged.search) params.search = merged.search;
            if (merged.sort && merged.sort !== 'latest') params.sort = merged.sort;
            if (merged.per_page && merged.per_page !== 12) params.per_page = String(merged.per_page);
            router.get('/my-posts', params, { preserveState: true, preserveScroll: true });
        },
        [filters],
    );

    const handleSearch = useCallback(() => applyFilters({ search }), [search, applyFilters]);

    const goToPage = useCallback((url: string | null) => {
        if (url) router.get(url, {}, { preserveState: true, preserveScroll: true });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Postingan Saya" />
            <div className="flex flex-col gap-0">
                <HeroBanner
                    title="Postingan Saya."
                    subtitle="Semua diskusi yang Anda buat."
                    description="Kelola semua diskusi yang pernah Anda bagikan di forum. Edit, sembunyikan, atau hapus kapan saja."
                    createHref="/posts/create"
                />

                <PostFilterBar
                    search={search}
                    filters={filters}
                    onSearchChange={setSearch}
                    onSearchSubmit={handleSearch}
                    onFilterChange={(partial) => applyFilters(partial)}
                />

                {posts.data.length > 0 ? (
                    <div className="divide-y-0">
                        {posts.data.map((post) => <PostItem key={post.id} post={post} canEdit={true} />)}
                    </div>
                ) : (
                    <PostEmptyState
                        message="Belum ada diskusi"
                        subMessage="Anda belum membuat diskusi apapun. Mulai berbagi pengetahuan klinis sekarang!"
                        onReset={() => { setSearch(''); router.get('/my-posts', {}, { preserveState: true }); }}
                    />
                )}

                {posts.data.length > 0 && (
                    <PostPagination
                        posts={posts}
                        perPage={filters.per_page}
                        onPageChange={goToPage}
                        onPerPageChange={(val) => applyFilters({ per_page: val })}
                    />
                )}
            </div>
        </AppLayout>
    );
}
