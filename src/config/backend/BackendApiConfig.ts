// src/config/config.ts
export const API_BASE_URL = 'http://localhost:8080';

export interface ResponseData<T> {
    data: T;
    message?: string;
    statusCode?: number;
}
