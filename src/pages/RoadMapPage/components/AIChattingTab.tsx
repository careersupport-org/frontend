import React, { useState, useRef, useEffect } from 'react';
import RoadMapService from '../../../services/RoadmapService';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

const AIChattingTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {role : "ai", content : "안녕하세요! 로드맵 도우미입니다. 무엇을 도와드릴까요?"}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setStreamingContent('');

    // SSE 스트리밍
    const stream = RoadMapService.getInstance().callAI(userMsg.content);
    const reader = stream.getReader();
    let aiContent = '';
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (typeof data.content === 'string') {
                aiContent = data.content;
                setStreamingContent(aiContent);
              }
            } catch {}
          }
        }
      }
    } finally {
      setMessages(prev => [...prev, { role: 'ai', content: aiContent }]);
      setStreamingContent('');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#23232A] rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex-shrink-0 p-4 border-b border-[#3A3A42] text-[#5AC8FA] font-bold text-lg">AI 로드맵 도우미</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs break-words text-sm ${
                msg.role === 'user'
                  ? 'bg-[#5AC8FA] text-[#1A1A20] rounded-br-none'
                  : 'bg-[#1A1A20] text-[#E0E0E6] rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg max-w-xs break-words text-sm bg-[#1A1A20] text-[#5AC8FA] rounded-bl-none animate-pulse">
              {streamingContent || 'AI 응답 생성 중...'}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-[#3A3A42] flex gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded bg-[#1A1A20] text-[#E0E0E6] border border-[#3A3A42] focus:outline-none"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="px-4 py-2 rounded bg-[#5AC8FA] text-[#1A1A20] hover:bg-[#4AB8EA] font-bold disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default AIChattingTab; 