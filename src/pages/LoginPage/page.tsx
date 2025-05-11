import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    // 카카오 OAuth 로그인 페이지로 리다이렉트
    window.location.href = `${BACKEND_API}/oauth/kakao/login`;
  };

  return (
    <div className="min-h-screen bg-[#17171C] text-white font-sans flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-[#1D1D22] rounded-lg shadow-lg p-8 w-full max-w-md mt-12 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-center mb-2 text-[#5AC8FA]">로그인</h2>
          <p className="text-[#A0A0B0] text-center mb-8">AI 기반 개발자 취업 지원 플랫폼에 오신 것을 환영합니다.<br />로그인은 카카오 계정으로만 가능합니다.</p>
          <button
            onClick={handleKakaoLogin}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-bold text-[#3C1E1E] bg-[#FEE500] hover:bg-[#ffe066] transition text-lg shadow"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="12" cy="12" rx="12" ry="12" fill="#3C1E1E" />
              <path d="M7.5 13.5V10.5H9V13.5H7.5ZM10.5 13.5V10.5H12V13.5H10.5ZM13.5 13.5V10.5H15V13.5H13.5Z" fill="#FEE500" />
            </svg>
            카카오로 1초만에 시작하기
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
