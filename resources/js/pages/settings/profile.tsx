import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';

import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
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
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem } from '@/types';

type Area = { x: number; y: number; width: number; height: number };

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    const { data, setData, patch, processing, recentlySuccessful, errors } = useForm<{
        name: string;
        email: string;
        specialization: string;
        bio: string;
        profile_photo: File | null;
    }>({
        name: auth.user.name,
        email: auth.user.email,
        specialization: (auth.user.specialization as string) || '',
        bio: (auth.user.bio as string) || '',
        profile_photo: null,
    });

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

                        <div className="grid gap-2">
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
                        </div>

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

                        {mustVerifyEmail &&
                            auth.user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        Your email address is
                                        unverified.{' '}
                                        <Link
                                            href={send()}
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
