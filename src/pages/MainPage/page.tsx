import Header from "../../components/Header";
import MainBanner from "./components/MainBanner";
import Footer from "../../components/Footer";
import DescriptionCard from "./components/DescriptionCard";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-[#17171C] text-white font-sans">
      {/* 상단 네비게이션 */}

            <div className="pl-32 pr-32">
            <Header />
            {/* 중앙 코드 스타일 박스 */}
            <div className="mx-4 md:mx-16 mt-6">
                <MainBanner nickname="익명의 개발자"/>
            </div>

            {/* 하단 카드 */}
            <div className="mx-4 md:mx-16 mt-12">
                <DescriptionCard />
            </div>
        </div>
        <Footer />
    </div>

  );
}
