import logoDark from "../logo-dark.png";


export default function Header() {
    return (
        <header className="flex items-center justify-between px-12 py-4">
            <img src={logoDark} alt="logo" className="w-30 h-20" />
            <button className="bg-[#5AC8FA] text-[#17171C] px-8 py-4 rounded-full font-semibold hover:bg-[#3BAFDA] transition">로그인</button>
        </header>
    )
}
