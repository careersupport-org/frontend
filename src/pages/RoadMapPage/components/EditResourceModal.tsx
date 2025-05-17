import  { useState } from 'react';
import RoadMapService from '../../../services/RoadmapService';
import { ForbiddenException, UnauthorizedException } from '../../../common/exceptions';
import { useNavigate } from 'react-router-dom';

interface EditResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    stepId: string;
    initialResources: { id: string; url: string }[];
    onSave: (resources: { id: string; url: string }[]) => void;
}

export default function EditResourceModal({ isOpen, onClose, stepId, initialResources, onSave }: EditResourceModalProps) {
    const [resources, setResources] = useState<{ id: string; url: string }[]>(initialResources);
    const [newUrl, setNewUrl] = useState('');
    const navigate = useNavigate();

    const handleAddResource = async () => {
        if (newUrl.trim()) {
            try {
                const resource = await RoadMapService.getInstance().addRecommendResource(stepId, newUrl.trim());
                setResources([...resources, resource]);
                setNewUrl('');
            } catch (error) {
                if (error instanceof UnauthorizedException) {
                    alert("로그인 후 이용 가능한 서비스입니다.");
                    navigate("/login");
                }
                if (error instanceof ForbiddenException) {
                    alert("자신의 로드맵만 추가할 수 있습니다.");
                    navigate("/");
                }
                console.error('Failed to add resource:', error);
            }
        }
    };

    const handleRemoveResource = async (resource_id: string) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) {
            return;
        }
        try {
            await RoadMapService.getInstance().removeRecommendResource(resource_id);
            setResources(resources.filter(resource => resource.id !== resource_id));
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                alert("로그인 후 이용 가능한 서비스입니다.");
                navigate("/login");
            }
            if (error instanceof ForbiddenException) {
                alert("자신의 로드맵만 제거할 수 있습니다.");
                navigate("/");
            }
            console.error('Failed to remove resource:', error);
        }
    };

    const handleSave = async () => {
        onSave(resources);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1D1D22] rounded-2xl p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-[#5AC8FA] mb-4">학습 자료 수정</h2>
                <div className="space-y-4">
                    {resources.map((resource) => (
                        <div key={resource.id} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={resource.url}
                                onChange={(e) => {
                                    setResources(resources.map(r =>
                                        r.id === resource.id ? { ...r, url: e.target.value } : r
                                    ));
                                }}
                                className="flex-1 bg-[#23232A] text-[#E0E0E6] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5AC8FA]"
                            />
                            <button
                                onClick={() => handleRemoveResource(resource.id)}
                                className="text-red-500 hover:text-red-400"
                            >
                                삭제
                            </button>
                        </div>
                    ))}
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="새로운 학습 자료 URL"
                            className="flex-1 bg-[#23232A] text-[#E0E0E6] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5AC8FA]"
                        />
                        <button
                            onClick={handleAddResource}
                            className="bg-[#5AC8FA] text-[#17171C] px-4 py-2 rounded-lg font-semibold hover:bg-[#3BAFDA] transition"
                        >
                            추가
                        </button>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleSave}
                        className="bg-[#5AC8FA] text-[#17171C] px-4 py-2 rounded-lg font-semibold hover:bg-[#3BAFDA] transition"
                    >
                        완료
                    </button>
                </div>
            </div>
        </div>
    );
} 