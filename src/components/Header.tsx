import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from '../services/AuthService';
import logoDark from "../logo-dark.png";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const user = AuthService.getUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 바깥 클릭 시 드롭다운 닫기
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <header className="flex items-center justify-between px-12 py-4 mx-32 relative">
            <img src={logoDark} alt="logo" className="w-30 h-20 cursor-pointer" onClick={() => navigate("/")} />
            {AuthService.isAuthenticated() ? (
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="flex items-center gap-2 font-semibold text-[#E0E0E6] px-4 py-2 rounded-lg border border-[#23232A] bg-transparent hover:bg-[#23232A] transition"
                        onClick={() => setDropdownOpen((open) => !open)}
                    >
                        <img src={user?.profileImage} alt="profile" className="w-7 h-7 rounded-full bg-[#23232A] object-cover" />
                        {user?.nickname}님
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-[#23232A] rounded-lg shadow-lg border border-[#23232A] z-50">
                            <button
                                className="block w-full text-left px-4 py-3 text-[#E0E0E6] hover:bg-[#282C34] rounded-t-lg"
                                onClick={() => { setDropdownOpen(false); navigate("/mypage"); }}
                            >
                                내 프로필
                            </button>
                            <button
                                className="block w-full text-left px-4 py-3 text-[#E57373] hover:bg-[#282C34] rounded-b-lg"
                                onClick={() => { setDropdownOpen(false); AuthService.logout(); }}
                            >
                                로그아웃
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => navigate("/login")}
                    className="bg-[#5AC8FA] text-[#17171C] px-8 py-4 rounded-full font-semibold hover:bg-[#3BAFDA] transition"
                >
                    로그인
                </button>
            )}
        </header>
    );
};

export default Header;
