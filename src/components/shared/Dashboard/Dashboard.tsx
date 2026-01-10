'use client';

import React, { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import DashboardSelectWorkspace from './DashboardSelectWorkspace';
import { Toaster } from '@/components/ui/toaster';
import useWorkspace from '@/hooks/useWorkspace';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookies } from 'react-cookie';
import { Loader2 } from 'lucide-react';

export default function DashboardContainer({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [hasWorkspace, setHasWorkspace] = useState<boolean | null>(null);
    const { fetchWorkspace } = useWorkspace();
    const cookies = new Cookies();

    useEffect(() => {
        const wsCookie = cookies.get('workspace');
        
        if (wsCookie) {
            fetchWorkspace();
            setHasWorkspace(true);
        } else {
            setHasWorkspace(false);
        }
    }, []);

    const handleSwitchWorkspace = () => {
        cookies.remove('workspace', { path: '/' });
        setHasWorkspace(false);
    };

    // --- EARLY RETURNS (Proteção contra renderização do children) ---

    // 1. Estado de carregamento inicial (Lendo Cookie)
    if (hasWorkspace === null) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-lime-600" />
                <p className="text-slate-400 text-sm animate-pulse font-medium">Sincronizando ambiente...</p>
            </div>
        );
    }

    // 2. Se NÃO tem workspace, renderiza APENAS o Seletor (Isolando o children)
    if (!hasWorkspace) {
        return (
            <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4">
                <DashboardSelectWorkspace />
            </div>
        );
    }

    // 3. Caso tenha workspace, renderiza o Layout Completo com o children
    return (
        <div className="h-screen w-full bg-slate-50 p-2 md:p-4 font-sans text-slate-800 flex overflow-hidden selection:bg-lime-200 selection:text-lime-900 relative">
            <Toaster />

            <style jsx global>{`
                .custom-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
                .custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                .custom-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
            `}</style>

            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <div className="flex w-full h-full gap-3 md:gap-5 relative max-w-[1920px] mx-auto">
                
                <div className={`
                    fixed inset-y-0 left-0 z-50 md:relative md:transform-none md:z-auto h-full shrink-0
                    transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                    ${isSidebarOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-[110%] md:translate-x-0'}
                `}>
                    <DashboardSidebar
                        isSidebarOpen={isSidebarOpen}
                        sidebarCallback={setIsSidebarOpen}
                        onSwitchWorkspace={handleSwitchWorkspace}
                    />
                </div>

                <div className="flex-1 flex flex-col h-full min-w-0 gap-3 md:gap-5">
                    <div className="shrink-0">
                        <DashboardHeader
                            sidebarCallback={setIsSidebarOpen}
                            onSwitchWorkspace={handleSwitchWorkspace}
                        />
                    </div>

                    <main className="flex-1 bg-white rounded-[1.5rem] shadow-sm border border-white/60 relative overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto p-5 md:p-8 scroll-smooth custom-scroll relative">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}