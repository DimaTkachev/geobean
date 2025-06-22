const getApiBaseUrl = () => {
    const hostname = window.location.hostname;

    if (hostname.includes('loca.lt')) {
        return 'https://geobean-api.loca.lt';
    }

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5001';
    }

    // Для IP адресов в локальной сети
    return `http://${hostname}:5001`;
};

const API_BASE_URL = getApiBaseUrl();

const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

const isLocalhost = (): boolean => {
    if (typeof window === 'undefined') return false;
    return (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.startsWith('192.168.') ||
        window.location.hostname.startsWith('10.') ||
        window.location.hostname.endsWith('.local')
    );
};

const DELAY = 300;

export const fetchApi = async <T>(
    url: string,
    options?: RequestInit
): Promise<T> => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    const startTime = Date.now();
    const minDelay = isLocalhost() ? DELAY : 0;

    // Добавляем заголовки для LocalTunnel
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options?.headers as Record<string, string>) || {}),
    };

    // Если используем LocalTunnel, добавляем заголовок для обхода пароля
    if (API_BASE_URL.includes('loca.lt')) {
        headers['bypass-tunnel-reminder'] = 'true';
    }

    const requestOptions = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(fullUrl, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (minDelay > 0) {
            const elapsed = Date.now() - startTime;
            const remainingDelay = Math.max(0, minDelay - elapsed);
            if (remainingDelay > 0) {
                await sleep(remainingDelay);
            }
        }

        return data;
    } catch (error) {
        if (minDelay > 0) {
            const elapsed = Date.now() - startTime;
            const remainingDelay = Math.max(0, minDelay - elapsed);
            if (remainingDelay > 0) {
                await sleep(remainingDelay);
            }
        }
        throw error;
    }
};

export const debouncedFetch = async (
    url: string,
    options?: RequestInit
): Promise<Response> => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    const startTime = Date.now();
    const minDelay = isLocalhost() ? DELAY : 0;

    // Добавляем заголовки для LocalTunnel
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options?.headers as Record<string, string>) || {}),
    };

    // Если используем LocalTunnel, добавляем заголовок для обхода пароля
    if (API_BASE_URL.includes('loca.lt')) {
        headers['bypass-tunnel-reminder'] = 'true';
    }

    const requestOptions = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(fullUrl, requestOptions);

        if (minDelay > 0) {
            const elapsed = Date.now() - startTime;
            const remainingDelay = Math.max(0, minDelay - elapsed);
            if (remainingDelay > 0) {
                await sleep(remainingDelay);
            }
        }

        return response;
    } catch (error) {
        if (minDelay > 0) {
            const elapsed = Date.now() - startTime;
            const remainingDelay = Math.max(0, minDelay - elapsed);
            if (remainingDelay > 0) {
                await sleep(remainingDelay);
            }
        }
        throw error;
    }
};
