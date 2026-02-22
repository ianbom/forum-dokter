import { Search, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Filters } from './types';

type Props = {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
    filters: Filters;
    onFilterChange: (partial: Partial<Filters>) => void;
};

export function PostFilterBar({ search, onSearchChange, onSearchSubmit, filters, onFilterChange }: Props) {
    return (
        <div className="border-b border-border/60">
            <div className="px-5 py-4">
                <div className="flex flex-row items-center gap-2 sm:gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari judul, penulis, atau kategori..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                            className="pl-9 focus-visible:ring-[#1548d7]/30"
                        />
                    </div>

                    <Separator orientation="vertical" className="hidden sm:block h-8" />

                    {/* Sort */}
                    <Select
                        value={filters.sort}
                        onValueChange={(val) => onFilterChange({ sort: val })}
                    >
                        <SelectTrigger className="w-36 sm:w-44 shrink-0">
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
