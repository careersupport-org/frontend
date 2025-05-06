import React from "react";
import { useNavigate } from "react-router-dom";
interface DescriptionCardProps {
  onClick?: () => void;
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ onClick }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#1D1D22] rounded-lg shadow-lg overflow-hidden p-8 border border-[#23232A]">
      <div className="bg-[#23232A] rounded-full p-4 mb-4 flex justify-center">
        {/* 로드맵 느낌의 아이콘 (지도+경로+목표) */}
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="8" width="32" height="28" rx="6" stroke="#5AC8FA" strokeWidth="2.5" fill="#23232A"/>
          <path d="M12 34C14 28 18 24 22 24C26 24 30 28 32 34" stroke="#5AC8FA" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="22" cy="24" r="2.5" fill="#5AC8FA"/>
          <circle cx="12" cy="34" r="2" fill="#5AC8FA"/>
          <circle cx="32" cy="34" r="2" fill="#5AC8FA"/>
          <circle cx="22" cy="14" r="3" fill="#5AC8FA"/>
          <path d="M22 17V21" stroke="#5AC8FA" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="font-bold text-lg mb-2 text-[#E0E0E6] text-center">AI 기반 맞춤형 로드맵 생성</div>
      <div className="text-[#A0A0B0] text-center mb-6">
        <span>나의 현재 수준과 목표 직무를 입력하면,</span><br />
        <span>AI가 성장에 필요한 역량을 분석하여</span><br />
        <span className="text-[#5AC8FA] font-semibold">맞춤형 개발자 로드맵</span>을 생성해줍니다.<br />
        <br />
        <span>각 단계별로 추천 강의, 논문, 책 등</span><br />
        <span className="text-[#5AC8FA] font-semibold">최적의 학습 자료</span>도 함께 안내해드립니다.
      </div>
      <div className="flex justify-center">
        <button onClick={onClick} className="bg-[#5AC8FA] text-[#17171C] px-6 py-2 rounded-full font-semibold hover:bg-[#3BAFDA] transition">로드맵 생성하기</button>
        <button
            onClick={() => navigate("/my-roadmaps")}
            className="bg-[#23232A] text-[#5AC8FA] px-8 py-3 text-lg rounded-full font-semibold hover:bg-[#3A3A42] border border-[#5AC8FA] transition">
             내 로드맵 보기
        </button>
      </div>
    </div>
  );
};

export default DescriptionCard;
