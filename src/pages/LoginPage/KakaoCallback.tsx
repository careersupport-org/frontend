import { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { AuthService } from "../../services/AuthService";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

// 전역 변수로 API 호출 상태 추적
// 이 방법은 컴포넌트가 여러 번 마운트되더라도 API는 한 번만 호출되도록 보장
let isApiCalled = false;

export default function KakaoCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        // 모든 환경변수와 조건 로깅
        console.log("KakaoCallback 렌더링", {
            pathname: location.pathname,
            search: location.search,
            isApiCalled,
            timestamp: new Date().toISOString()
        });

        const code = searchParams.get('code');
        if (!code) {
            console.log("인증 코드가 없음");
            navigate('/login', { replace: true });
            return;
        }
        
        // 전역 플래그로 중복 API 호출 방지
        if (isApiCalled) {
            console.log("이미 API 호출이 진행 중입니다");
            return;
        }
        
        // API 호출 플래그 설정
        isApiCalled = true;
        
        // 디바운스 추가 - 중복 호출 방지를 위한 추가 안전장치
        const apiCallTimeoutId = setTimeout(() => {
            console.log("카카오 로그인 API 호출 시작", code.substring(0, 5) + "...");
            
            // 백엔드로 code 전송
            fetch(`${BACKEND_API}/oauth/kakao/callback?code=${code}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 캐시 제어 헤더 추가
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                // 캐시 방지
                cache: 'no-store'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`서버 응답 오류: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("카카오 로그인 성공");
                    
                    AuthService.setUser({
                        id: data.user_id,
                        nickname: data.nickname,
                        profileImage: data.profile_image,
                        token: data.access_token
                    });
                    
                    // 이동 전에 짧은 지연 추가
                    setTimeout(() => {
                        navigate('/', { replace: true });
                    }, 100);
                })
                .catch(error => {
                    console.error("카카오 로그인 실패:", error);
                    isApiCalled = false; // 에러 시 재시도 가능하도록 플래그 초기화
                    alert('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
                    
                    setTimeout(() => {
                        navigate('/login', { replace: true });
                    }, 100);
                });
        }, 50); // 50ms 지연으로 중복 호출 방지
        
        return () => {
            clearTimeout(apiCallTimeoutId);
        };
    }, []);  // 의존성 배열을 비워서 마운트 시 한 번만 실행

    return (
        <div className="min-h-screen bg-[#17171C] text-white font-sans flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">로그인 처리 중...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5AC8FA] mx-auto"></div>
                <p className="mt-4 text-[#A0A0B0]">카카오 계정으로 로그인 중입니다. 잠시만 기다려주세요...</p>
            </div>
        </div>
    );
}