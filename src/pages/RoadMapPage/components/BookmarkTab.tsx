import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RoadMapService, { StepPreview } from '../../../services/RoadmapService';
import { ForbiddenException, UnauthorizedException } from '../../../common/exceptions';

interface BookmarkTabProps {
  bookMarkedSteps: StepPreview[];
  setBookMarkedSteps: React.Dispatch<React.SetStateAction<StepPreview[]>>;
}

export default function BookmarkTab({ bookMarkedSteps, setBookMarkedSteps }: BookmarkTabProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const fetchBookmarks = useCallback(async () => {
    try {
      const bookmarks = await RoadMapService.getInstance().getBookMarks();
      setBookMarkedSteps(bookmarks);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        alert("로그인 후 이용 가능한 서비스입니다.");
        navigate("/login");
      }
      if (error instanceof ForbiddenException) {
        alert("자신의 로드맵만 조회할 수 있습니다.");
        navigate("/");
      }
      console.error('북마크를 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setBookMarkedSteps]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.bookmark-tab')) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleRemoveBookmark = (stepId: string) => {
    setBookMarkedSteps(prev => prev.filter(step => step.stepId !== stepId));
  };

  return (
    <div className="bookmark-tab bg-[#1D1D22] rounded-2xl overflow-hidden">
      <div
        className="bg-[#23232A] p-4 cursor-pointer hover:bg-[#2A2A32] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-bold text-[#5AC8FA] flex items-center justify-between">
          <span>북마크</span>
          <svg
            className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </h2>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[300px]' : 'max-h-0'}`}
      >
        <div className="p-4">
          {isLoading ? (
            <div className="text-[#A0A0B0] text-center">북마크를 불러오는 중...</div>
          ) : bookMarkedSteps.length === 0 ? (
            <div className="text-[#A0A0B0] text-center">북마크된 단계가 없습니다</div>
          ) : (
            <div className="space-y-2">
              {bookMarkedSteps.map((step) => (
                <div
                  key={step.stepId}
                  className="p-3 hover:bg-[#23232A] transition cursor-pointer group rounded-lg"
                  onClick={() => navigate(`/roadmap/${step.roadMapId}?step=${step.stepId}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[#E0E0E6] truncate">{step.title}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBookmark(step.stepId);
                      }}
                      className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
