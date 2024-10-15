/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import InterviewApiService from '../services/InterviewService';
import { useNavigate } from 'react-router-dom';
import UnAuthorizedError from "../errors/UnAuthorizedErrors";
import UserApiService from '../services/UserAPIService';
import { PulseLoader } from "react-spinners";


const InterviewTemplateListPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const templatesPerPage = 10;

  useEffect(() => {
    fetchTemplates();
  }, [currentPage]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await InterviewApiService.getTemplates(currentPage, templatesPerPage);
      setTemplates(data);
    } catch (err) {
      if (err instanceof UnAuthorizedError) {
        alert('로그인이 만료되었습니다. 로그인 페이지로 이동합니다.');
        UserApiService.logout()
        navigate("/login");
      }
      console.error('Failed to fetch templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const handleTemplateClick = (templateId, theme) => {
    navigate('/interview/chat', { state: { templateId, theme } });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">면접 템플릿 목록</h1>
        </div>

        {isLoading && <p className="text-center text-white"><PulseLoader color="#FFFFFF" size={10} /></p>}

        {!isLoading && (
          <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-700">
              {templates.map((template) => (
                <li key={template.id}>
                  <div
                    onClick={() => handleTemplateClick(template.id, template.theme)}
                    className="block hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-400 truncate">
                          {template.theme}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex items-center text-sm text-gray-400">
                          <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                          <p>{formatDate(template.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 페이지네이션 */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="mr-2 h-5 w-5" aria-hidden="true" />
            이전
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={templates.length < templatesPerPage}
            className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
            <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewTemplateListPage;