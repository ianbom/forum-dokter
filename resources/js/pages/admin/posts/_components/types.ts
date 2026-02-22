// Shared types & constants for Posts pages

export type Post = {
    id: number;
    title: string;
    content: string;
    views: number;
    is_hidden: boolean;
    created_at: string;
    user: { id: number; name: string; profile_photo?: string | null };
    categories: { id: number; name: string; slug: string }[];
    comments_count: number;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedPosts = {
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

export type Category = {
    id: number;
    name: string;
    slug: string;
};

export type Filters = {
    search: string;
    category: string;
    status: string;
    sort: string;
    per_page: number;
};

// ── Brand token ────────────────────────────────────────────────
export const BRAND = {
    bg: 'bg-[#1548d7]',
    text: 'text-[#1548d7]',
    bgLight: 'bg-[#1548d7]/10',
    darkText: 'dark:text-[#6b93f5]',
    darkBgLight: 'dark:bg-[#1548d7]/20',
} as const;

// ── Category color map ─────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    Pediatri: { bg: 'bg-sky-500/10 dark:bg-sky-500/20', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-500' },
    Kardiologi: { bg: 'bg-rose-500/10 dark:bg-rose-500/20', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' },
    Endokrinologi: { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
    Urologi: { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
    Neurologi: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
    Imunologi: { bg: 'bg-orange-500/10 dark:bg-orange-500/20', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
    Bedah: { bg: 'bg-teal-500/10 dark:bg-teal-500/20', text: 'text-teal-700 dark:text-teal-300', dot: 'bg-teal-500' },
};

const DEFAULT_CAT_COLOR = {
    bg: 'bg-[#1548d7]/10 dark:bg-[#1548d7]/20',
    text: 'text-[#1548d7] dark:text-[#6b93f5]',
    dot: 'bg-[#1548d7]',
};

export function getCatColor(name: string) {
    return CATEGORY_COLORS[name] ?? DEFAULT_CAT_COLOR;
}

// ── Utility helpers ────────────────────────────────────────────
export function getInitials(name: string): string {
    return name
        .split(' ')
        .filter((_, i) => i < 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

export function formatViews(views: number): string {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views.toString();
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export function stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}
