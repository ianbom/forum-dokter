import { Head } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    CornerDownRight,
    Download,
    Eye,
    EyeOff,
    FileIcon,
    FileText,
    Heart,
    ImageIcon,
    MessageCircle,
    MoreHorizontal,
    Paperclip,
    Pencil,
    Reply,
    Send,
    Share2,
    ThumbsUp,
    Trash2,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Posts', href: '/posts' },
    { title: 'Detail Diskusi', href: '#' },
];

type Attachment = {
    id: number;
    file_name: string;
    file_type: 'image' | 'pdf' | 'doc';
    file_size: string;
    file_path: string;
};

type CommentType = {
    id: number;
    user: { name: string; initials: string; specialization: string | null };
    content: string;
    created_at: string;
    likes: number;
    attachments: Attachment[];
    replies: CommentType[];
};

const dummyPost = {
    id: 1,
    title: 'Penanganan Awal Demam pada Anak di Bawah 5 Tahun',
    content: `Demam merupakan salah satu keluhan paling umum yang sering dijumpai pada praktik klinis sehari-hari, terutama pada pasien anak di bawah 5 tahun. Sebagai dokter, kita perlu memberikan edukasi yang tepat kepada orang tua mengenai langkah-langkah penanganan awal yang bisa dilakukan di rumah.

**Definisi Demam**
Demam didefinisikan sebagai peningkatan suhu tubuh di atas 38°C yang diukur secara rektal, atau di atas 37.5°C jika diukur secara aksila. Penting untuk diingat bahwa demam sendiri merupakan mekanisme pertahanan tubuh terhadap infeksi.

**Langkah Penanganan Awal**

1. **Pemberian Antipiretik**: Parasetamol (10-15 mg/kgBB/kali) merupakan pilihan pertama. Ibuprofen (5-10 mg/kgBB/kali) dapat diberikan sebagai alternatif untuk anak di atas 6 bulan.

2. **Kompres Hangat**: Gunakan air hangat (bukan air dingin) untuk kompres di daerah lipatan tubuh seperti aksila dan inguinal.

3. **Hidrasi yang Cukup**: Pastikan anak mendapatkan asupan cairan yang cukup. ASI, air putih, atau larutan rehidrasi oral dapat diberikan.

4. **Monitoring**: Pantau suhu tubuh setiap 4-6 jam dan perhatikan tanda-tanda bahaya.

**Tanda Bahaya yang Perlu Dirujuk**
- Usia di bawah 3 bulan dengan suhu ≥ 38°C
- Kejang demam
- Penurunan kesadaran
- Dehidrasi berat
- Demam > 5 hari tanpa perbaikan

Saya mengundang rekan-rekan sejawat untuk berbagi pengalaman dan protokol yang digunakan di tempat praktik masing-masing.`,
    views: 1240,
    is_hidden: false,
    created_at: '21 Februari 2026, 10:30 WIB',
    user: {
        name: 'Dr. Andi Pratama',
        initials: 'AP',
        specialization: 'Pediatri',
        bio: 'Dokter spesialis anak dengan pengalaman 12 tahun di RS Jakarta.',
        posts_count: 34,
        comments_count: 128,
    },
    category: { name: 'Pediatri', slug: 'pediatri' },
    attachments: [
        { id: 1, file_name: 'guideline-demam-anak.pdf', file_type: 'pdf' as const, file_size: '2.4 MB', file_path: '#' },
        { id: 2, file_name: 'tabel-dosis-antipiretik.png', file_type: 'image' as const, file_size: '540 KB', file_path: 'https://placehold.co/800x450/1548d7/ffffff?text=Tabel+Dosis+Antipiretik' },
    ],
    comments_count: 5,
    likes: 47,
    shares: 12,
};

const dummyComments: CommentType[] = [
    {
        id: 1,
        user: { name: 'Dr. Siti Nurhaliza', initials: 'SN', specialization: 'Kardiologi' },
        content: 'Terima kasih atas sharing yang sangat bermanfaat, Dok. Di tempat praktik saya, kami juga menambahkan protokol assessment menggunakan Yale Observation Scale untuk menilai risiko infeksi serius pada anak demam. Hasilnya cukup membantu dalam menentukan apakah pasien perlu rawat inap atau bisa rawat jalan.',
        created_at: '21 Feb 2026, 11:15',
        likes: 12,
        attachments: [],
        replies: [
            {
                id: 4,
                user: { name: 'Dr. Andi Pratama', initials: 'AP', specialization: 'Pediatri' },
                content: 'Benar sekali, Dr. Siti. Yale Observation Scale memang sangat membantu. Kami juga menggunakannya di RS kami. Apakah di tempat praktik Anda digunakan juga Rochester Criteria untuk neonatus?',
                created_at: '21 Feb 2026, 11:45',
                likes: 5,
                attachments: [],
                replies: [],
            },
            {
                id: 5,
                user: { name: 'Dr. Siti Nurhaliza', initials: 'SN', specialization: 'Kardiologi' },
                content: 'Ya, untuk neonatus kami menggunakan Rochester Criteria dikombinasikan dengan pemeriksaan lab dasar. Saya lampirkan flowchart yang kami gunakan.',
                created_at: '21 Feb 2026, 12:00',
                likes: 8,
                attachments: [
                    { id: 3, file_name: 'flowchart-neonatus-demam.png', file_type: 'image' as const, file_size: '320 KB', file_path: 'https://placehold.co/800x450/1548d7/ffffff?text=Flowchart+Neonatus+Demam' },
                ],
                replies: [],
            },
        ],
    },
    {
        id: 2,
        user: { name: 'Dr. Budi Santoso', initials: 'BS', specialization: 'Endokrinologi' },
        content: 'Pertanyaan yang menarik diangkat. Bagaimana pendapat rekan-rekan mengenai penggunaan kombinasi parasetamol dan ibuprofen secara bergantian? Beberapa literatur terbaru menunjukkan bahwa strategi ini lebih efektif untuk mengontrol demam, namun ada juga kekhawatiran mengenai potensi efek samping terutama pada fungsi ginjal.',
        created_at: '21 Feb 2026, 13:00',
        likes: 15,
        attachments: [
            { id: 4, file_name: 'meta-analysis-antipyretics-2025.pdf', file_type: 'pdf' as const, file_size: '1.8 MB', file_path: '#' },
        ],
        replies: [],
    },
    {
        id: 3,
        user: { name: 'Dr. Rina Wulandari', initials: 'RW', specialization: 'Neurologi' },
        content: 'Dari sudut pandang neurologi, saya ingin menambahkan beberapa poin penting terkait kejang demam. Sekitar 2-5% anak usia 6 bulan - 5 tahun dapat mengalami kejang demam. Edukasi kepada orang tua mengenai pertolongan pertama saat kejang sangat krusial.',
        created_at: '21 Feb 2026, 14:30',
        likes: 22,
        attachments: [],
        replies: [],
    },
];

const BRAND = {
    bg: 'bg-[#1548d7]',
    bgHover: 'hover:bg-[#1237b0]',
    text: 'text-[#1548d7]',
    bgLight: 'bg-[#1548d7]/10',
    darkText: 'dark:text-[#6b93f5]',
    darkBgLight: 'dark:bg-[#1548d7]/20',
};

function AttachmentFileIcon({ type }: { type: string }) {
    if (type === 'image') return <ImageIcon className="h-4 w-4" />;
    if (type === 'pdf') return <FileText className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
}

function AttachmentCard({ attachment }: { attachment: Attachment }) {
    const isImage = attachment.file_type === 'image';

    if (isImage) {
        return (
            <div className="group/att relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="relative aspect-video w-full bg-muted/30">
                    <img
                        src={attachment.file_path}
                        alt={attachment.file_name}
                        className="h-full w-full object-cover"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity group-hover/att:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-3 opacity-0 transition-opacity group-hover/att:opacity-100">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">{attachment.file_name}</p>
                            <p className="text-xs text-white/70">{attachment.file_size}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-white hover:bg-white/20"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group/att relative flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                <AttachmentFileIcon type={attachment.file_type} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{attachment.file_name}</p>
                <p className="text-xs text-muted-foreground">{attachment.file_size}</p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-60 transition-opacity group-hover/att:opacity-100"
            >
                <Download className="h-4 w-4" />
            </Button>
        </div>
    );
}

function CommentItem({ comment, depth = 0 }: { comment: CommentType; depth?: number }) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [liked, setLiked] = useState(false);
    const isNested = depth > 0;

    return (
        <div className={isNested ? 'ml-5 md:ml-8' : ''}>
            <div className="group relative py-5">
                {/* Connector line for nested */}
                {isNested && (
                    <div className="absolute -left-5 md:-left-8 top-0 bottom-0 w-px bg-border dark:bg-border/50" />
                )}
                {isNested && (
                    <div className="absolute -left-5 md:-left-8 top-9 h-px w-4 md:w-7 bg-border dark:bg-border/50" />
                )}

                <div className="flex gap-3">
                    <Avatar className={`${isNested ? 'h-8 w-8' : 'h-10 w-10'} shrink-0 ring-2 ring-background shadow-sm`}>
                        <AvatarFallback className={`${BRAND.bg} text-white text-xs font-semibold`}>
                            {comment.user.initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        {/* Comment bubble */}
                        <div className="rounded-2xl rounded-tl-sm bg-muted/50 dark:bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/70 dark:hover:bg-muted/40">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-sm font-semibold ${BRAND.text} ${BRAND.darkText}`}>
                                        {comment.user.name}
                                    </span>
                                    {comment.user.specialization && (
                                        <Badge
                                            className={`${BRAND.bgLight} ${BRAND.text} ${BRAND.darkBgLight} ${BRAND.darkText} border-0 text-[10px] font-medium px-1.5 py-0`}
                                        >
                                            {comment.user.specialization}
                                        </Badge>
                                    )}
                                    <span className="text-[11px] text-muted-foreground">{comment.created_at}</span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <p className="text-sm leading-relaxed text-foreground/85">{comment.content}</p>

                            {/* Comment Attachments */}
                            {comment.attachments.length > 0 && (
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {comment.attachments.map((att) => (
                                        <AttachmentCard key={att.id} attachment={att} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action bar */}
                        <div className="mt-1.5 flex items-center gap-0.5 px-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-7 px-2 text-xs gap-1 ${liked ? `${BRAND.text} ${BRAND.darkText}` : 'text-muted-foreground'}`}
                                onClick={() => setLiked(!liked)}
                            >
                                <ThumbsUp className={`h-3.5 w-3.5 ${liked ? 'fill-current' : ''}`} />
                                {comment.likes + (liked ? 1 : 0)}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs text-muted-foreground gap-1"
                                onClick={() => setReplyOpen(!replyOpen)}
                            >
                                <Reply className="h-3.5 w-3.5" />
                                Balas
                            </Button>
                        </div>

                        {/* Reply input */}
                        {replyOpen && (
                            <div className="mt-2 ml-1 flex gap-2.5 items-start">
                                <CornerDownRight className="mt-3 h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="rounded-xl border bg-card shadow-sm p-3">
                                        <Textarea
                                            placeholder={`Balas ${comment.user.name}...`}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="min-h-[64px] resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 text-sm"
                                        />
                                        <Separator className="my-2" />
                                        <div className="flex items-center justify-between">
                                            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                                                <Paperclip className="mr-1 h-3.5 w-3.5" />
                                                File
                                            </Button>
                                            <div className="flex gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 text-xs"
                                                    onClick={() => {
                                                        setReplyOpen(false);
                                                        setReplyText('');
                                                    }}
                                                >
                                                    Batal
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className={`h-7 text-xs ${BRAND.bg} ${BRAND.bgHover} text-white`}
                                                >
                                                    <Send className="mr-1 h-3 w-3" />
                                                    Kirim
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Nested Replies */}
            {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
        </div>
    );
}

export default function PostShow() {
    const [commentText, setCommentText] = useState('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={dummyPost.title} />
            <div className="flex flex-col gap-0 p-0">
                {/* ═══════════════ Hero Header ═══════════════ */}
                <div className="relative overflow-hidden bg-linear-to-br from-[#1548d7] via-[#1d5aef] to-[#3b6ef5]">
                    {/* Decorative circles */}
                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />
                    <div className="absolute top-1/2 left-1/3 h-32 w-32 rounded-full bg-white/[0.03]" />

                    <div className="relative mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
                        {/* Back link */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mb-4 text-white/70 hover:text-white hover:bg-white/10"
                            asChild
                        >
                            <a href="/posts">
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                Kembali ke Diskusi
                            </a>
                        </Button>

                        <div className="flex items-start gap-2 mb-3 flex-wrap">
                            <Badge className="bg-white/15 text-white border-white/20 text-xs backdrop-blur-sm">
                                {dummyPost.category.name}
                            </Badge>
                            {dummyPost.is_hidden && (
                                <Badge className="bg-red-500/30 text-white border-red-300/30 text-xs">
                                    <EyeOff className="mr-1 h-3 w-3" />
                                    Hidden
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug mb-4 max-w-3xl">
                            {dummyPost.title}
                        </h1>

                        {/* Author row */}
                        <div className="flex items-center gap-3 mb-5">
                            <Avatar className="h-10 w-10 ring-2 ring-white/30 shadow-lg">
                                <AvatarFallback className="bg-white/20 text-white font-semibold text-sm backdrop-blur-sm">
                                    {dummyPost.user.initials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold text-white">{dummyPost.user.name}</p>
                                <div className="flex items-center gap-2 text-xs text-white/60">
                                    <span>{dummyPost.user.specialization}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {dummyPost.created_at}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stat pills */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {[
                                { icon: Eye, label: `${dummyPost.views.toLocaleString('id-ID')} views` },
                                { icon: MessageCircle, label: `${dummyPost.comments_count} komentar` },
                                { icon: Heart, label: `${dummyPost.likes} suka` },
                                { icon: Share2, label: `${dummyPost.shares} share` },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs text-white/80"
                                >
                                    <stat.icon className="h-3.5 w-3.5" />
                                    {stat.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══════════════ Main Content ═══════════════ */}
                <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                        {/* ──── Left Column ──── */}
                        <div className="flex flex-col gap-6 min-w-0">
                            {/* Post Content */}
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <CardContent className="p-5 md:p-8">
                                    {/* Action toolbar */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                                                <ThumbsUp className="h-3.5 w-3.5" />
                                                Suka
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                                                <Share2 className="h-3.5 w-3.5" />
                                                Share
                                            </Button>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                    Kelola
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44">
                                                <DropdownMenuItem>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit Diskusi
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <EyeOff className="mr-2 h-4 w-4" />
                                                    Sembunyikan
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <Separator className="mb-6" />

                                    {/* Article Body */}
                                    <article className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-[1.8] whitespace-pre-line text-[15px]">
                                        {dummyPost.content}
                                    </article>

                                    {/* Attachments */}
                                    {dummyPost.attachments.length > 0 && (
                                        <div className="mt-8 pt-6 border-t">
                                            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                                <div className={`rounded-lg p-1.5 ${BRAND.bgLight} ${BRAND.darkBgLight}`}>
                                                    <Paperclip className={`h-4 w-4 ${BRAND.text} ${BRAND.darkText}`} />
                                                </div>
                                                Lampiran ({dummyPost.attachments.length})
                                            </h4>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {dummyPost.attachments.map((att) => (
                                                    <AttachmentCard key={att.id} attachment={att} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Comment Input Card */}
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <CardHeader className="pb-0 pt-5 px-5 md:px-8">
                                    <h3 className="text-sm font-semibold flex items-center gap-2">
                                        <Pencil className={`h-4 w-4 ${BRAND.text} ${BRAND.darkText}`} />
                                        Tulis Komentar
                                    </h3>
                                </CardHeader>
                                <CardContent className="p-5 md:px-8 md:pb-6">
                                    <div className="flex gap-3 items-start">
                                        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-background shadow-sm mt-0.5">
                                            <AvatarFallback className={`${BRAND.bg} text-white text-xs font-semibold`}>
                                                AD
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-3">
                                            <div className="rounded-xl border bg-muted/20 dark:bg-muted/10 p-3 transition-colors focus-within:border-[#1548d7]/40 focus-within:shadow-sm">
                                                <Textarea
                                                    placeholder="Bagikan pendapat atau pengalaman klinis Anda..."
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    className="min-h-[80px] resize-none border-0 p-0 bg-transparent shadow-none focus-visible:ring-0 text-sm"
                                                />
                                                <Separator className="my-2.5" />
                                                <div className="flex items-center justify-between">
                                                    <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground gap-1.5">
                                                        <Paperclip className="h-3.5 w-3.5" />
                                                        Lampirkan File
                                                    </Button>
                                                    <Button className={`${BRAND.bg} ${BRAND.bgHover} text-white shadow-md text-xs h-8`}>
                                                        <Send className="mr-1.5 h-3.5 w-3.5" />
                                                        Kirim Komentar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Comments Section */}
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <CardHeader className="pb-2 px-5 md:px-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-semibold flex items-center gap-2.5">
                                            <div className={`rounded-lg p-1.5 ${BRAND.bgLight} ${BRAND.darkBgLight}`}>
                                                <MessageCircle className={`h-4 w-4 ${BRAND.text} ${BRAND.darkText}`} />
                                            </div>
                                            Diskusi
                                            <span className={`text-sm font-normal ${BRAND.text} ${BRAND.darkText}`}>
                                                ({dummyPost.comments_count})
                                            </span>
                                        </h3>
                                        <Badge variant="outline" className="text-xs gap-1">
                                            <Clock className="h-3 w-3" />
                                            Terbaru
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="px-5 md:px-8 pb-6">
                                    {dummyComments.length > 0 ? (
                                        <div className="divide-y divide-border/60">
                                            {dummyComments.map((comment) => (
                                                <CommentItem key={comment.id} comment={comment} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className={`rounded-2xl p-5 ${BRAND.bgLight} ${BRAND.darkBgLight} mb-4`}>
                                                <MessageCircle className={`h-10 w-10 ${BRAND.text} ${BRAND.darkText}`} />
                                            </div>
                                            <p className="font-semibold">Belum ada komentar</p>
                                            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                                                Jadilah yang pertama memberikan tanggapan pada diskusi ini
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* ──── Right Sidebar ──── */}
                        <div className="flex flex-col gap-5">
                            {/* Author Card */}
                            <Card className="border-0 shadow-lg overflow-hidden sticky top-6">
                                <div className="h-16 bg-linear-to-r from-[#1548d7] to-[#3b6ef5]" />
                                <CardContent className="pt-0 pb-5 px-5">
                                    <div className="-mt-8 mb-3">
                                        <Avatar className="h-14 w-14 ring-4 ring-background shadow-lg">
                                            <AvatarFallback className={`${BRAND.bg} text-white font-bold text-lg`}>
                                                {dummyPost.user.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <h4 className="font-semibold">{dummyPost.user.name}</h4>
                                    <Badge className={`${BRAND.bgLight} ${BRAND.text} ${BRAND.darkBgLight} ${BRAND.darkText} border-0 text-[11px] mt-1`}>
                                        {dummyPost.user.specialization}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                        {dummyPost.user.bio}
                                    </p>
                                    <Separator className="my-4" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-lg bg-muted/40 dark:bg-muted/20 p-3 text-center">
                                            <p className={`text-lg font-bold ${BRAND.text} ${BRAND.darkText}`}>
                                                {dummyPost.user.posts_count}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                                                Diskusi
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-muted/40 dark:bg-muted/20 p-3 text-center">
                                            <p className={`text-lg font-bold ${BRAND.text} ${BRAND.darkText}`}>
                                                {dummyPost.user.comments_count}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                                                Komentar
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="pb-2 px-5 pt-5">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                        <TrendingUp className={`h-4 w-4 ${BRAND.text} ${BRAND.darkText}`} />
                                        Statistik Diskusi
                                    </h4>
                                </CardHeader>
                                <CardContent className="px-5 pb-5 space-y-3">
                                    {[
                                        { icon: Eye, label: 'Total Views', value: dummyPost.views.toLocaleString('id-ID'), color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20' },
                                        { icon: MessageCircle, label: 'Komentar', value: dummyPost.comments_count.toString(), color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20' },
                                        { icon: Heart, label: 'Suka', value: dummyPost.likes.toString(), color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20' },
                                        { icon: Users, label: 'Partisipan', value: '4', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20' },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`rounded-lg p-1.5 ${item.color}`}>
                                                    <item.icon className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="text-sm text-muted-foreground">{item.label}</span>
                                            </div>
                                            <span className="text-sm font-bold">{item.value}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
