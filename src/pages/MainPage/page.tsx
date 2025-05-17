import Header from "../../components/Header";
import MainBanner from "./components/MainBanner";
import Footer from "../../components/Footer";
import DescriptionCard from "./components/DescriptionCard";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/AuthService";
export default function MainPage() {
  const user = AuthService.getUser();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#17171C] text-white font-sans">
      {/* 상단 네비게이션 */}
            <Header />
            <div className="px-32">
            {/* 중앙 코드 스타일 박스 */}
            <div className="mx-4 md:mx-16 mt-6">
                <MainBanner nickname={user?.nickname || "익명의 개발자"}/>
            </div>

            {/* 하단 카드 */}
            <div className="mx-4 md:mx-16 mt-12">
                <DescriptionCard onClick={() => navigate("/roadmap/input")} />
            </div>
        </div>
        <Footer />
    </div>

  );
}
