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
        <div className="px-5 py-8 md:px-8 md:py-10 bg-background">
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
    );
}
