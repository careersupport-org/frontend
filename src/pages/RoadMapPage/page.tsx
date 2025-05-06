import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RoadMapService, { RoadMap, RoadMapStep } from "../../services/RoadmapService";
import Sidebar from "./components/Sidebar";

export default function RoadMapPage() {
  const { id } = useParams<{ id: string }>();
  const [roadMap, setRoadMap] = useState<RoadMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<RoadMapStep | null>(null);

  useEffect(() => {
    const fetchRoadMap = async () => {
      try {
        if (!id) {
          throw new Error("로드맵 ID가 없습니다.");
        }
        const data = await RoadMapService.getInstance().getRoadMap(id);
        if (!data) {
          throw new Error("로드맵을 찾을 수 없습니다.");
        }
        setRoadMap(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "로드맵을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadMap();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#17171C] text-white font-sans flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl">로드맵을 불러오는 중...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !roadMap) {
    return (
      <div className="min-h-screen bg-[#17171C] text-white font-sans flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-500">{error || "로드맵을 찾을 수 없습니다."}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#17171C] text-white font-sans flex flex-col">
      <Header />
      <main className="flex-1 flex px-4 py-12 mx-auto">
        <div className="w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#5AC8FA]">{roadMap.title}</h2>
          <div>
            {roadMap.steps.map((step, idx) => (
              <div 
                key={step.step} 
                className="flex flex-col items-center w-full mb-8 last:mb-0"
              >
                <div 
                  className={`w-full bg-[#23232A] rounded-xl py-6 px-20 shadow-lg cursor-pointer transition-all duration-200 hover:bg-[#2A2A32] ${
                    selectedStep?.step === step.step ? 'ring-2 ring-[#5AC8FA]' : ''
                  }`}
                  onClick={() => setSelectedStep(step)}
                >
                  <div className="text-lg font-bold text-[#5AC8FA] mb-1">STEP {step.step}</div>
                  <div className="text-xl font-semibold mb-2 text-[#E0E0E6]">{step.title}</div>
                  <div className="text-[#A0A0B0] mb-4">{step.description}</div>
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-[#2A2A32] text-[#5AC8FA] rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {idx < roadMap.steps.length - 1 && (
                  <div className="flex flex-col items-center mt-4">
                    <div className="flex justify-center items-center -mt-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5v14M12 19l-5-5M12 19l5-5" stroke="#5AC8FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Sidebar 
          selectedStep={selectedStep} 
          onClose={() => setSelectedStep(null)} 
        />
      </main>
      <Footer />
    </div>
  );
}
