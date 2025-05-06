import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import RoadMapService, { RoadMapPreview } from "../../services/RoadmapService";

export default function MyRoadMapsPage() {
  const [myRoadmaps, setMyRoadmaps] = useState<RoadMapPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const roadmaps = await RoadMapService.getInstance().getMyRoadMaps();
        setMyRoadmaps(roadmaps);
      } catch (error) {
        console.error("로드맵을 불러오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

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
          ) : myRoadmaps.length === 0 ? (
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
              {myRoadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="bg-[#1D1D22] rounded-2xl p-6 cursor-pointer hover:bg-[#23232A] transition"
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
