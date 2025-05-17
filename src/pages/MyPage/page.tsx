import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import AccountService from "../../services/AccountService";
import RoadMapService, { RoadMapPreview } from "../../services/RoadmapService";
import { AuthService } from "../../services/AuthService";

export default function MyPage() {
  const user = AuthService.getUser();
  const [bio, setBio] = useState("");
  const [myRoadmaps, setMyRoadmaps] = useState<RoadMapPreview[]>([]);
  const navigate = useNavigate();

  const fetchRoadmaps = async () => {
    try {
      const roadmaps = await RoadMapService.getInstance().getMyRoadMaps();
      setMyRoadmaps(roadmaps);
    } catch (error) {
      console.error("로드맵을 불러오는데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    // 마이페이지 진입 시 프로필 불러오기
    AccountService.getMyProfile()
      .then(profile => {
        setBio(profile.bio);
      })
      .catch(() => {
        setBio("");
      });
    // 내 로드맵 불러오기
    fetchRoadmaps();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AccountService.saveMyProfile({ bio });
      alert("자기소개 저장에 성공했습니다.");
    } catch (err) {
      alert("자기소개 저장에 실패했습니다.");
    }
  };

  const handleWithdraw = () => {
    // 실제 회원탈퇴 로직 필요 (API 연동 등)
    AuthService.logout();
    navigate("/");
  };

  const handleDelete = async (e: React.MouseEvent, roadmapId: string) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    if (!window.confirm('정말로 이 로드맵을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await RoadMapService.getInstance().deleteRoadmap(roadmapId);
      await fetchRoadmaps(); // 로드맵 목록 새로고침
      alert('로드맵이 삭제되었습니다.');
    } catch (error) {
      console.error('로드맵 삭제에 실패했습니다:', error);
      alert('로드맵 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#17171C] text-white font-sans flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-[#1D1D22] rounded-2xl shadow-2xl p-12 w-full max-w-2xl mt-16 mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#5AC8FA]">마이페이지</h2>

          {/* 기본 정보 */}
          <div className="mb-10 p-6 rounded-xl bg-[#23232A] flex flex-col gap-2">
            <div className="text-2xl font-semibold text-[#E0E0E6] mb-2">기본 정보</div>
            <div className="text-lg"><span className="text-[#A0A0B0]">이름</span>: <span className="font-semibold text-[#E0E0E6]">{user?.nickname}</span></div>
          </div>

          {/* 자기소개 */}
          <div className="mb-10 p-6 rounded-xl bg-[#23232A] flex flex-col gap-4">
            <div className="text-2xl font-semibold text-[#E0E0E6] mb-2">자기소개</div>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <textarea
                className="bg-[#17171C] rounded px-6 py-4 text-lg text-white placeholder-[#A0A0B0] focus:outline-none focus:ring-2 focus:ring-[#5AC8FA] min-h-[120px]"
                placeholder="자기소개를 입력하세요."
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
              <button type="submit" className="bg-[#5AC8FA] text-[#17171C] py-3 text-lg rounded-full font-semibold hover:bg-[#3BAFDA] transition">저장</button>
            </form>
          </div>

          {/* 내가 저장한 로드맵 */}
          <div className="mb-10 p-6 rounded-xl bg-[#23232A] flex flex-col gap-4">
            <div className="text-2xl font-semibold text-[#E0E0E6] mb-2">내가 저장한 로드맵</div>
            {myRoadmaps.length === 0 ? (
              <div className="text-[#A0A0B0]">저장한 로드맵이 없습니다.</div>
            ) : (
              <div className="space-y-4">
                {myRoadmaps.map((roadmap) => (
                  <div
                    key={roadmap.id}
                    className="bg-[#1A1A20] rounded-lg p-4 cursor-pointer hover:bg-[#23232A] transition relative group"
                    onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                  >
                    <div className="text-lg font-bold text-[#5AC8FA] mb-2">{roadmap.title}</div>
                    <div className="text-[#A0A0B0] text-sm">생성일: {roadmap["createdAt"]}</div>
                    <div className="text-[#A0A0B0] text-sm">수정일: {roadmap["updatedAt"]}</div>
                    <button
                      onClick={(e) => handleDelete(e, roadmap.id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 계정 관리 */}
          <div className="p-6 rounded-xl bg-[#23232A] flex flex-col gap-4 items-center">
            <div className="text-2xl font-semibold text-[#E0E0E6] mb-2">계정 관리</div>
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => AuthService.logout()}
                className="bg-[#23232A] text-[#E0E0E6] px-8 py-3 text-lg rounded-full font-semibold hover:bg-[#3BAFDA] border border-[#5AC8FA] transition"
              >
                로그아웃
              </button>
              <button
                onClick={handleWithdraw}
                className="bg-red-600 text-white px-8 py-3 text-lg rounded-full font-semibold hover:bg-red-700 transition"
              >
                회원 탈퇴
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
