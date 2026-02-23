import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { PaginatedPosts } from './types';

type Props = {
    posts: PaginatedPosts;
    perPage: number;
    onPageChange: (url: string | null) => void;
    onPerPageChange: (value: number) => void;
};

export function PostPagination({ posts, perPage, onPageChange, onPerPageChange }: Props) {
    const { meta } = posts;

    return (
        <div className="border-t border-border/60 px-5 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    Menampilkan <span className="font-semibold">{meta.from}</span>–
                    <span className="font-semibold">{meta.to}</span> dari{' '}
                    <span className="font-semibold">{meta.total}</span> diskusi
                </p>

                {meta.links && meta.links.length > 0 && (
                    <div className="flex items-center gap-1">
                        {meta.links.map((link, i) => {
                            if (i === 0) {
                                return (
                                    <Button
                                        key="prev"
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9"
                                        disabled={!link.url}
                                        onClick={() => onPageChange(link.url)}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                );
                            }
                            if (i === meta.links.length - 1) {
                                return (
                                    <Button
                                        key="next"
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9"
                                        disabled={!link.url}
                                        onClick={() => onPageChange(link.url)}
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
                                    className={`h-9 w-9 ${link.active ? 'bg-[#1548d7] hover:bg-[#1237b0] text-white border-0' : ''}`}
                                    disabled={!link.url}
                                    onClick={() => onPageChange(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                )}

                <Select value={String(perPage)} onValueChange={(val) => onPerPageChange(Number(val))}>
                    <SelectTrigger className="w-28">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10 / page</SelectItem>
                        <SelectItem value="50">50 / page</SelectItem>
                        <SelectItem value="100">100 / page</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
