const API_BASE_URL = 'http://localhost:5001';

export const fetchApi = async <T>(
    url: string,
    options?: RequestInit
): Promise<T> => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    const response = await fetch(fullUrl, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};
