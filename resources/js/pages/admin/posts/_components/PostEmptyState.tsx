import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRAND } from './types';

type Props = {
    message?: string;
    subMessage?: string;
    onReset: () => void;
};

export function PostEmptyState({
    message = 'Tidak ada diskusi ditemukan',
    subMessage = 'Coba ubah filter pencarian atau kategori untuk menemukan diskusi yang Anda cari.',
    onReset,
}: Props) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-5">
            <div className={`rounded-2xl p-5 ${BRAND.bgLight} ${BRAND.darkBgLight} mb-5`}>
                <Search className={`h-10 w-10 ${BRAND.text} ${BRAND.darkText}`} />
            </div>
            <h3 className="text-lg font-bold mb-1">{message}</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">{subMessage}</p>
            <Button variant="outline" className="mt-5" onClick={onReset}>
                Reset Filter
            </Button>
        </div>
    );
}
