// Register.tsx
import React, { useEffect, useState } from 'react';
import { useMutation } from "../hooks/useMutation.ts";
import {Link, useNavigate} from "react-router-dom";

interface SignInRequest {
    email: string;
    username: string;
    password: string;
}

interface SignInResponse {
    user: {
        username: string;
    }
}

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const { mutate, data, loading, error } = useMutation<SignInRequest, SignInResponse>();
    const navigate = useNavigate();

    // 비밀번호 확인 유효성 검사
    useEffect(() => {
        if (confirmPassword && password !== confirmPassword) {
            setPasswordError('비밀번호가 일치하지 않습니다.');
        } else {
            setPasswordError(null);
        }
    }, [password, confirmPassword]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 폼 유효성 검사
        if (!email || !username || !password) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        if (passwordError) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        const signInRequest: SignInRequest = {email, username, password};
        await mutate('/users', 'POST', signInRequest);
    };

    useEffect(() => {
        if (!loading) {
            if (error) {
                console.error(error);
                alert('회원가입에 실패했습니다: ' + error);
            } else if (data) {
                alert(`${data.user.username} 회원가입이 완료되었습니다! 로그인해주세요.`);
                navigate('/sign-in');
            }
        }
    }, [data, loading, error, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            이메일
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="bg-sky-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="nickname" className="block text-gray-700 text-sm font-bold mb-2">
                            닉네임
                        </label>
                        <input
                            type="text"
                            id="nickname"
                            className="bg-sky-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
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
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            비밀번호 확인
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className={`bg-sky-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline ${
                                passwordError ? 'border-red-500' : ''
                            }`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {passwordError && (
                            <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                        disabled={loading}
                    >
                        {loading ? '처리 중...' : '회원가입'}
                    </button>

                    <div className="text-center mt-2">
                        <span className="text-gray-600">이미 계정이 있으신가요?</span>{' '}
                        <Link
                            to="/sign-in"
                            className="text-blue-500 hover:text-blue-700"
                        >
                            로그인하기
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
