/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserApiService from '../services/UserAPIService';
import UnAuthorizedError from "../errors/UnAuthorizedErrors";
import { Copy } from 'lucide-react';

const MyPage = () => {
    const [apiToken, setApiToken] = useState('');
    const [userInfo, setUserInfo] = useState({ nickname: "익명의 개발자" });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [copyFeedback, setCopyFeedback] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await UserApiService.setToken(token)

            const userData = await UserApiService.getUserInfo();
            setUserInfo(userData);
        } catch (err) {
            if (err instanceof UnAuthorizedError) {
                alert('로그인이 만료되었습니다. 로그인 페이지로 이동합니다.');
                UserApiService.logout()
                navigate("/login");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const generateApiToken = async () => {
        try {
            setIsLoading(true);
            const response = await UserApiService.generateApiToken();
            setApiToken(response.token);
        } catch (err) {
            if (err instanceof UnAuthorizedError) {
                alert('로그인이 만료되었습니다. 로그인 페이지로 이동합니다.');
                UserApiService.logout()
                navigate("/login");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        UserApiService.logout();
        navigate('/');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopyFeedback('Copied!');
        setTimeout(() => setCopyFeedback(''), 3000);
    };

    if (isLoading) {
        return <div className="text-white text-center">로딩 중...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">마이페이지</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">사용자 정보</h2>
                    <p className="text-gray-300">닉네임: {userInfo.nickname}</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">API 토큰</h2>
                    {apiToken ? (
                        <div>
                            <p className="text-gray-300 mb-2">생성된 API 토큰:</p>
                            <div className="relative">
                                <pre className="bg-gray-700 p-4 rounded text-white mb-4 overflow-x-auto">
                                    {apiToken}
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(apiToken)}
                                    className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    <Copy size={20} />
                                </button>
                                {copyFeedback && (
                                    <span className="absolute top-2 right-12 bg-green-500 text-white px-2 py-1 rounded text-sm">
                                        {copyFeedback}
                                    </span>
                                )}
                            </div>
                            <p className="text-yellow-400 mb-4">
                                주의: 이 토큰은 한 번만 표시됩니다. 안전한 곳에 저장해주세요.
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-300 mb-4">API 토큰이 필요하시다면 아래의 버튼을 클릭해주세요.</p>
                    )}
                    <button
                        onClick={generateApiToken}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        {apiToken ? 'API 토큰 재발급' : 'API 토큰 생성'}
                    </button>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">계정 관리</h2>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyPage;