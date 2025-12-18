"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { HelpCircle, Star, User, Wrench, X, MessageCircle, Image, Headset } from "lucide-react";
import { motion } from "framer-motion";

// Definição dos itens do menu
const MENU_ITEMS = [
    {
        group: "Menu",
        items: [
            { label: "Meus serviços", href: "/dashboard", icon: Wrench },
            { label: "Galeria", href: "/dashboard/galeria", icon: Image },
            // { label: "Assinaturas", href: "/dashboard/assinaturas", icon: Star },
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
                bg-[#f5f6f3] rounded-r-[2.5rem] md:rounded-[2.5rem] border border-white/50 shadow-sm
                flex flex-col p-6 md:p-8 transition-transform duration-300 ease-in-out z-[999] md:z-[1]
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0 h-full overflow-hidden
            `}
        >
            {/* CSS Injetado para Scrollbar Visível porém Elegante */}
            <style jsx global>{`
                .sidebar-scroll::-webkit-scrollbar { width: 5px; }
                .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
                /* Cor padrão bem suave para indicar scroll */
                .sidebar-scroll::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.06); border-radius: 99px; }
                /* Cor no hover um pouco mais forte */
                .sidebar-scroll:hover::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.2); }
            `}</style>

            {/* 1. HEADER (Fixo e encolhe se necessário) */}
            <div className="flex items-center justify-between mb-6 shrink-0 z-20">
                <Link href="/dashboard" className="flex items-center justify-center w-full">
                    <img src="/precisei-chamei.svg" alt="Logo" className="w-[110px] md:w-[110px] mx-auto transition-all" />
                </Link>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden text-gray-500 hover:bg-gray-200 p-2 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* 2. ÁREA DE SCROLL COM INDICADORES VISUAIS */}
            {/* relative para posicionar os gradientes de fade */}
            <div className="flex-1 relative flex flex-col min-h-0">

                {/* Fade Superior (Indica que há itens acima ao rolar) */}
                <div className="absolute top-0 left-0 right-2 h-6 bg-gradient-to-b from-[#f5f6f3] to-transparent z-10 pointer-events-none" />

                {/* Lista Rolável */}
                <div className="flex-1 overflow-y-auto pr-2 sidebar-scroll py-2">
                    <div className="space-y-6">
                        {MENU_ITEMS.map((section, index) => (
                            <div key={index}>
                                <h4 className="text-[10px] font-extrabold text-gray-400/80 tracking-widest mb-3 px-4 uppercase font-sans">
                                    {section.group}
                                </h4>

                                <nav className="space-y-1">
                                    {section.items.map((item) => {
                                        const isActive = pathname === item.href;
                                        const Icon = item.icon;

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group outline-none focus:bg-white/50"
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeMenuBackground"
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                        className="absolute inset-0 bg-gradient-to-r from-lime-50 to-transparent rounded-xl border-l-4 border-lime-500"
                                                    />
                                                )}

                                                <div className="relative z-10">
                                                    <Icon
                                                        size={20}
                                                        strokeWidth={isActive ? 2.5 : 2}
                                                        className={`transition-colors duration-300 ${isActive
                                                            ? "text-lime-700"
                                                            : "text-gray-400 group-hover:text-gray-600"
                                                            }`}
                                                    />
                                                </div>

                                                <span className={`relative z-10 text-sm font-medium transition-all duration-300 ${isActive
                                                    ? "text-gray-800 font-bold translate-x-1"
                                                    : "text-gray-500 group-hover:text-gray-700 group-hover:translate-x-1"
                                                    }`}>
                                                    {item.label}
                                                </span>

                                                {isActive && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="absolute right-4 w-1.5 h-1.5 rounded-full bg-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.5)]"
                                                    />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fade Inferior (A "Dica" Visual de que há mais conteúdo) */}
                <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-[#f5f6f3] via-[#f5f6f3]/80 to-transparent z-10 pointer-events-none" />
            </div>

            {/* 3. RODAPÉ (Fixo) */}
            <div className="mt-4 shrink-0 space-y-4 relative z-20">

                {/* Card Suporte */}
                <div className="relative group overflow-hidden bg-[#1f2d0e] rounded-3xl p-5 flex flex-col justify-between shadow-xl transition-transform hover:translate-y-[-2px]">
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#65a30d] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-emerald-500 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-white font-light text-sm">Precisa de ajuda?</p>
                            <motion.div
                                animate={{ rotate: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                                className="text-[#65a30d]"
                            >
                                <Headset size={24} strokeWidth={1.5} />
                            </motion.div>
                        </div>

                        <p className="text-xl text-white font-bold mb-4 leading-tight">Suporte <span className="text-[#65a30d]">técnico</span></p>

                        <motion.a
                            href="https://wa.me/+5524988317770?text=Olá, estou no sistema e tenho uma dúvida"
                            target="_blank"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-[#65a30d] to-[#4d7c0f] hover:from-[#578d0b] hover:to-[#3f660c] text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-[#65a30d]/20 flex items-center justify-center gap-2 uppercase tracking-wide"
                        >
                            Entrar em contato
                        </motion.a>
                    </div>
                </div>

                {/* Link FAQ */}
                <div className="flex justify-center">
                    <Link
                        href="/dashboard/faq"
                        className={`flex items-center gap-2 text-xs font-medium transition-colors ${pathname === '/dashboard/faq' ? 'text-slate-800 font-bold' : 'text-gray-400 hover:text-slate-600'}`}
                    >
                        <MessageCircle size={14} />
                        Dúvidas Frequentes
                    </Link>
                </div>
            </div>
        </aside>
    );
}