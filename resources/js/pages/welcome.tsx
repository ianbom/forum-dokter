import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

function HeartPulseIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
        </svg>
    );
}

function StethoscopeIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M4.8 2.62a2 2 0 0 0-1.67 2.27l.56 4.49a5 5 0 0 0 4.95 4.37h.67a5 5 0 0 0 4.95-4.37l.56-4.49a2 2 0 0 0-1.67-2.27" />
            <path d="M2 13v1.5a5.5 5.5 0 0 0 11 0V13" />
            <path d="M19 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
            <path d="M19 10v6a3 3 0 0 1-3 3h-1" />
        </svg>
    );
}

function ShieldCheckIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function UsersIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function MessageCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    );
}

function BookOpenIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 7v14" />
            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
        </svg>
    );
}

function ArrowRightIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    const features = [
        {
            icon: MessageCircleIcon,
            title: 'Diskusi Medis',
            description: 'Diskusikan kasus klinis, diagnosis, dan penanganan bersama rekan sejawat dari berbagai spesialisasi.',
            iconBg: 'bg-blue-100 dark:bg-blue-900/50',
            iconColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            icon: BookOpenIcon,
            title: 'Berbagi Pengetahuan',
            description: 'Bagikan pengalaman klinis, jurnal terbaru, dan update ilmu kedokteran untuk meningkatkan kualitas pelayanan.',
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            icon: UsersIcon,
            title: 'Komunitas Dokter',
            description: 'Bergabung dengan komunitas profesional kesehatan yang terpercaya dan terverifikasi.',
            iconBg: 'bg-violet-100 dark:bg-violet-900/50',
            iconColor: 'text-violet-600 dark:text-violet-400',
        },
    ];

    const specialties = [
        'Kardiologi', 'Pediatri', 'Neurologi', 'Endokrinologi',
        'Urologi', 'Imunologi', 'Bedah',
    ];

    return (
        <>
            <Head title="Forum Dokter — Komunitas Diskusi Medis">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-blue-50/30 dark:from-[#0a0a0f] dark:via-[#0f0f18] dark:to-[#0a0a0f]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
                {/* Navigation */}
                <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-[#0f0f18]/80">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-[#1548d7] to-[#3b6ef5] shadow-lg shadow-blue-500/25">
                                <HeartPulseIcon className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                Forum<span className="text-[#1548d7] dark:text-[#6b93f5]">Dokter</span>
                            </span>
                        </div>
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={'/posts'}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#1548d7] px-5 py-2 text-sm font-medium text-white shadow-md shadow-blue-500/25 transition-all hover:bg-[#1237b0] hover:shadow-lg hover:shadow-blue-500/30"
                                >
                                    Dashboard
                                    <ArrowRightIcon className="h-4 w-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                    >
                                        Masuk
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 rounded-lg bg-[#1548d7] px-5 py-2 text-sm font-medium text-white shadow-md shadow-blue-500/25 transition-all hover:bg-[#1237b0] hover:shadow-lg hover:shadow-blue-500/30"
                                        >
                                            Daftar Sekarang
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -top-40 -right-40 h-125 w-125 rounded-full bg-[#1548d7]/5 blur-3xl dark:bg-[#1548d7]/10" />
                        <div className="absolute -bottom-40 -left-40 h-100 w-100 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
                        <div className="absolute top-1/2 left-1/2 h-75 w-75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
                    </div>

                    <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 lg:pb-24 lg:pt-28">
                        <div className="mx-auto max-w-3xl text-center">
                            {/* Badge */}
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1548d7]/20 bg-[#1548d7]/5 px-4 py-1.5 text-sm font-medium text-[#1548d7] dark:border-[#6b93f5]/30 dark:bg-[#6b93f5]/10 dark:text-[#6b93f5]">
                                <StethoscopeIcon className="h-4 w-4" />
                                Platform Diskusi Medis Profesional
                            </div>

                            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl dark:text-white">
                                Ruang Diskusi untuk{' '}
                                <span className="bg-linear-to-r from-[#1548d7] to-[#3b6ef5] bg-clip-text text-transparent">
                                    Profesional Kesehatan
                                </span>
                            </h1>

                            <p className="mb-8 text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-400">
                                Forum kolaboratif bagi dokter dan tenaga medis untuk berdiskusi, berbagi pengetahuan klinis, dan meningkatkan kualitas pelayanan kesehatan bersama.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#1548d7] px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-[#1237b0] hover:shadow-2xl hover:shadow-blue-500/30"
                                    >
                                        Masuk ke Dashboard
                                        <ArrowRightIcon className="h-5 w-5" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#1548d7] px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-[#1237b0] hover:shadow-2xl hover:shadow-blue-500/30"
                                        >
                                            Bergabung Sekarang
                                            <ArrowRightIcon className="h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700"
                                        >
                                            Sudah Punya Akun
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Specialties Pills */}
                        <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
                            <span className="mr-2 text-sm font-medium text-slate-500 dark:text-slate-400">Spesialisasi:</span>
                            {specialties.map((spec) => (
                                <span
                                    key={spec}
                                    className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-600 transition-colors hover:border-[#1548d7]/30 hover:bg-[#1548d7]/5 hover:text-[#1548d7] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-[#6b93f5]/30 dark:hover:bg-[#6b93f5]/10 dark:hover:text-[#6b93f5]"
                                >
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="relative py-16 lg:py-24">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="mb-12 text-center">
                            <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
                                Mengapa Forum Dokter?
                            </h2>
                            <p className="mx-auto max-w-xl text-slate-600 dark:text-slate-400">
                                Platform khusus bagi profesional medis untuk berkolaborasi dan berkembang bersama
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="group relative rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50"
                                >
                                    <div className={`mb-5 inline-flex rounded-xl p-3 ${feature.iconBg}`}>
                                        <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust Banner */}
                <section className="relative py-16 lg:py-20">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1548d7] via-[#1d5aef] to-[#3b6ef5] p-10 text-white shadow-2xl shadow-blue-500/20 md:p-14">
                            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute top-1/2 right-1/4 h-36 w-36 rounded-full bg-white/5 blur-xl" />

                            <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:justify-between">
                                <div className="max-w-lg text-center md:text-left">
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                                        <ShieldCheckIcon className="h-4 w-4" />
                                        Terpercaya & Aman
                                    </div>
                                    <h2 className="mb-3 text-2xl font-bold md:text-3xl">
                                        Forum Diskusi yang Aman untuk Profesional Medis
                                    </h2>
                                    <p className="leading-relaxed text-blue-100/90">
                                        Setiap diskusi dijaga kerahasiaannya. Berbagi pengalaman klinis dengan tenang dalam lingkungan yang profesional dan terkontrol.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 text-center">
                                    {[
                                        { value: '7+', label: 'Spesialisasi' },
                                        { value: '24/7', label: 'Akses Forum' },
                                        { value: '100%', label: 'Gratis' },
                                        { value: 'Aman', label: 'Terverifikasi' },
                                    ].map((stat) => (
                                        <div key={stat.label}>
                                            <div className="text-2xl font-bold md:text-3xl">{stat.value}</div>
                                            <div className="text-sm text-blue-200">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 lg:py-20">
                    <div className="mx-auto max-w-6xl px-6 text-center">
                        <HeartPulseIcon className="mx-auto mb-5 h-10 w-10 text-[#1548d7] dark:text-[#6b93f5]" />
                        <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
                            Siap Bergabung dengan Komunitas?
                        </h2>
                        <p className="mx-auto mb-8 max-w-md text-slate-600 dark:text-slate-400">
                            Mulai berdiskusi dan berbagi ilmu dengan ribuan profesional kesehatan di seluruh Indonesia.
                        </p>
                        {!auth.user && (
                            <Link
                                href={register()}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#1548d7] px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-[#1237b0] hover:shadow-2xl hover:shadow-blue-500/30"
                            >
                                Daftarkan Diri Anda
                                <ArrowRightIcon className="h-5 w-5" />
                            </Link>
                        )}
                        {auth.user && (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#1548d7] px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-[#1237b0] hover:shadow-2xl hover:shadow-blue-500/30"
                            >
                                Buka Dashboard
                                <ArrowRightIcon className="h-5 w-5" />
                            </Link>
                        )}
                    </div>
                </section>

                {/* Footer */}
                {/* <footer className="border-t border-slate-200/60 bg-white/50 dark:border-slate-800/60 dark:bg-[#0a0a0f]/50">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                        <div className="flex items-center gap-2">
                            <HeartPulseIcon className="h-4 w-4 text-[#1548d7] dark:text-[#6b93f5]" />
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                &copy; {new Date().getFullYear()} Forum Dokter
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            Platform Diskusi Medis Profesional
                        </p>
                    </div>
                </footer> */}
            </div>
        </>
    );
}
