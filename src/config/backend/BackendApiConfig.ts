export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface ResponseData<T> {
    data: T;
    message?: string;
    statusCode?: number;
}
