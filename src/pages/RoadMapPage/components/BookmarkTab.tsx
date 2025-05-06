import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoadMapService, { StepPreview } from '../../../services/RoadmapService';

export default function BookmarkTab() {
  const [bookmarks, setBookmarks] = useState<StepPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await RoadMapService.getInstance().getBookMarks();
        setBookmarks(data);
      } catch (error) {
        console.error('북마크를 불러오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="bg-[#1D1D22] rounded-2xl overflow-hidden">
      <div
        className="flex items-center justify-between bg-[#23232A] p-4 cursor-pointer hover:bg-[#2A2A32] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-bold text-[#5AC8FA]">즐겨찾기</h2>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[400px]' : 'max-h-0'
        }`}
      >
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-[#5AC8FA] animate-pulse">북마크를 불러오는 중...</div>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-[#A0A0B0] mb-2">아직 북마크한 단계가 없습니다</div>
              <div className="text-sm text-[#A0A0B0]">
                로드맵의 단계를 북마크하여 빠르게 접근할 수 있습니다
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.roadMapId + '-' + bookmark.stepId}
                  className="bg-[#23232A] rounded-lg p-4 cursor-pointer hover:bg-[#2A2A32] transition"
                  onClick={() => {
                    navigate(`/roadmap/${bookmark.roadMapId}?step=${bookmark.stepId}`);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-[#5AC8FA]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    <span className="text-[#E0E0E6]">{bookmark.title}</span>
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
