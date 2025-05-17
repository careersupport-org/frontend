import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from "../../services/AuthService";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

export default function KakaoCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    
    const processKakaoLogin = useCallback(async (code: string) => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        
        try {
            const response = await fetch(`${BACKEND_API}/oauth/kakao/callback?code=${code}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const data = await response.json();
            
            AuthService.setUser({
                id: data.user_id,
                nickname: data.nickname,
                profileImage: data.profile_image,
                token: data.access_token
            });
            
            navigate('/');
        } catch (error) {
            alert('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
            navigate('/login');
        } finally {
            setIsProcessing(false);
        }
    }, [navigate, isProcessing]);
    
    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            navigate('/login');
            return;
        }
        
        processKakaoLogin(code);
    }, [searchParams, navigate, processKakaoLogin]);

    return (
        <div className="min-h-screen bg-[#17171C] text-white font-sans flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">로그인 처리 중...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5AC8FA] mx-auto"></div>
            </div>
        </div>
    );
}