import { useEffect } from 'react';

type ThemeType = 'beige' | 'purple' | 'blue';

export const useTheme = (theme?: ThemeType) => {
    useEffect(() => {
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [theme]);

    const setTheme = (newTheme: ThemeType) => {
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return { setTheme };
};
