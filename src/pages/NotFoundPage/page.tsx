import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#17171C] text-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-[#5AC8FA] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-[#E0E0E6] mb-6">페이지를 찾을 수 없습니다</h2>
          <p className="text-[#A0A0B0] mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#5AC8FA] text-[#1A1A20] rounded-lg hover:bg-[#4AB8EA] transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
