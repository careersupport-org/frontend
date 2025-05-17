import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AccountService from "../../services/AccountService";
import RoadMapService from "../../services/RoadmapService";
import { Link, useNavigate } from "react-router-dom";

export default function RoadMapInputPage() {
  const [bioExists, setBioExists] = useState<boolean | null>(null);
  const [job, setJob] = useState("");
  const [etc, setEtc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const roadmapService = RoadMapService.getInstance();
  
  useEffect(() => {
    AccountService.getMyProfile()
      .then(profile => {
        setBioExists(!!profile.bio);
      })
      .catch(() => {
        setBioExists(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const id = await roadmapService.createRoadMap(job, etc);
      navigate(`/roadmap/${id}`);
    } catch (err) {
      alert("로드맵 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#17171C] text-white font-sans flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-[#1D1D22] rounded-lg shadow-lg px-6 py-10 w-full max-w-xl mt-12 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-center mb-3 text-[#5AC8FA]">로드맵 생성</h2>
          {bioExists === false && (
            <div className="mb-6 text-[#FDFFFC] text-center font-semibold">
              더 정확한 로드맵 생성을 위해{' '}
              <Link to="/mypage" className="underline text-[#5AC8FA] hover:text-[#82d4fa] transition underline-offset-2">프로필 정보</Link>
              를 입력하는 것을 권장합니다.
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <label className="text-lg font-semibold text-[#E0E0E6]">목표 직무</label>
            <input
              type="text"
              placeholder="예: 프론트엔드 개발자, 데이터 엔지니어 등"
              value={job}
              onChange={e => setJob(e.target.value)}
              className="bg-[#23232A] rounded px-4 py-3 text-white placeholder-[#A0A0B0] focus:outline-none focus:ring-2 focus:ring-[#5AC8FA]"
              required
              disabled={isLoading}
            />
            <label className="text-lg font-semibold text-[#E0E0E6] mt-2">기타 지시사항</label>
            <textarea
              placeholder="예: 선호하는 기술스택, 학습 방식 등"
              value={etc}
              onChange={e => setEtc(e.target.value)}
              className="bg-[#23232A] rounded px-4 py-3 text-white placeholder-[#A0A0B0] focus:outline-none focus:ring-2 focus:ring-[#5AC8FA] min-h-[80px]"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-[#5AC8FA] text-[#17171C] py-3 rounded-full font-semibold hover:bg-[#3BAFDA] transition text-lg mt-2 relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#17171C] mr-2"></div>
                  로드맵 생성 중...
                </div>
              ) : (
                "로드맵 생성하기"
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
} 