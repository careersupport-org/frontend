import React, { useEffect, useState } from 'react';
import { RoadMapStep } from '../../../services/RoadmapService';
import RoadMapService from '../../../services/RoadmapService';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  selectedStep: RoadMapStep | null;
  onClose: () => void;
  onEditResource: () => void;
  learningResources: string[];
  isLoadingResources: boolean;
  roadMapId: string;
}

// URL 미리보기용 임시 컴포넌트
interface EmbedPreviewProps {
  url: string;
}

const EmbedPreview: React.FC<EmbedPreviewProps> = ({ url }) => {
  const [meta, setMeta] = useState<{ title?: string; description?: string; image?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMeta({ title: url });
  }, [url]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-[#1A1A20] rounded-lg hover:bg-[#2A2A32] transition-colors flex gap-4 items-center"
      style={{ minHeight: 80 }}
    >
      <div className="w-20 h-20 bg-[#23232A] flex-shrink-0 flex items-center justify-center text-2xl text-[#5AC8FA]">
        <span>🔗</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[#E0E0E6] font-medium mb-1 truncate">{loading ? '로딩 중...' : meta.title || url}</div>
        <div className="text-[#A0A0B0] text-sm line-clamp-2">{meta.description || url}</div>
      </div>
    </a>
  );
};

export default function Sidebar({ selectedStep, onClose, onEditResource, learningResources, isLoadingResources, roadMapId }: SidebarProps) {
  const [details, setDetails] = useState<string[]>([]);
  const [isCreatingSubRoadmap, setIsCreatingSubRoadmap] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [bookmarkSuccess, setBookmarkSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedStep) return;

    let isCurrentStep = true;
    setDetails([]);

    const fetchDetails = async () => {
      const stream = await RoadMapService.getInstance().getStepDetail(selectedStep.id);
      const reader = stream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (!isCurrentStep) break;

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

    return () => {
      isCurrentStep = false;
    };
  }, [selectedStep]);

  const handleCreateSubRoadmap = async () => {
    if (!selectedStep) return;
    setIsCreatingSubRoadmap(true);
    try {
      const newSubRoadmapId = await RoadMapService.getInstance().createSubRoadMap(selectedStep.id);
      alert('서브 로드맵이 성공적으로 생성되었습니다!');
      navigate(`/roadmap/${newSubRoadmapId}`);
    } catch (error) {
      console.error('Failed to create sub roadmap:', error);
      alert('서브 로드맵 생성에 실패했습니다.');
    } finally {
      setIsCreatingSubRoadmap(false);
    }
  };

  const handleNavigateToSubRoadmap = () => {
    if (!selectedStep?.subRoadMapId) return;
    navigate(`/roadmap/${selectedStep.subRoadMapId}`);
  };

  const handleBookmark = async () => {
    if (isBookmarking || !selectedStep) return;
    setIsBookmarking(true);
    setBookmarkSuccess(false);
    try {
      const newStatus = !selectedStep.isBookmarked;
      await RoadMapService.getInstance().updateBookMarkStatus(
        roadMapId,
        selectedStep.id,
        selectedStep.title,
        newStatus
      );
      selectedStep.isBookmarked = newStatus;
      setBookmarkSuccess(true);
      setTimeout(() => setBookmarkSuccess(false), 1200);
    } catch (e) {
      alert('북마크 상태 변경에 실패했습니다.');
    } finally {
      setIsBookmarking(false);
    }
  };

  if (!selectedStep) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-[#23232A] shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0">
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-[#3A3A42]">
          <h3 className="text-2xl font-bold text-[#5AC8FA] flex items-center gap-2">
            Step {selectedStep.step} 상세 정보
            <button
              onClick={handleBookmark}
              disabled={isBookmarking}
              className="ml-2 p-1 rounded hover:bg-[#2A2A32] transition-colors"
              title={selectedStep.isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={selectedStep.isBookmarked || bookmarkSuccess ? '#FFD600' : 'none'}
                stroke="#FFD600"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-6 h-6 ${isBookmarking ? 'animate-pulse' : ''}`}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
            {bookmarkSuccess && <span className="text-[#FFD600] text-sm ml-1">저장됨!</span>}
          </h3>
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
              <div className="flex items-center mb-4">
                <h4 className="text-lg font-semibold text-[#E0E0E6]">추천 학습 자료</h4>
                <button
                  className="ml-2 p-1 rounded hover:bg-[#2A2A32] text-[#A0A0B0] hover:text-[#5AC8FA] transition-colors"
                  onClick={onEditResource}
                  title="수정하기"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 00.707-.293l9.414-9.414a2 2 0 000-2.828l-3.172-3.172a2 2 0 00-2.828 0l-9.414 9.414A1 1 0 004 15.414V20z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              {isLoadingResources ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-[#5AC8FA] animate-pulse">추천 학습 자료를 불러오는 중...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {learningResources.map((url, idx) => (
                    <EmbedPreview key={url + idx} url={url} />
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-[#3A3A42] pt-6">
              {selectedStep.subRoadMapId ? (
                <button
                  onClick={handleNavigateToSubRoadmap}
                  className="w-full py-3 px-4 rounded-lg bg-[#5AC8FA] text-[#1A1A20] hover:bg-[#4AB8EA] transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>서브 로드맵으로 이동</span>
                </button>
              ) : (
                <button
                  onClick={handleCreateSubRoadmap}
                  disabled={isCreatingSubRoadmap}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    isCreatingSubRoadmap
                      ? 'bg-[#2A2A32] text-[#3A3A42] cursor-not-allowed'
                      : 'bg-[#5AC8FA] text-[#1A1A20] hover:bg-[#4AB8EA]'
                  }`}
                >
                  {isCreatingSubRoadmap ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>서브 로드맵 생성 중...</span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>서브 로드맵 생성</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
