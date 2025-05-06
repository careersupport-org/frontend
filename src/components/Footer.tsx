import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#1D1D22] text-[#A0A0B0] py-6 mt-16 border-t border-[#23232A] text-center text-sm select-none">
      <div className="container mx-auto px-4">
        <span className="font-semibold">CAREERSUPPORT</span> &copy; {new Date().getFullYear()}<br />
        모든 권리 보유. | AI 기반 개발자 취업 지원 플랫폼
      </div>
    </footer>
  );
};

export default Footer;
