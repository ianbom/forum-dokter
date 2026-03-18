export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    profile_photo?: string | null;
    specialization?: string | null;
    bio?: string | null;
    is_member?: boolean;
    is_suspended?: boolean;
    dpd_city_id?: number | null;
    dpc_city_id?: number | null;
    kta?: string | null;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
