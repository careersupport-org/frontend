/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { PlusCircle, List, Code } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MainBanner from '../components/MainBanner';
import UserApiService from '../services/UserAPIService';

const MainPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ nickname: "익명의 개발자" });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setIsLoading(false);
        return;
      }
      UserApiService.setToken(token);
      try {
        const userData = await UserApiService.getUserInfo();
        setIsLoggedIn(true);
        setUserInfo(userData);
      } catch (error) {
        setIsLoggedIn(false);
        localStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggedIn(false);
      setUserInfo({ nickname: "익명의 개발자" });
      localStorage.removeItem('accessToken');
    } catch (error) {
    } finally {
      navigate('/');
    }
  };

  const handleRedirectNeedsLogin = (link) => {
    if (isLoggedIn) {
      navigate(link);
    } else {
      navigate('/login');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 p-4 sm:p-8"></div>
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-16 space-y-4 sm:space-y-0">
          <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto">
            <img
              src="images/logo-dark.png"
              alt="CareerSupport Logo"
              className="h-16 sm:h-20 w-auto"
            />
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 text-lg rounded-full transition duration-300 ease-in-out"
              >
                로그아웃
              </button>
            ) : (
              <Link to="/login">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-lg rounded-full transition duration-300 ease-in-out">
                  로그인
                </button>
              </Link>
            )}
          </div>
        </header>

        <main>
          <section className="mb-12 sm:mb-16">
            <MainBanner nickname={userInfo.nickname} />
          </section>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="bg-gray-800 border border-blue-700 rounded-lg shadow-md p-8 flex flex-col items-center justify-center transition duration-300 ease-in-out hover:shadow-lg">
              <PlusCircle className="w-20 h-20 text-blue-400 mb-6" />
              <h3 className="text-2xl font-semibold text-blue-300 mb-4">새 AI 면접 템플릿 생성</h3>
              <p className="text-lg text-gray-400 text-center mb-6">맞춤형 면접 템플릿을 만들어 연습을 시작하세요.</p>
              <button
                onClick={() => handleRedirectNeedsLogin("/interview/template")}
                className="bg-blue-500 text-white px-8 py-3 text-lg rounded-full hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                템플릿 생성하기
              </button>
            </div>

            <div className="bg-gray-800 border border-blue-700 rounded-lg shadow-md p-8 flex flex-col items-center justify-center transition duration-300 ease-in-out hover:shadow-lg">
              <List className="w-20 h-20 text-blue-400 mb-6" />
              <h3 className="text-2xl font-semibold text-blue-300 mb-4">이전 면접 템플릿 보기</h3>
              <p className="text-lg text-gray-400 text-center mb-6">이전에 생성한 템플릿을 확인하고 복습하세요.</p>
              <button
                onClick={() => handleRedirectNeedsLogin("/interview/list")}
                className="bg-blue-500 text-white px-8 py-3 text-lg rounded-full hover:bg-blue-600 transition duration-300 ease-in-out">
                템플릿 목록 보기
              </button>
            </div>

            <div className="bg-gray-800 border border-blue-700 rounded-lg shadow-md p-8 flex flex-col items-center justify-center transition duration-300 ease-in-out hover:shadow-lg">
              <Code className="w-20 h-20 text-blue-400 mb-6" />
              <h3 className="text-2xl font-semibold text-blue-300 mb-4">AI 코드리뷰 시작하기</h3>
              <p className="text-lg text-gray-400 text-center mb-6">AI를 통해 Github에 업로드한 코드를 리뷰 받아보세요.</p>
              <button
                onClick={() => handleRedirectNeedsLogin("/code-review/introduce")}
                className="bg-blue-500 text-white px-8 py-3 text-lg rounded-full hover:bg-blue-600 transition duration-300 ease-in-out">
                코드리뷰 시작
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainPage;