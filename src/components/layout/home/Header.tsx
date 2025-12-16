import { Menu } from "lucide-react";

export default function Header() {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="w-[1100px] mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo Placeholder */}
                <div className="flex items-center gap-2">
                    <img src="precisei-chamei.png" className="w-[200px]"/>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <a href="/auth/cadastrar" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition">
                        Divulgue seu negócio
                    </a>
                    <a href="/auth/login" className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] hover:bg-emerald-600 text-white px-6 py-2 rounded-md font-semibold transition shadow-md shadow-emerald-200">
                        Entrar
                    </a>
                </div>

                {/* Mobile Menu Icon */}
                <button className="md:hidden text-slate-600">
                    <Menu size={24} />
                </button>
            </div>
        </header>
    )
}