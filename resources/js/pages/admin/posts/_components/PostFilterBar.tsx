import { Filter, Search, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Category, Filters } from './types';

type Props = {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
    filters: Filters;
    categories: Category[];
    onFilterChange: (partial: Partial<Filters>) => void;
};

export function PostFilterBar({ search, onSearchChange, onSearchSubmit, filters, categories, onFilterChange }: Props) {
    return (
        <div className="border-b border-border/60">
            <div className="px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari judul atau penulis..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                            className="pl-9 focus-visible:ring-[#1548d7]/30"
                        />
                    </div>

                    <Separator orientation="vertical" className="hidden sm:block h-8" />

                    {/* Category */}
                    <Select
                        value={filters.category || '_all'}
                        onValueChange={(val) => onFilterChange({ category: val === '_all' ? '' : val })}
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

                    {/* Status */}
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(val) => onFilterChange({ status: val === 'all' ? '' : val })}
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

                    {/* Sort */}
                    <Select
                        value={filters.sort}
                        onValueChange={(val) => onFilterChange({ sort: val })}
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
            </div>
        </div>
    );
}
