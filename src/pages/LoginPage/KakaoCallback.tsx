import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from "../../services/AuthService";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

export default function KakaoCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            navigate('/login');
            return;
        }

        let isMounted = true;

        // 백엔드로 code 전송
        fetch(`${BACKEND_API}/oauth/kakao/callback?code=${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (!isMounted) return;

                AuthService.setUser({
                    id: data.user_id,
                    nickname: data.nickname,
                    profileImage: data.profile_image,
                    token: data.access_token
                });

                navigate('/');
            })
            .catch((error) => {
                if (!isMounted) return;

                alert('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
                navigate('/login');
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#17171C] text-white font-sans flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">로그인 처리 중...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5AC8FA] mx-auto"></div>
            </div>
        </div>
    );
} 