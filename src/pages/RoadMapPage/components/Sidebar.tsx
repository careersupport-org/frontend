import React, { useEffect, useState } from 'react';
import { RoadMapStep } from '../../../services/RoadmapService';
import RoadMapService from '../../../services/RoadmapService';

interface SidebarProps {
  selectedStep: RoadMapStep | null;
  onClose: () => void;
}

export default function Sidebar({ selectedStep, onClose }: SidebarProps) {
  const [details, setDetails] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedStep) return;

    let isCurrentStep = true; // 현재 선택된 Step을 추적하는 플래그
    setDetails([]); // 새로운 step이 선택되면 details 초기화

    const fetchDetails = async () => {
      const stream = await RoadMapService.getInstance().getStepDetail(selectedStep.id);
      const reader = stream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // 이전 Step이 아닌 경우에만 상태 업데이트
          if (!isCurrentStep) break;

          // SSE 형식의 데이터 파싱
          const text = new TextDecoder().decode(value);
          const lines = text.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content && isCurrentStep) {
                  setDetails(prev => [...prev, data.content]);
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error reading stream:', error);
      } finally {
        reader.releaseLock();
      }
    };

    fetchDetails();

    // cleanup 함수: 새로운 Step이 선택되면 이전 작업 취소
    return () => {
      isCurrentStep = false;
    };
  }, [selectedStep]);

  if (!selectedStep) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-[#23232A] shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0">
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-[#3A3A42]">
          <h3 className="text-2xl font-bold text-[#5AC8FA]">Step {selectedStep.step} 상세 정보</h3>
          <button 
            onClick={onClose}
            className="text-[#A0A0B0] hover:text-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3A3A42] scrollbar-track-[#23232A] hover:scrollbar-thumb-[#4A4A52]">
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-[#E0E0E6] mb-2">{selectedStep.title}</h4>
              <p className="text-[#A0A0B0] mb-4">{selectedStep.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedStep.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-[#2A2A32] text-[#5AC8FA] rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="border-t border-[#3A3A42] pt-6">
                <h4 className="text-lg font-semibold text-[#E0E0E6] mb-4">상세 학습 가이드</h4>
                <div className="bg-[#1A1A20] rounded-lg p-4">
                  <div className="text-[#A0A0B0] whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {details[details.length - 1] || ''}
                  </div>
                  {!details[details.length - 1] && (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-[#5AC8FA] animate-pulse">학습 가이드를 불러오는 중...</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-[#3A3A42] pt-6">
              <h4 className="text-lg font-semibold text-[#E0E0E6] mb-4">추천 학습 자료</h4>
              <ul className="space-y-3">
                <li className="flex items-center text-[#A0A0B0] hover:text-white cursor-pointer">
                  <span className="mr-2">📚</span>
                  <span>관련 도서 추천</span>
                </li>
                <li className="flex items-center text-[#A0A0B0] hover:text-white cursor-pointer">
                  <span className="mr-2">🎥</span>
                  <span>추천 강의</span>
                </li>
                <li className="flex items-center text-[#A0A0B0] hover:text-white cursor-pointer">
                  <span className="mr-2">🔗</span>
                  <span>유용한 링크</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
