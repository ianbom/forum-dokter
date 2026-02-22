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
                <div className="flex-1 md:ml-[72px] flex flex-col pb-14 md:pb-0">
                    {/* Top bar — centered page title like Threads */}
                    {pageTitle && (
                        <header className="sticky top-0 z-30 flex h-14 items-center justify-center border-b border-border/40 bg-background/80 backdrop-blur-lg">
                            <h1 className="text-base font-semibold">{pageTitle}</h1>
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
