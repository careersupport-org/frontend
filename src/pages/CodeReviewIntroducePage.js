/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';

const CodeReviewIntroducePage = () => {
    const [step, setStep] = useState(1);
    const [branchName, setBranchName] = useState('');
    const [githubActionsYaml, setGithubActionsYaml] = useState('');
    const [copyFeedback, setCopyFeedback] = useState('');
    const navigate = useNavigate();

    const step1Ref = useRef(null);
    const step2Ref = useRef(null);
    const step3Ref = useRef(null);

    useEffect(() => {
        const refs = [step1Ref, step2Ref, step3Ref];
        refs[step - 1].current.scrollIntoView({ behavior: 'smooth' });
    }, [step]);

    const handleBranchNameSubmit = (e) => {
        e.preventDefault();
        if (branchName) {
            setStep(3);
            generateGithubActionsYaml();
        }
    };

    const generateGithubActionsYaml = () => {
        const yaml = `
name: AI Code Review

on:
  pull_request:
    branches: [${branchName}]

jobs:
  ai-code-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Review This Pull Request
        run: |
          curl -X POST "https://careersupport.serveblog.net/api/code-review" \\
          -H "Content-Type: application/json" \\
          -H "X-API-TOKEN: \${{ secrets.CAREER_SUPPORT_API_TOKEN }}" \\
          -d '{
            "githubToken": "\${{ secrets.GITHUB_TOKEN }}",
            "repositoryName": "\${{ github.repository }}", 
            "prNumber": "\${{ github.event.pull_request.number || github.event.number }}", 
          }'
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
    `;
        setGithubActionsYaml(yaml.trim());
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopyFeedback('Copied!');
        setTimeout(() => setCopyFeedback(''), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">AI 코드리뷰 설정</h1>

                <div className="space-y-8">
                    {/* Step 1: API Token Notice */}
                    <div ref={step1Ref} className={`bg-gray-800 p-6 rounded-lg ${step > 1 ? 'opacity-50' : ''}`}>
                        <h2 className="text-xl font-semibold text-white mb-4">Step 1: API 토큰 확인</h2>
                        <p className="text-gray-300 mb-4">
                            AI 코드리뷰를 사용하기 위해서는 API 토큰이 필요합니다. 아직 API 토큰이 없다면
                            <Link to="/mypage" className="text-blue-400 hover:text-blue-300 ml-1">여기</Link>
                            에서 발급받아주세요.
                        </p>
                        <button
                            onClick={() => setStep(2)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={step !== 1}
                        >
                            다음 단계
                        </button>
                    </div>

                    {/* Step 2: Branch Name */}
                    <div ref={step2Ref} className={`bg-gray-800 p-6 rounded-lg ${step !== 2 ? 'opacity-50' : ''}`}>
                        <h2 className="text-xl font-semibold text-white mb-4">Step 2: 브랜치 설정</h2>
                        <form onSubmit={handleBranchNameSubmit}>
                            <label className="block text-gray-300 mb-2" htmlFor="branchName">
                                코드리뷰를 제공할 브랜치 이름:
                            </label>
                            <input
                                type="text"
                                id="branchName"
                                value={branchName}
                                onChange={(e) => setBranchName(e.target.value)}
                                className="w-full p-2 bg-gray-700 text-white rounded"
                                placeholder="예: main, master, develop"
                                required
                                disabled={step !== 2}
                            />
                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center"
                                    disabled={step !== 2}
                                >
                                    이전 단계
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={step !== 2}
                                >
                                    다음 단계
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Step 3: Github Actions Setup */}
                    <div ref={step3Ref} className={`bg-gray-800 p-6 rounded-lg ${step !== 3 ? 'opacity-50' : ''}`}>
                        <h2 className="text-xl font-semibold text-white mb-4">Step 3: Github Actions 설정</h2>
                        <p className="text-gray-300 mb-4">
                            아래의 YAML 파일을 복사하여 GitHub 저장소의 <code>.github/workflows</code> 디렉토리에
                            <code>ai-code-review.yml</code> 파일로 저장하세요.
                        </p>
                        {githubActionsYaml && (
                            <div className="relative mb-4">
                                <pre className="bg-gray-700 p-4 rounded overflow-x-auto text-white">
                                    {githubActionsYaml}
                                </pre>
                                <div className="absolute top-2 right-2 flex items-center">
                                    <button
                                        onClick={() => copyToClipboard(githubActionsYaml)}
                                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                                    >
                                        <Copy size={20} />
                                    </button>
                                    {copyFeedback && (
                                        <span className="text-green-400">{copyFeedback}</span>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="mt-6 text-gray-300">
                            <h3 className="font-semibold mb-2">추가 설정:</h3>
                            <ol className="list-decimal list-inside space-y-2">
                                <li>GitHub 저장소의 Settings {">"} Secrets and variables {">"} Actions에서 새로운 secret을 추가하세요.</li>
                                <li><code>CAREER_SUPPORT_API_TOKEN</code>이라는 이름으로 API 토큰을 저장하세요.</li>
                                <li><code>GITHUB_TOKEN</code>은 자동으로 제공되므로 별도로 추가할 필요가 없습니다.</li>
                                <li>GITHUB_TOKEN은 GITHUB API를 호출하는데 사용되며, 본 서비스에서 별도로 저장하지 않습니다.</li>
                            </ol>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setStep(2)}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center"
                            >
                                이전 단계
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                        설정 완료
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodeReviewIntroducePage;