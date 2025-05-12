/* eslint-disable */
import React, { useState, useRef } from 'react';
import RoadMapService from '../../../services/RoadmapService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIChattingTabProps {
  roadmapId: string;
}

export default function AIChattingTab({ roadmapId }: AIChattingTabProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: "assistant", content: "안녕하세요! 로드맵 도우미입니다. 무엇을 도와드릴까요?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handlePresetClick = (preset: string) => {
    if (!isLoading && preset.trim()) {
      setMessages(prev => [...prev, { role: 'user', content: preset }]);
      sendAIMessage(preset);
    }
  };

  const sendAIMessage = async (message: string) => {
    setIsLoading(true);
    try {
      const stream = await RoadMapService.getInstance().callAI(roadmapId, message);
      const reader = stream.getReader();
      let aiResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                aiResponse = aiResponse + data.token;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = aiResponse;
                    return [...newMessages];
                  } else {
                    return [...newMessages, { role: 'assistant', content: aiResponse }];
                  }
                });
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error calling AI:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: '죄송합니다. 오류가 발생했습니다.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    sendAIMessage(userMessage);
  };

  return (
    <div className="bg-[#1D1D22] rounded-2xl overflow-hidden">
      <div
        className="bg-[#23232A] p-4 cursor-pointer hover:bg-[#2A2A32] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-bold text-[#5AC8FA] flex items-center justify-between">
          <span>AI 로드맵 도우미</span>
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
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px]' : 'max-h-0'
          }`}
      >
        <div className="p-4 space-y-4">

          {/*채팅 메시지 영역 */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                    ? 'bg-[#5AC8FA] text-[#17171C]'
                    : 'bg-[#23232A] text-[#E0E0E6]'
                    }`}
                >
                  {message.role === 'user' ? (
                    message.content
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#23232A] text-[#E0E0E6] rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#5AC8FA] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#5AC8FA] rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-[#5AC8FA] rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* 프리셋 버튼들 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePresetClick("내 로드맵 피드백해줘")}
              className="bg-[#23232A] text-[#5AC8FA] px-3 py-1 rounded-full text-sm hover:bg-[#2A2A32] transition"
            >
              내 로드맵 피드백해줘
            </button>
            <button
              onClick={() => handlePresetClick("다음 단계 추천해줘")}
              className="bg-[#23232A] text-[#5AC8FA] px-3 py-1 rounded-full text-sm hover:bg-[#2A2A32] transition"
            >
              다음 단계 추천해줘
            </button>
            <button
              onClick={() => handlePresetClick("학습 자료 추천해줘")}
              className="bg-[#23232A] text-[#5AC8FA] px-3 py-1 rounded-full text-sm hover:bg-[#2A2A32] transition"
            >
              학습 자료 추천해줘
            </button>
          </div>
          {/* 입력 폼 */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="AI에게 질문하세요..."
              className="flex-1 bg-[#23232A] text-[#E0E0E6] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5AC8FA]"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#5AC8FA] text-[#17171C] px-4 py-2 rounded-lg font-semibold hover:bg-[#3BAFDA] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              전송
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 