/* eslint-disable */
import React, { useState, useEffect } from 'react';

interface MainBannerProps {
  nickname: string;
}

const MainBanner: React.FC<MainBannerProps> = ({ nickname }) => {
    const asciiArt = `
 _____                                 _____                                    _   
/  __ \\                               /  ___|                                  | |  
| /  \\/  __ _  _ __   ___   ___  _ __ \\ \`--.  _   _  _ __   _ __    ___   _ __ | |_ 
| |     / _\` || '__| / _ \\ / _ \\| '__| \`--. \\| | | || '_ \\ | '_ \\  / _ \\ | '__|| __|
| \\__/\\| (_| || |   |  __/|  __/| |   /\\__/ /| |_| || |_) || |_) || (_) || |   | |_ 
 \\____/ \\__,_||_|    \\___| \\___||_|   \\____/  \\__,_|| .__/ | .__/  \\___/ |_|    \\__|
                                                    | |    | |                      
                                                    |_|    |_|                      
`

    const fullText = [
        { content: 'render(', color: 'text-[#ce9178]' },
        { content: '\n  ', color: 'text-[#4ec9b0]' },
        { content: '\n  <Welcome', color: 'text-[#4ec9b0]' },
        { content: '>', color: 'text-[#4ec9b0]' },
        { content: '\n    <', color: 'text-[#9cdcfe]' },
        { content: 'Text', color: 'text-[#9cdcfe]' },
        { content: '>', color: 'text-[#9cdcfe]' },
        { content: '환영합니다, ', color: 'text-[#d4d4d4]' },
        { content: nickname, color: 'text-[#d4d4d4]' },
        { content: '님', color: 'text-[#d4d4d4]' },
        { content: '!', color: 'text-[#d4d4d4]' },
        { content: '</', color: 'text-[#9cdcfe]' },
        { content: 'Text', color: 'text-[#9cdcfe]' },
        { content: '>', color: 'text-[#9cdcfe]' },
        { content: '\n  </', color: 'text-[#4ec9b0]' },
        { content: 'Welcome', color: 'text-[#4ec9b0]' },
        { content: '>', color: 'text-[#4ec9b0]' },

        { content: '\n  <Introduce', color: 'text-[#4ec9b0]' },
        { content: '>', color: 'text-[#4ec9b0]' },
        { content: '\n    <', color: 'text-[#9cdcfe]' },
        { content: 'Text', color: 'text-[#9cdcfe]' },
        { content: '>', color: 'text-[#9cdcfe]' },
        { content: 'AI 기반의 ', color: 'text-[#d4d4d4]' },
        { content: '개발자 ', color: 'text-[#d4d4d4]' },
        { content: '취업 ', color: 'text-[#d4d4d4]' },
        { content: '역량 강화 ', color: 'text-[#d4d4d4]' },
        { content: '플랫폼 ', color: 'text-[#d4d4d4]' },
        { content: '</', color: 'text-[#9cdcfe]' },
        { content: 'Text', color: 'text-[#9cdcfe]' },
        { content: '>', color: 'text-[#9cdcfe]' },
        { content: '\n  </', color: 'text-[#4ec9b0]' },
        { content: 'Introduce', color: 'text-[#4ec9b0]' },
        { content: '>', color: 'text-[#4ec9b0]' },
        { content: '\n)', color: 'text-[#ce9178]' }
    ];

    const [text, setText] = useState<{content: string, color: string}[]>([]);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < fullText.length) {
                setText(prev => [...prev, fullText[i]]);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);

        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);

        return () => {
            clearInterval(typingInterval);
            clearInterval(cursorInterval);
        };
    }, []);

    return (
        <div className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-800 h-7 flex items-center px-4">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
            </div>

            {/* Main content */}
            <div className="p-8 font-mono text-lg">
                <pre className="text-[#569cd6] text-sm leading-none mb-6">{asciiArt}</pre>
                <div className="whitespace-pre-wrap">
                    {text.map((item, index) => (
                        <span key={index} className={item?.color || 'text-[#d4d4d4]'}>
                            {item?.content || ''}
                        </span>
                    ))}
                    <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>▋</span>
                </div>
            </div>
        </div>
    );
};

export default MainBanner;
