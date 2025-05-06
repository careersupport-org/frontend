import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RoadMapService, { RoadMap, RoadMapStep } from "../../services/RoadmapService";
import Sidebar from "./components/Sidebar";

// 추천 학습 자료 수정용 모달 컴포넌트
interface EditResourceModalProps {
  open: boolean;
  onClose: () => void;
  resources: string[];
  onSave: (urls: string[]) => void;
}

const EditResourceModal: React.FC<EditResourceModalProps> = ({ open, onClose, resources, onSave }) => {
  const [urls, setUrls] = useState<string[]>(resources);
  const [input, setInput] = useState('');

  useEffect(() => {
    setUrls(resources);
  }, [resources, open]);

  const handleAdd = () => {
    if (input.trim() && !urls.includes(input.trim())) {
      setUrls([...urls, input.trim()]);
      setInput('');
    }
  };
  const handleDelete = (idx: number) => {
    setUrls(urls.filter((_, i) => i !== idx));
  };
  const handleSave = () => {
    onSave(urls);
    onClose();
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#23232A] rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-[#5AC8FA] mb-4">추천 학습 자료 수정</h3>
        <div className="space-y-2 mb-4">
          {urls.map((url, idx) => (
            <div key={url + idx} className="flex items-center bg-[#1A1A20] rounded px-3 py-2 mb-1">
              <span className="flex-1 text-[#E0E0E6] truncate">{url}</span>
              <button className="ml-2 text-[#FA5A5A] hover:text-red-400" onClick={() => handleDelete(idx)} title="삭제">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded bg-[#1A1A20] text-[#E0E0E6] border border-[#3A3A42] focus:outline-none"
            placeholder="URL 입력 후 Enter"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          />
          <button
            className="px-3 py-2 rounded bg-[#5AC8FA] text-[#1A1A20] hover:bg-[#4AB8EA] font-bold"
            onClick={handleAdd}
            type="button"
          >추가</button>
        </div>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-[#3A3A42] text-[#E0E0E6] hover:bg-[#444454]" onClick={onClose}>취소</button>
          <button className="px-4 py-2 rounded bg-[#5AC8FA] text-[#1A1A20] hover:bg-[#4AB8EA] font-bold" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
};

export default function RoadMapPage() {
  const { id } = useParams<{ id: string }>();
  const [roadMap, setRoadMap] = useState<RoadMap | null>(null);
  const [selectedStep, setSelectedStep] = useState<RoadMapStep | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<{
    id: string;
    title: string;
    description: string;
    tags: string;
  } | null>(null);
  // 추천 학습자료 관련 상태
  const [learningResources, setLearningResources] = useState<string[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchRoadMap = async () => {
      try {
        const data = await RoadMapService.getInstance().getRoadMap(id);
        if (data) {
          setRoadMap(data);
          setError(null);
        } else {
          setError('로드맵을 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('로드맵을 불러오는데 실패했습니다.');
        console.error('Failed to fetch roadmap:', err);
      }
    };

    fetchRoadMap();
  }, [id]);

  // 선택된 스텝이 바뀔 때마다 추천 학습자료 fetch
  useEffect(() => {
    if (!selectedStep) return;
    setIsLoadingResources(true);
    setLearningResources([]);
    const fetchLearningResources = async () => {
      try {
        const resources = await RoadMapService.getInstance().getRecommendLearningResource(selectedStep.id);
        setLearningResources(resources);
      } catch (error) {
        setLearningResources([]);
      } finally {
        setIsLoadingResources(false);
      }
    };
    fetchLearningResources();
  }, [selectedStep]);

  const handleSaveResources = async (urls: string[]) => {
    if (!selectedStep) return;
    await RoadMapService.getInstance().updateRecommendLearningResource(selectedStep.id, urls);
    setLearningResources(urls);
  };

  const handleStepClick = (step: RoadMapStep) => {
    if (!isEditMode) {
      setSelectedStep(step);
    }
  };

  const handleStepMove = async (stepId: string, direction: 'up' | 'down') => {
    if (!roadMap) return;

    const currentIndex = roadMap.steps.findIndex(step => step.id === stepId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= roadMap.steps.length) return;

    const newSteps = [...roadMap.steps];
    const [movedStep] = newSteps.splice(currentIndex, 1);
    newSteps.splice(newIndex, 0, movedStep);

    // 단계 번호 업데이트
    const updatedSteps = newSteps.map((step, index) => ({
      ...step,
      step: index + 1
    }));

    setRoadMap(prev => prev ? { ...prev, steps: updatedSteps } : null);
  };

  const handleStepRemove = async (stepId: string) => {
    if (!roadMap) return;

    const newSteps = roadMap.steps.filter(step => step.id !== stepId);
    const updatedSteps = newSteps.map((step, index) => ({
      ...step,
      step: index + 1
    }));

    setRoadMap(prev => prev ? { ...prev, steps: updatedSteps } : null);
  };

  const handleAddStep = () => {
    if (!roadMap) return;

    const newStep: RoadMapStep = {
      id: crypto.randomUUID().toString(),
      step: roadMap.steps.length + 1,
      title: '새로운 단계',
      description: '단계 설명을 입력하세요',
      subRoadMapId: null,
      tags: []
    };

    setRoadMap(prev => prev ? { ...prev, steps: [...prev.steps, newStep] } : null);
  };

  const handleStepEdit = (step: RoadMapStep) => {
    setEditingStep({
      id: step.id,
      title: step.title,
      description: step.description,
      tags: step.tags.join(', ')
    });
  };

  const handleStepSave = () => {
    if (!editingStep || !roadMap) return;

    const updatedSteps = roadMap.steps.map(step => {
      if (step.id === editingStep.id) {
        return {
          ...step,
          title: editingStep.title,
          description: editingStep.description,
          tags: editingStep.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
      }
      return step;
    });

    setRoadMap(prev => prev ? { ...prev, steps: updatedSteps } : null);
    setEditingStep(null);
  };

  const handleStepCancel = () => {
    setEditingStep(null);
  };

  const handleEditModeToggle = async () => {
    if (isEditMode && roadMap) {
      try {
        await RoadMapService.getInstance().update(roadMap);
        setIsEditMode(false);
        setEditingStep(null);
      } catch (err) {
        console.error('Failed to update roadmap:', err);
        // 에러 처리 로직 추가 가능
      }
    } else {
      setIsEditMode(true);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#1A1A20] text-white p-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!roadMap) {
    return (<>
        <div className="min-h-screen bg-[#1A1A20] text-white p-8">
        <Header />
            <div className="animate-pulse">로드맵을 불러오는 중...</div>
        <Footer />
        </div>    
    </>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A20] text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#5AC8FA]">{roadMap.title}</h1>
          <div className="flex gap-4">
            <button
              onClick={handleEditModeToggle}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isEditMode
                  ? 'bg-[#5AC8FA] text-[#1A1A20]'
                  : 'bg-[#2A2A32] text-[#5AC8FA] hover:bg-[#3A3A42]'
              }`}
            >
              {isEditMode ? '편집 완료' : '편집 모드'}
            </button>
            {isEditMode && (
              <button
                onClick={handleAddStep}
                className="px-4 py-2 bg-[#2A2A32] text-[#5AC8FA] rounded-lg hover:bg-[#3A3A42] transition-colors"
              >
                단계 추가
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {roadMap.steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative bg-[#2A2A32] rounded-lg p-6 transition-all ${
                isEditMode ? 'cursor-default' : 'cursor-pointer hover:bg-[#3A3A42]'
              }`}
              onClick={() => handleStepClick(step)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold text-[#5AC8FA]">Step {step.step}</span>
                    {editingStep?.id === step.id ? (
                      <input
                        type="text"
                        value={editingStep.title}
                        onChange={(e) => setEditingStep(prev => prev ? { ...prev, title: e.target.value } : null)}
                        className="flex-1 bg-[#1A1A20] text-[#E0E0E6] text-xl font-semibold px-3 py-1 rounded"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <h3 className="text-xl font-semibold text-[#E0E0E6]">{step.title}</h3>
                    )}
                  </div>
                  {editingStep?.id === step.id ? (
                    <textarea
                      value={editingStep.description}
                      onChange={(e) => setEditingStep(prev => prev ? { ...prev, description: e.target.value } : null)}
                      className="w-full bg-[#1A1A20] text-[#A0A0B0] mb-4 px-3 py-2 rounded resize-none"
                      rows={3}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <p className="text-[#A0A0B0] mb-4">{step.description}</p>
                  )}
                  {editingStep?.id === step.id ? (
                    <div className="mb-4">
                      <input
                        type="text"
                        value={editingStep.tags}
                        onChange={(e) => setEditingStep(prev => prev ? { ...prev, tags: e.target.value } : null)}
                        placeholder="태그를 쉼표로 구분하여 입력하세요"
                        className="w-full bg-[#1A1A20] text-[#5AC8FA] px-3 py-2 rounded"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <p className="text-sm text-[#A0A0B0] mt-1">쉼표(,)로 구분하여 입력하세요</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-[#1A1A20] text-[#5AC8FA] rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {isEditMode && (
                  <div className="flex gap-2 ml-4">
                    {editingStep?.id === step.id ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStepSave();
                          }}
                          className="p-2 bg-[#1A1A20] text-green-500 rounded-lg hover:bg-[#2A2A32]"
                        >
                          ✓
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStepCancel();
                          }}
                          className="p-2 bg-[#1A1A20] text-[#5AC8FA] rounded-lg hover:bg-[#2A2A32]"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStepEdit(step);
                          }}
                          className="p-2 bg-[#1A1A20] text-[#5AC8FA] rounded-lg hover:bg-[#2A2A32]"
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStepMove(step.id, 'up');
                          }}
                          disabled={index === 0}
                          className={`p-2 rounded-lg ${
                            index === 0
                              ? 'bg-[#1A1A20] text-[#3A3A42] cursor-not-allowed'
                              : 'bg-[#1A1A20] text-[#5AC8FA] hover:bg-[#2A2A32]'
                          }`}
                        >
                          ↑
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStepMove(step.id, 'down');
                          }}
                          disabled={index === roadMap.steps.length - 1}
                          className={`p-2 rounded-lg ${
                            index === roadMap.steps.length - 1
                              ? 'bg-[#1A1A20] text-[#3A3A42] cursor-not-allowed'
                              : 'bg-[#1A1A20] text-[#5AC8FA] hover:bg-[#2A2A32]'
                          }`}
                        >
                          ↓
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStepRemove(step.id);
                          }}
                          className="p-2 bg-[#1A1A20] text-red-500 rounded-lg hover:bg-[#2A2A32]"
                        >
                          ×
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Sidebar
        selectedStep={selectedStep}
        onClose={() => setSelectedStep(null)}
        onEditResource={() => setEditModalOpen(true)}
        learningResources={learningResources}
        isLoadingResources={isLoadingResources}
      />
      <EditResourceModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        resources={learningResources}
        onSave={handleSaveResources}
      />
      <Footer />
    </div>
  );
}
