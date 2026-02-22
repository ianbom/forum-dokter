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
    { title: 'Diskusi', href: '/posts' },
];

type PageProps = {
    posts: PaginatedPosts;
    filters: Filters;
};

export default function PostsIndex() {
    const { posts, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search);
    console.log(posts);

    const applyFilters = useCallback(
        (newFilters: Partial<Filters>) => {
            const merged = { ...filters, ...newFilters };
            const params: Record<string, string> = {};

            if (merged.search) params.search = merged.search;
            if (merged.sort && merged.sort !== 'latest') params.sort = merged.sort;
            if (merged.per_page && merged.per_page !== 12) params.per_page = String(merged.per_page);

            router.get('/posts', params, { preserveState: true, preserveScroll: true });
        },
        [filters],
    );

    const handleSearchSubmit = useCallback(() => {
        applyFilters({ search });
    }, [search, applyFilters]);

    const handlePageChange = useCallback((url: string | null) => {
        if (url) router.get(url, {}, { preserveState: true, preserveScroll: true });
    }, []);

    const handleReset = useCallback(() => {
        setSearch('');
        router.get('/posts', {}, { preserveState: true });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Diskusi" />
            <div className="flex flex-col gap-0">
                <HeroBanner
                    title="Diskusikan."
                    subtitle="Bagikan Ilmu Bersama."
                    description="Forum kolaboratif bagi dokter dan tenaga medis untuk berdiskusi, berbagi pengetahuan klinis, dan meningkatkan kualitas pelayanan kesehatan."
                />

                <PostFilterBar
                    search={search}
                    onSearchChange={setSearch}
                    onSearchSubmit={handleSearchSubmit}
                    filters={filters}
                    onFilterChange={applyFilters}
                />

                {posts.data.length > 0 ? (
                    <>
                        <div className="divide-y-0">
                            {posts.data.map((post) => (
                                <PostItem key={post.id} post={post} />
                            ))}
                        </div>
                        <PostPagination
                            posts={posts}
                            perPage={filters.per_page}
                            onPageChange={handlePageChange}
                            onPerPageChange={(val) => applyFilters({ per_page: val })}
                        />
                    </>
                ) : (
                    <PostEmptyState onReset={handleReset} />
                )}
            </div>
        </AppLayout>
    );
}
