import { Download, FileIcon, FileText, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Attachment = {
    id: number;
    file_name: string;
    file_type: string;
    file_size: number;
    file_path: string;
};

function formatFileSize(bytes: number): string {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} B`;
}

function FileTypeIcon({ type }: { type: string }) {
    if (type === 'image') return <ImageIcon className="h-4 w-4" />;
    if (type === 'pdf') return <FileText className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
}

export function AttachmentCard({ attachment }: { attachment: Attachment }) {
    const isImage = attachment.file_type === 'image';
    const fileUrl = attachment.file_path.startsWith('http')
        ? attachment.file_path
        : `/storage/${attachment.file_path}`;

    if (isImage) {
        return (
            <div className="group/att relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="relative aspect-video w-full bg-muted/30">
                    <img src={fileUrl} alt={attachment.file_name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity group-hover/att:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-3 opacity-0 transition-opacity group-hover/att:opacity-100">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">{attachment.file_name}</p>
                            <p className="text-xs text-white/70">{formatFileSize(attachment.file_size)}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-white hover:bg-white/20" asChild>
                            <a href={fileUrl} download><Download className="h-4 w-4" /></a>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group/att relative flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                <FileTypeIcon type={attachment.file_type} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{attachment.file_name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(attachment.file_size)}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-60 transition-opacity group-hover/att:opacity-100" asChild>
                <a href={fileUrl} download><Download className="h-4 w-4" /></a>
            </Button>
        </div>
    );
}
