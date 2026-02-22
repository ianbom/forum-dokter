import { Link, usePage } from '@inertiajs/react';
import {
    BoxIcon,
    FileText,
    Home,
    LogOut,
    Menu,
    Plus,
    Settings,
    Stethoscope,
    User,
    Users,
} from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
    { title: 'Dashboard', href: '/dashboard', icon: Home },
    { title: 'Semua Diskusi', href: '/posts', icon: FileText },
    { title: 'Postingan Saya', href: '/my-posts', icon: User },
    { title: 'Kategori', href: '/categories', icon: BoxIcon },
    { title: 'Users', href: '/users', icon: Users },
];

// Items shown in the mobile bottom bar (max 5, keeping it clean)
const mobileNavItems = [
    { title: 'Home', href: '/dashboard', icon: Home },
    { title: 'Diskusi', href: '/posts', icon: FileText },
    { title: 'Buat', href: '/posts/create', icon: Plus },
    { title: 'Kategori', href: '/categories', icon: BoxIcon },
    { title: 'Saya', href: '/my-posts', icon: User },
];

// ── Desktop: icon-only left rail ───────────────────────────────
export function DesktopSidebar() {
    const { isCurrentUrl } = useCurrentUrl();
    const { auth } = usePage<{ auth: { user: { name: string; email: string } } }>().props;

    return (
        <aside className="fixed left-0 top-0 z-40 hidden md:flex h-screen w-[72px] flex-col items-center border-r border-border/40 bg-background py-4">
            {/* Logo */}
            <Link href="/dashboard" className="mb-6 flex h-10 w-10 items-center justify-center">
                <Stethoscope className="h-7 w-7 text-foreground" />
            </Link>

            {/* Nav */}
            <nav className="flex flex-1 flex-col items-center gap-1">
                {navItems.map((item) => (
                    <Tooltip key={item.href} delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Link
                                href={item.href}
                                prefetch
                                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200
                                    ${isCurrentUrl(item.href)
                                        ? 'bg-accent text-foreground'
                                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                                    }`}
                            >
                                <item.icon className="h-[22px] w-[22px]" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                            {item.title}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </nav>

            {/* Bottom menu */}
            <div className="flex flex-col items-center gap-1 pb-2">
                <DropdownMenu>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <button className="flex h-12 w-12 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground">
                                    <Menu className="h-[22px] w-[22px]" />
                                </button>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                            Menu
                        </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent side="right" align="end" className="w-56 ml-2">
                        <div className="px-3 py-2">
                            <p className="text-sm font-medium">{auth.user.name}</p>
                            <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Pengaturan
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/logout" method="post" as="button" className="w-full">
                                <LogOut className="mr-2 h-4 w-4" />
                                Keluar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    );
}

// ── Mobile: bottom tab bar ─────────────────────────────────────
export function MobileBottomBar() {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden h-14 items-center justify-around border-t border-border/40 bg-background/95 backdrop-blur-lg">
            {mobileNavItems.map((item) => {
                const active = isCurrentUrl(item.href);
                const isCreate = item.href === '/posts/create';

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-colors
                            ${isCreate
                                ? 'text-foreground'
                                : active
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                            }`}
                    >
                        <item.icon
                            className={`transition-all duration-200
                                ${isCreate
                                    ? 'h-7 w-7'
                                    : 'h-6 w-6'
                                }
                                ${active && !isCreate ? 'scale-110' : ''}
                            `}
                            strokeWidth={active || isCreate ? 2.5 : 1.8}
                        />
                    </Link>
                );
            })}
        </nav>
    );
}
