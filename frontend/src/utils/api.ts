const API_BASE_URL = 'http://localhost:5001';

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

    try {
        const response = await fetch(fullUrl, options);
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

    try {
        const response = await fetch(fullUrl, options);

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
