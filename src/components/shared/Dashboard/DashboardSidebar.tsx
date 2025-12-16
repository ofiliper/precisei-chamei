"use client";

import { usePathname } from "next/navigation";
import Link from "next/link"; // Melhor que 'a' para navegação interna no Next.js
import { BarChart2, HelpCircle, Star, User, Wrench, X, MessageCircle } from "lucide-react";

// Definição dos itens do menu
const MENU_ITEMS = [
    {
        group: "Menu",
        items: [
            { label: "Meus serviços", href: "/dashboard", icon: Wrench },
            { label: "Métricas", href: "/dashboard/metricas", icon: BarChart2 },
            { label: "Assinaturas", href: "/dashboard/assinaturas", icon: Star },
        ],
    },
    {
        group: "Geral",
        items: [
            { label: "Meus dados", href: "/dashboard/meus-dados", icon: User },
            { label: "FAQ", href: "/dashboard/faq", icon: HelpCircle },
        ],
    },
];

export default function DashboardSidebar({
    isSidebarOpen,
    sidebarCallback: setIsSidebarOpen,
}: {
    isSidebarOpen: boolean;
    sidebarCallback: (isOpen: boolean) => void;
}) {
    const pathname = usePathname();

    return (
        <aside
            className={`
        fixed md:relative top-0 left-0 z-50 h-[95vh] w-72 md:w-80 
        bg-[#f5f6f3] rounded-[2.5rem] border border-white/50 shadow-sm
        flex flex-col p-8 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}
        >
            {/* 1. HEADER (Fixo) */}
            <div className="flex items-center justify-between mb-8 shrink-0">
                <Link href="/dashboard" className="flex items-center justify-center w-full">
                    <img src="/precisei-chamei.png" alt="Logo" className="w-[180px] mx-auto" />
                </Link>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden text-gray-500"
                >
                    <X size={24} />
                </button>
            </div>

            {/* 2. ÁREA DE MENU (Com Scroll e Map) */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 99px; }
        `}</style>

                <div className="space-y-8">
                    {MENU_ITEMS.map((section, index) => (
                        <div key={index}>
                            <p className="text-xs font-bold text-gray-400 tracking-wider mb-4 px-4 uppercase">
                                {section.group}
                            </p>
                            <nav className="space-y-2">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`
                        relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium group overflow-hidden
                        ${isActive
                                                    ? "bg-white shadow-sm text-slate-800 font-bold"
                                                    : "text-gray-400 hover:text-slate-600 hover:bg-white/50"
                                                }
                      `}
                                        >
                                            {/* Indicador lateral (só aparece se ativo) */}
                                            {isActive && (
                                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-lime-500 rounded-r-full"></div>
                                            )}

                                            <Icon
                                                size={20}
                                                className={isActive ? "text-slate-800" : "text-gray-400 group-hover:text-slate-600"}
                                            />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. RODAPÉ (Fixo: Suporte + Dúvidas) */}
            <div className="mt-4 pt-4 shrink-0 space-y-4">
                {/* Card Suporte */}
                <div className="bg-[#1f2d0e] rounded-3xl p-6 text-white text-center relative overflow-hidden shadow-lg">
                    <div className="relative z-10 text-left">
                        <p className="text-xl font-light leading-none">Suporte</p>
                        <p className="text-xl font-bold mb-4 leading-tight">técnico</p>
                        <button className="w-full bg-[#65a30d] hover:bg-[#578d0b] text-[#1f2d0e] font-bold py-2.5 rounded-full text-xs transition uppercase tracking-wide">
                            Entrar em contato
                        </button>
                    </div>
                </div>

                {/* Links Inferiores */}
                <div className="flex flex-col gap-1">
                    <Link
                        href="/dashboard/faq"
                        className={`flex items-center justify-center gap-2 px-4 py-2 text-sm transition font-medium ${pathname === '/dashboard/faq' ? 'text-slate-800 font-bold' : 'text-gray-500 hover:text-slate-800'
                            }`}
                    >
                        <MessageCircle size={18} />
                        Dúvidas
                    </Link>
                </div>
            </div>
        </aside>
    );
}