import { MessageCircle, Plus, Sparkles, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    title: string;
    subtitle: string;
    description: string;
    createHref?: string;
};

export function HeroBanner({ title, subtitle, description, createHref = '/posts/create' }: Props) {
    return (
        <div className="relative overflow-hidden bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] dark:from-[#0a0a14] dark:via-[#111827] dark:to-[#0a0a14]">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#1548d7]/30 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-emerald-500/20 blur-3xl" />
            </div>

            <div className="relative flex items-center justify-between px-6 py-8 md:px-10 md:py-10">
                <div className="max-w-xl">
                    <h1 className="text-2xl font-bold text-white md:text-3xl leading-tight mb-2">
                        {title} <br />
                        <span className="text-slate-400">{subtitle}</span>
                    </h1>
                    <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-md">{description}</p>
                    <Button className="bg-[#1548d7] hover:bg-[#1240b8] text-white shadow-lg shadow-blue-500/25" asChild>
                        <a href={createHref}>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Diskusi Baru
                        </a>
                    </Button>
                </div>

                {/* Illustration */}
                <div className="hidden lg:flex items-center justify-center">
                    <div className="relative">
                        <div className="h-36 w-36 rounded-2xl bg-linear-to-br from-[#1548d7]/20 to-[#3b6ef5]/10 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                            <Stethoscope className="h-16 w-16 text-[#6b93f5]" />
                        </div>
                        <div className="absolute -top-3 -right-3 h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                            <MessageCircle className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="absolute -bottom-3 -left-3 h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-amber-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
