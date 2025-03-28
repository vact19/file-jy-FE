// SignIn.tsx (수정 - useMutation 사용, 반환값 없이)
import React, {useEffect, useState} from 'react';
import {useMutation} from "../hooks/useMutation.ts";
import {Link, useNavigate} from "react-router-dom"; // useMutation 훅 임포트!

interface SignInResponse {
    authScheme: string;
    accessToken: string;
    accessTokenExp: string;
    refreshToken: string;
    refreshTokenExp: string;
    username: string;
}

interface SignInRequest {
    loginId: string;
    password: string;
}

const SignIn = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const { mutate, data, loading, error } = useMutation<SignInRequest, SignInResponse>();
    const navigate = useNavigate(); // ✨ useNavigate 훅 사용!

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await mutate('/users/sign-in', 'POST', { loginId: loginId, password });
    };

    useEffect(() => {
        if (!loading) {
            if (error) {
                alert('로그인 왜못함?')
            } else if (data) { // ✨ data 있는지 확인 (로그인 성공 응답 왔는지 확인)
                localStorage.setItem('accessToken', `${data.authScheme} ${data.accessToken}`);
                navigate('/');
            }
        }
    }, [data, loading, error, navigate]); // ✨ 의존성 배열에 data 다시 추가!

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="text" className="block text-gray-700 text-sm font-bold mb-2">
                            ID
                        </label>
                        <input
                            type="text"
                            id="text"
                            className="bg-sky-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="bg-sky-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        로그인
                    </button>
                </form>
                {/* 회원가입 UI 추가 */}
                <div className="text-center mt-6 text-sm">
                    <p className="text-gray-600">
                        회원이 아니신가요?{" "}
                        <Link to="/sign-up" className="text-blue-500 hover:text-blue-700 font-medium">
                            회원가입
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;