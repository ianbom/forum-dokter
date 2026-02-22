import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    title: string;
    subtitle: string;
    description: string;
    createHref?: string;
};

export function HeroBanner({ title, subtitle, description, createHref = '/posts/create' }: Props) {
    return (
        <div className="relative overflow-hidden bg-background border-b border-border/60">
            {/* Decorative Elements */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
            <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-10 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="pointer-events-none absolute top-1/4 left-1/3 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl" />

            <div className="relative mx-auto w-full px-5 py-8 md:px-8 md:py-10">
                <div className="max-w-2xl">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl mb-2">
                        {title} <span className="text-muted-foreground font-medium">{subtitle}</span>
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                        {description}
                    </p>
                    <Button className="bg-[#1548d7] hover:bg-[#1240b8] text-white" asChild>
                        <a href={createHref}>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Diskusi Baru
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
