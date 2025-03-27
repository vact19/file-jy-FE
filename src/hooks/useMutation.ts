import { useState } from 'react';
import {API_BASE_URL, ResponseData} from "../config/backend/BackendApiConfig.ts";
import {useNavigate} from "react-router-dom";

export enum ContentType {
    JSON = 'application/json',
    MultipartFormData = 'multipart/form-data',
}

export const useMutation = <TRequest = never, TResponse = never>() => { // 제네릭 타입 T는 응답 데이터 타입
    const [data, setData] = useState<TResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const mutate = async (
        endpoint: string
        , method: 'POST' | 'PUT' | 'DELETE' | 'PATCH'
        , body?: TRequest
        , contentType?: ContentType
    ) => { // 요청 실행 함수 (mutate)
        setLoading(true);
        setError(null);
        try {
            const accessToken = localStorage.getItem('accessToken');

            const headers: HeadersInit = { // ✨ headers 변수 선언
                'Authorization': `${accessToken}`,
            };

            if (contentType !== ContentType.MultipartFormData) { // ✨ Content-Type 설정 (옵션 따라)
                headers['Content-Type'] = ContentType.JSON; // ✨ 기본은 application/json
            }

            let requestBody;
            if (body) {
                if (contentType === ContentType.MultipartFormData) {
                    requestBody = body; // ✨ FormData는 그대로
                } else {
                    requestBody = JSON.stringify(body); // ✨ JSON 문자열로 변환
                }
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method,
                headers, // ✨ headers 적용
                body: requestBody as  | undefined,
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    navigate('/sign-in');
                }
                const errorData = await response.json(); // 에러 응답도 JSON으로 파싱
                throw new Error(errorData.message || 'Mutation failed'); // 에러 메시지 사용
            }
            const responseData: ResponseData<TResponse> = await response.json();
            setData(responseData.data);
            return responseData.data;
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred'); // Error 객체가 아닌 경우 처리
            }
            return null; // 에러 발생 시 null 반환 (또는 undefined, 필요에 따라)
        } finally {
            setLoading(false);
        }
    };

    return { mutate, data, loading, error }; // mutate 함수, 상태 반환
};