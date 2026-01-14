const API_URL = process.env.API_URL;

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('btp_token') : null;
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const config: RequestInit = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('btp_token');
            localStorage.removeItem('btp_auth');
            window.location.href = '/login';
        }
        throw new ApiError(401, 'Unauthorized');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.message || 'An error occurred');
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) => 
        request<T>(endpoint, { ...options, method: 'GET' }),
    
    post: <T>(endpoint: string, body: any, options?: RequestInit) => 
        request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    
    put: <T>(endpoint: string, body: any, options?: RequestInit) => 
        request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    
    delete: <T>(endpoint: string, options?: RequestInit) => 
        request<T>(endpoint, { ...options, method: 'DELETE' }),
};
