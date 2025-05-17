import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import RoadMapService, { RoadMapPreview } from "../../services/RoadmapService";
import { ForbiddenException, UnauthorizedException } from "../../common/exceptions";
export default function MyRoadMapsPage() {
  const [roadmaps, setRoadmaps] = useState<RoadMapPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRoadmaps = useCallback(async () => {
    try {
      const data = await RoadMapService.getInstance().getMyRoadMaps();
      setRoadmaps(data);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        alert("로그인 후 이용 가능한 서비스입니다.");
        navigate("/login");
      }
      console.error('Failed to fetch roadmaps:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

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
      if (error instanceof UnauthorizedException) {
        alert("로그인 후 이용 가능한 서비스입니다.");
        navigate("/login");
      }
      if (error instanceof ForbiddenException) {
        alert("자신의 로드맵만 삭제할 수 있습니다.");
        return;
      }
      console.error('로드맵 삭제에 실패했습니다:', error);
      alert('로드맵 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#17171C] text-white font-sans flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4">
        <div className="w-full max-w-4xl mt-16 mb-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#5AC8FA]">내 로드맵</h1>
            <button
              onClick={() => navigate("/roadmap/input")}
              className="bg-[#5AC8FA] text-[#17171C] px-6 py-2 rounded-full font-semibold hover:bg-[#3BAFDA] transition"
            >
              새 로드맵 만들기
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-[#5AC8FA] animate-pulse">로드맵을 불러오는 중...</div>
            </div>
          ) : roadmaps.length === 0 ? (
            <div className="bg-[#1D1D22] rounded-2xl p-8 text-center">
              <div className="text-xl text-[#A0A0B0] mb-4">아직 생성한 로드맵이 없습니다</div>
              <button
                onClick={() => navigate("/roadmap/input")}
                className="bg-[#5AC8FA] text-[#17171C] px-6 py-2 rounded-full font-semibold hover:bg-[#3BAFDA] transition"
              >
                첫 로드맵 만들기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="bg-[#1D1D22] rounded-2xl p-6 cursor-pointer hover:bg-[#23232A] transition relative group"
                  onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                >
                  <div className="text-xl font-bold text-[#5AC8FA] mb-3">{roadmap.title}</div>
                  <div className="space-y-2">
                    <div className="text-[#A0A0B0] text-sm">
                      생성일: {new Date(roadmap.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-[#A0A0B0] text-sm">
                      수정일: {new Date(roadmap.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
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
      </main>
      <Footer />
    </div>
  );
}
