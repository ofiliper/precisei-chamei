'use client';

import React, { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { Toaster } from '@/components/ui/toaster';
import useWorkspace from '@/hooks/useWorkspace';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardContainer({ children }: { children: React.ReactNode }) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { fetchWorkspace } = useWorkspace();

    useEffect(() => {
        fetchWorkspace();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        // 1. CONTAINER RAIZ
        // Usamos bg-slate-50 para um cinza muito sutil (quase branco), que cansa menos a vista.
        // overflow-hidden garante que a janela do navegador NUNCA role, apenas o conteúdo interno.
        <div className="h-screen w-full bg-slate-50 p-2 md:p-4 font-sans text-slate-800 flex overflow-hidden selection:bg-lime-200 selection:text-lime-900 relative">
            
            <Toaster />

            {/* --- ESTILOS GLOBAIS DE SCROLL --- */}
            {/* Scrollbar fina, elegante e arredondada que só aparece no hover ou sutilmente */}
            <style jsx global>{`
                .custom-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
                .custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                
                /* Firefox */
                .custom-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
            `}</style>

            {/* --- MOBILE OVERLAY --- */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        // backdrop-blur-sm dá aquele efeito de vidro fosco moderno
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* 2. ESTRUTURA FLEX PRINCIPAL */}
            <div className="flex w-full h-full gap-3 md:gap-5 relative max-w-[1920px] mx-auto">

                {/* --- SIDEBAR --- */}
                <div className={`
                    fixed inset-y-0 left-0 z-50 
                    md:relative md:transform-none md:z-auto
                    h-full shrink-0
                    transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                    ${isSidebarOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-[110%] md:translate-x-0'}
                `}>
                    <DashboardSidebar
                        isSidebarOpen={isSidebarOpen}
                        sidebarCallback={setIsSidebarOpen} 
                    />
                </div>

                {/* --- COLUNA PRINCIPAL (Header + Card de Conteúdo) --- */}
                <div className="flex-1 flex flex-col h-full min-w-0 gap-3 md:gap-5">
                    
                    {/* Header */}
                    <div className="shrink-0">
                        <DashboardHeader sidebarCallback={setIsSidebarOpen} />
                    </div>

                    {/* --- O CARTÃO (MAIN) --- */}
                    {/* Aqui está a mágica:
                        - bg-white: cria o contraste com o fundo bg-slate-50.
                        - rounded-[1.5rem]: arredondamento moderno, mas não exagerado.
                        - shadow-sm: sombra leve, estilo "Linear" ou "Vercel".
                        - border-white: uma borda branca sutil para definição.
                    */}
                    <main className="flex-1 bg-white rounded-[1.5rem] shadow-sm border border-white/60 relative overflow-hidden flex flex-col">
                        
                        {/* Área de Conteúdo com Scroll */}
                        <div className="flex-1 overflow-y-auto p-5 md:p-8 scroll-smooth custom-scroll relative">
                            
                            {/* Gradiente sutil no topo para suavizar o corte do scroll (Visual Polish) */}
                            
                            {children}

                            {/* Gradiente sutil no rodapé (Visual Polish) */}
                        </div>
                        
                    </main>
                </div>
            </div>
        </div>
    );
}