const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export class ApiError extends Error {
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
        const errorData = await response.json().catch(() => ({
            message: 'Identifiants invalides'
        }));
        
        let message = 'Identifiants invalides';
        if (errorData.message) {
            message = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
        }

        const isAuthRoute = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');

        // Only redirect to /login if it's an authenticated session expiration, NOT during login/register
        if (!isAuthRoute && typeof window !== 'undefined') {
            localStorage.removeItem('btp_token');
            localStorage.removeItem('btp_auth');
            localStorage.removeItem('btp_user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        throw new ApiError(401, message);
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            message: response.statusText || 'Une erreur est survenue'
        }));
        
        let message = 'Une erreur est survenue';
        if (errorData.message) {
            message = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
        }

        throw new ApiError(response.status, message);
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
