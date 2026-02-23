import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-transparent">
                <AppLogoIcon className="size-8 object-contain dark:brightness-0 dark:invert" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-lg">
                    IKATEMI
                </span>
            </div>
        </>
    );
}
