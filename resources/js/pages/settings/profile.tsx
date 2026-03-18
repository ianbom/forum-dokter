import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';

import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { getCroppedImg } from '@/lib/cropImage';
import type { BreadcrumbItem } from '@/types';

type Area = { x: number; y: number; width: number; height: number };

type ProvinceOption = {
    id: number;
    code: string | null;
    name: string;
};

type CityOption = {
    id: number;
    province_id: number;
    code: string | null;
    name: string;
    type: string;
};

type CityWithProvince = {
    id: number;
    province_id: number;
    name: string;
    code: string | null;
    type: string;
    province_name: string;
    province_code: string | null;
};

type ProfilePageProps = {
    auth: {
        user: {
            name: string;
            email: string;
            specialization?: string | null;
            bio?: string | null;
            profile_photo?: string | null;
            email_verified_at?: string | null;
            is_member?: boolean;
            is_suspended?: boolean;
            dpd_city_id?: number | null;
            dpc_city_id?: number | null;
            kta?: string | null;
        };
    };
    provinces: ProvinceOption[];
    dpdCity: CityWithProvince | null;
    dpcCity: CityWithProvince | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth, provinces, dpdCity, dpcCity } = usePage<ProfilePageProps>().props;

    const { data, setData, patch, processing, recentlySuccessful, errors } = useForm<{
        name: string;
        email: string;
        specialization: string;
        bio: string;
        is_member: boolean;
        dpd_city_id: number | null;
        dpc_city_id: number | null;
        kta: string;
        profile_photo: File | null;
    }>({
        name: auth.user.name,
        email: auth.user.email,
        specialization: (auth.user.specialization as string) || '',
        bio: (auth.user.bio as string) || '',
        is_member: Boolean(auth.user.is_member),
        dpd_city_id: auth.user.dpd_city_id ?? null,
        dpc_city_id: auth.user.dpc_city_id ?? null,
        kta: (auth.user.kta as string) || '',
        profile_photo: null,
    });

    const [dpdProvinceId, setDpdProvinceId] = useState<string>(dpdCity?.province_id ? String(dpdCity.province_id) : '');
    const [dpcProvinceId, setDpcProvinceId] = useState<string>(dpcCity?.province_id ? String(dpcCity.province_id) : '');
    const [dpdCities, setDpdCities] = useState<CityOption[]>([]);
    const [dpcCities, setDpcCities] = useState<CityOption[]>([]);

    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState<string>('');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(file);
            setCropDialogOpen(true);
        }
        e.target.value = '';
    };

    const confirmCrop = async () => {
        if (!croppedAreaPixels) return;

        try {
            const croppedImage = await getCroppedImg(imgSrc, croppedAreaPixels);
            if (croppedImage) {
                setData('profile_photo', croppedImage);
            }
        } catch (e) {
            console.error(e);
        }
        setCropDialogOpen(false);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/settings/profile');
    };

    useEffect(() => {
        const loadCities = async (provinceId: string, onLoaded: (cities: CityOption[]) => void) => {
            if (!provinceId) {
                onLoaded([]);

                return;
            }

            try {
                const response = await fetch(`/api/wilayah/cities?province_id=${provinceId}`);
                const json = (await response.json()) as { data?: CityOption[] };
                onLoaded(json.data ?? []);
            } catch (_error) {
                onLoaded([]);
            }
        };

        loadCities(dpdProvinceId, setDpdCities);
    }, [dpdProvinceId]);

    useEffect(() => {
        const loadCities = async (provinceId: string, onLoaded: (cities: CityOption[]) => void) => {
            if (!provinceId) {
                onLoaded([]);

                return;
            }

            try {
                const response = await fetch(`/api/wilayah/cities?province_id=${provinceId}`);
                const json = (await response.json()) as { data?: CityOption[] };
                onLoaded(json.data ?? []);
            } catch (_error) {
                onLoaded([]);
            }
        };

        loadCities(dpcProvinceId, setDpcCities);
    }, [dpcProvinceId]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile Settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your name, photo, and professional details"
                    />

                    <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                        <p className="text-sm text-muted-foreground">Status akun</p>
                        <div className="mt-2 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Badge variant={auth.user.is_suspended ? 'destructive' : 'secondary'}>
                                    {auth.user.is_suspended ? 'Akun Disuspend' : 'Akun Aktif'}
                                </Badge>
                            </div>
                            {auth.user.is_suspended && (
                                <p className="text-sm text-destructive font-medium mt-1">
                                    Saat ini Anda tidak memiliki akses untuk membuat atau mengedit postingan maupun komentar.
                                </p>
                            )}
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Profile Photo */}
                        <div className="grid gap-2">
                            <Label htmlFor="profile_photo">Foto Profil</Label>

                            <div className="flex items-center gap-4 mt-1">
                                {/* Preview Circle */}
                                <div className="h-16 w-16 shrink-0 rounded-full bg-muted overflow-hidden border border-border flex items-center justify-center">
                                    {data.profile_photo instanceof File ? (
                                        <img
                                            src={URL.createObjectURL(data.profile_photo)}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : auth.user.profile_photo ? (
                                        <img
                                            src={`/storage/${auth.user.profile_photo}`}
                                            alt={auth.user.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl font-bold text-muted-foreground">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <Input
                                    id="profile_photo"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                    name="profile_photo"
                                    className="w-full max-w-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1548d7]/10 file:text-[#1548d7] hover:file:bg-[#1548d7]/20 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <InputError className="mt-1" message={errors.profile_photo} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                name="name"
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.name}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                name="email"
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.email}
                            />
                        </div>

                        {/* <div className="grid gap-2">
                            <Label htmlFor="specialization">Spesialisasi / Keahlian</Label>

                            <Input
                                id="specialization"
                                className="mt-1 block w-full"
                                value={data.specialization || ''}
                                onChange={(e) => setData('specialization', e.target.value)}
                                name="specialization"
                                placeholder="Contoh: Dokter Umum, Spesialis Anak, dll."
                            />

                            <InputError
                                className="mt-2"
                                message={errors.specialization}
                            />
                        </div> */}

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio / Tentang Saya</Label>

                            <textarea
                                id="bio"
                                className="mt-1 flex w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={data.bio || ''}
                                onChange={(e) => setData('bio', e.target.value)}
                                name="bio"
                                placeholder="Ceritakan sedikit tentang latar belakang medis Anda..."
                            />

                            <InputError
                                className="mt-2"
                                message={errors.bio}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="is_member">Status Member</Label>

                            <select
                                id="is_member"
                                className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={data.is_member ? '1' : '0'}
                                onChange={(e) => setData('is_member', e.target.value === '1')}
                                name="is_member"
                            >
                                <option value="0">Bukan Member</option>
                                <option value="1">Member</option>
                            </select>

                            <InputError className="mt-2" message={errors.is_member} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="kta">Nomor KTA</Label>

                            <Input
                                id="kta"
                                className="mt-1 block w-full"
                                value={data.kta}
                                onChange={(e) => setData('kta', e.target.value)}
                                name="kta"
                                placeholder="Masukkan nomor KTA"
                            />

                            <InputError className="mt-2" message={errors.kta} />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="dpd_province_id">Provinsi DPD</Label>

                                <select
                                    id="dpd_province_id"
                                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={dpdProvinceId}
                                    onChange={(e) => {
                                        const nextProvinceId = e.target.value;
                                        setDpdProvinceId(nextProvinceId);
                                        setData('dpd_city_id', null);
                                    }}
                                >
                                    <option value="">Pilih provinsi</option>
                                    {provinces.map((province) => (
                                        <option key={province.id} value={province.id}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="dpd_city_id">Kota DPD</Label>

                                <select
                                    id="dpd_city_id"
                                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={data.dpd_city_id ? String(data.dpd_city_id) : ''}
                                    onChange={(e) => setData('dpd_city_id', e.target.value ? Number(e.target.value) : null)}
                                    name="dpd_city_id"
                                    disabled={!dpdProvinceId}
                                >
                                    <option value="">Pilih kota/kabupaten</option>
                                    {dpdCities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>

                                <InputError className="mt-2" message={errors.dpd_city_id} />
                                {dpdProvinceId && (
                                    <p className="text-xs text-muted-foreground">
                                        Provinsi terpilih: {provinces.find((p) => String(p.id) === dpdProvinceId)?.name ?? '-'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="dpc_province_id">Provinsi DPC</Label>

                                <select
                                    id="dpc_province_id"
                                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={dpcProvinceId}
                                    onChange={(e) => {
                                        const nextProvinceId = e.target.value;
                                        setDpcProvinceId(nextProvinceId);
                                        setData('dpc_city_id', null);
                                    }}
                                >
                                    <option value="">Pilih provinsi</option>
                                    {provinces.map((province) => (
                                        <option key={province.id} value={province.id}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="dpc_city_id">Kota DPC</Label>

                                <select
                                    id="dpc_city_id"
                                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={data.dpc_city_id ? String(data.dpc_city_id) : ''}
                                    onChange={(e) => setData('dpc_city_id', e.target.value ? Number(e.target.value) : null)}
                                    name="dpc_city_id"
                                    disabled={!dpcProvinceId}
                                >
                                    <option value="">Pilih kota/kabupaten</option>
                                    {dpcCities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>

                                <InputError className="mt-2" message={errors.dpc_city_id} />
                                {dpcProvinceId && (
                                    <p className="text-xs text-muted-foreground">
                                        Provinsi terpilih: {provinces.find((p) => String(p.id) === dpcProvinceId)?.name ?? '-'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {(dpdCity || dpcCity) && (
                            <div className="rounded-md border border-border bg-background p-3 text-sm text-muted-foreground space-y-1">
                                {dpdCity && (
                                    <p>
                                        DPD saat ini: {dpdCity.name} ({dpdCity.province_name})
                                    </p>
                                )}
                                {dpcCity && (
                                    <p>
                                        DPC saat ini: {dpcCity.name} ({dpcCity.province_name})
                                    </p>
                                )}
                            </div>
                        )}

                        {mustVerifyEmail &&
                            auth.user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        Your email address is
                                        unverified.{' '}
                                        <Link
                                            href="/email/verification-notification"
                                            method="post"
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            Click here to resend the
                                            verification email.
                                        </Link>
                                    </p>

                                    {status ===
                                        'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has
                                                been sent to your email
                                                address.
                                            </div>
                                        )}
                                </div>
                            )}

                        <div className="flex items-center gap-4">
                            <Button
                                disabled={processing}
                                data-test="update-profile-button"
                            >
                                Save
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">
                                    Saved
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>

                {/* <DeleteUser /> */}

                <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Potong Foto Profil</DialogTitle>
                            <DialogDescription>
                                Sesuaikan ukuran dan posisi foto profil Anda (rasio 1:1)
                            </DialogDescription>
                        </DialogHeader>

                        <div className="relative w-full h-64 bg-black rounded-md overflow-hidden mt-4">
                            <Cropper
                                image={imgSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        <DialogFooter className="mt-4 gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={() => setCropDialogOpen(false)}>Batal</Button>
                            <Button type="button" onClick={confirmCrop}>Potong & Simpan</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SettingsLayout>
        </AppLayout>
    );
}
