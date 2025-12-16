import { ChevronDown, Edit3, LogOut, Menu, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DashboardHeaderSearchbar from "./DashboardHeaderSearchbar";
import { useRouter } from "next/navigation";
import { Cookies } from "react-cookie";
import { toast } from "@/hooks/use-toast";

export default function DashboardHeader({
    sidebarCallback: setIsSidebarOpen
}: { sidebarCallback: (arg: boolean) => void }) {
    const cookies = new Cookies();
    const router = useRouter();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-[#f5f6f3] border border-white/50 rounded-[2rem] p-4 md:px-8 md:py-2 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 max-h-[calc(100%-10vh)] ">

            {/* Search Area */}
            <div className="flex items-center w-full md:w-auto gap-3">
                <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-white rounded-lg text-gray-600 shadow-sm">
                    <Menu size={24} />
                </button>
                <DashboardHeaderSearchbar />
            </div>

            {/* User Profile com Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-4 hover:bg-white p-2 rounded-xl transition-colors cursor-pointer text-left"
                >
                    <div className="hidden sm:block text-right">
                        <p className="font-bold text-gray-800 text-sm">Selina Gomes</p>
                        <p className="text-gray-400 text-xs">seuemail@gmail.com</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-orange-200 overflow-hidden border-2 border-white shadow-sm">
                        <img src="https://i.pravatar.cc/150?u=selina" alt="Avatar" className="object-cover w-full h-full" />
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* DROPDOWN MENU */}
                {isUserDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-3 border-b border-gray-50 mb-1 md:hidden">
                            <p className="font-bold text-gray-800 text-sm">Selina Gomes</p>
                            <p className="text-gray-400 text-xs truncate">seuemail@gmail.com</p>
                        </div>
                        <a href="/dashboard/meus-dados" className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-600 text-sm">
                            <Edit3 size={16} />
                            Editar usuário
                        </a>
                        <button
                            onClick={() => {
                                try {
                                    cookies.remove('userid', { path: '/' });
                                    router.push('/auth/login');
                                    toast({
                                        title: 'Logout realizado com sucesso',
                                        description: 'Você foi deslogado da sua conta.',
                                        variant: 'default',
                                    });
                                } catch (error) {
                                    toast({
                                        title: 'Erro ao fazer logout',
                                        description: 'Não foi possível sair da sua conta. Tente novamente.',
                                        variant: 'destructive',
                                    });
                                }
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-red-500 text-sm">
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}