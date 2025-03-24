import { useState, useEffect } from 'react';
import {API_BASE_URL, ResponseData} from "../config/backend/BackendApiConfig.ts";
import {useNavigate} from "react-router-dom";

interface FetchResult<T> { // FetchResult 인터페이스 추가!
    data: T | null;
    loading: boolean;
    error: string | null;
    API_BASE_URL: string;
    reload: () => void;
}

export const useFetch = <T>(endpoint: string): FetchResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchData = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const accessToken = localStorage.getItem('accessToken');

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Authorization': `${accessToken}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    navigate('/sign-in');
                }
                throw new Error('Failed to fetch response');
            }
            // 응답 전체를 ResponseData<T> 타입으로 파싱
            const responseData: ResponseData<T> = await response.json();

            // setData 할 때 responseData.data 만 추출해서 저장!
            setData(responseData.data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    return { data, loading, error, API_BASE_URL, reload: fetchData };
};