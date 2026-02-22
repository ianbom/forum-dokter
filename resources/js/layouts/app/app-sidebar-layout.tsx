import { DesktopSidebar, MobileBottomBar } from '@/components/app-sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const pageTitle = breadcrumbs.length > 0
        ? breadcrumbs[breadcrumbs.length - 1].title
        : '';

    return (
        <TooltipProvider>
            <div className="flex min-h-screen bg-background">
                {/* Desktop: fixed left icon rail */}
                <DesktopSidebar />

                {/* Main content */}
                <div className="flex-1 min-w-0 md:ml-[72px] flex flex-col pb-14 md:pb-0">
                    {/* Top bar */}
                    {pageTitle && (
                        <header className="sticky top-0 z-30 flex h-14 items-center justify-center border-b border-border/40 bg-background/80 backdrop-blur-lg overflow-hidden">
                            {/* Decorative background effects */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#1548d7]/50 dark:via-[#6b93f5]/50 to-transparent opacity-70" />
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-20 w-64 bg-[#1548d7]/15 dark:bg-[#6b93f5]/15 rounded-full blur-2xl pointer-events-none" />

                            <h1 className="text-base font-semibold relative z-10 flex items-center gap-2.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#1548d7] dark:bg-[#6b93f5] shadow-[0_0_8px_rgba(21,72,215,0.6)]" />
                                {pageTitle}
                            </h1>
                        </header>
                    )}

                    {/* Page content */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>

                {/* Mobile: fixed bottom tab bar */}
                <MobileBottomBar />
            </div>
        </TooltipProvider>
    );
}
