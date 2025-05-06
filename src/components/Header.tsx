import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logoDark from "../logo-dark.png";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <header className="flex items-center justify-between px-12 py-4 mx-32">
            <img src={logoDark} alt="logo" className="w-30 h-20" />
            {isAuthenticated ? (
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-[#5AC8FA]">{user?.nickname}님</span>
                    <button
                        onClick={logout}
                        className="bg-[#23232A] text-[#5AC8FA] px-6 py-2 rounded-full font-semibold hover:bg-[#3BAFDA] border border-[#5AC8FA] transition"
                    >
                        로그아웃
                    </button>
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
