'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutGrid, ArrowRight, Loader2,
    Building2, ShieldCheck, User,
    Plus, Sparkles, Clock, Globe
} from 'lucide-react';
import { Cookies } from 'react-cookie';
import useWorkspace from '@/hooks/useWorkspace';
import { useStore } from 'zustand';
import { workspaceListStore } from '@/store/workspace/workspace-list-store';

export default function DashboardSelectWorkspace() {
    const cookies = new Cookies();
    const workspaceHook = useWorkspace();
    const workspaceList = useStore(workspaceListStore);

    useEffect(() => {
        workspaceHook.fetchAllWorkspaces();
    }, []);

    const handleSelect = (id: string) => {
        cookies.set('workspace', id, { path: '/', maxAge: 60 * 60 * 24 * 7 });
        window.location.reload();
    };

    if (workspaceList.data.fetching) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FDFDFF]">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 border-[3px] border-lime-500/10 border-t-lime-500 rounded-full"
                    />
                    <Building2 className="absolute inset-0 m-auto w-8 h-8 text-lime-600 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-[#FDFDFF] overflow-hidden relative flex flex-col font-sans selection:bg-lime-200">

            {/* --- DECORAÇÕES DE FUNDO (BLUEPRINT GRID) --- */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

            {/* Brilhos suaves nos cantos */}
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-lime-200/30 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-blue-200/20 blur-[100px] rounded-full pointer-events-none" />

            {/* --- HEADER FIXO --- */}
            <header className="relative z-10 pt-12 pb-6 px-8 flex flex-col items-center text-center shrink-0">
                <motion.div
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm mb-4"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">System Online</span>
                </motion.div>

                <h1 className="text-5xl font-[900] text-slate-900 tracking-tight leading-none mb-4">
                    Selecione seu <span className="text-lime-500 italic">Workspace</span>
                </h1>
                {/* <p className="text-slate-500 font-medium">Conectado como <span className="text-slate-900 font-bold">Desenvolvedor</span></p> */}
            </header>

            {/* --- ÁREA DE SCROLL CUSTOMIZADA --- */}
            <main className="relative z-10 flex-1 overflow-y-auto px-8 pb-12 
                             scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent 
                             hover:scrollbar-thumb-lime-200 transition-colors">

                <div className="max-w-7xl mx-auto py-8">
                    <motion.div
                        initial="hidden" animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {workspaceList.data.rows?.map((ws) => (
                            <motion.div
                                key={ws.id}
                                variants={{
                                    hidden: { y: 20, opacity: 0 },
                                    visible: { y: 0, opacity: 1 }
                                }}
                                whileHover={{ y: -6 }}
                                className="group"
                            >
                                <button
                                    onClick={() => handleSelect(ws.id)}
                                    className="w-full text-left bg-white/80 backdrop-blur-md border border-slate-200 rounded-[2.5rem] p-6 
                                               transition-all duration-500 hover:border-lime-400 hover:shadow-[0_32px_64px_-16px_rgba(132,204,22,0.12)]
                                               relative overflow-hidden flex flex-col h-full min-h-[240px]"
                                >
                                    {/* Linha de brilho superior no hover */}
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex justify-between items-start mb-auto">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ws.name)}&background=f8fafc&color=334155&bold=true&font-size=0.35`}
                                                    alt={ws.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {/* @ts-ignore */}
                                            {ws.role === 'admin' && (
                                                <div className="absolute -top-2 -right-2 bg-lime-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
                                                    <ShieldCheck size={12} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-lime-500 group-hover:text-white text-slate-300 transition-all duration-500">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h3 className="text-xl font-black text-slate-800 group-hover:text-lime-700 transition-colors leading-tight mb-1">
                                            {ws.name}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            {/* /@ts-ignore */}
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {/*@ts-ignore */}
                                                {ws.role || 'Membro'}</span>
                                            <div className="h-1 w-1 rounded-full bg-slate-200" />
                                            <span className="text-[10px] font-black text-lime-600 uppercase tracking-widest flex items-center gap-1">
                                                <div className="w-1 h-1 rounded-full bg-lime-500 animate-pulse" /> Online
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[9px] font-mono text-slate-400 tracking-tighter">ID: {ws.id.slice(0, 12).toUpperCase()}</span>
                                        <div className="flex -space-x-1.5">
                                            {[1, 2].map(i => (
                                                <div key={i} className="w-5 h-5 rounded-full bg-slate-100 border border-white" />
                                            ))}
                                        </div>
                                    </div>
                                </button>
                            </motion.div>
                        ))}

                        {/* Card Adicionar */}
                        <motion.button
                            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                            className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-6 flex flex-col items-center justify-center min-h-[240px] group hover:border-lime-500 hover:bg-lime-50/10 transition-all"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-lime-500 group-hover:text-white transition-all duration-500">
                                <Plus size={24} />
                            </div>
                            <span className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-lime-600 transition-colors">Novo Ambiente</span>
                        </motion.button>
                    </motion.div>
                </div>
            </main>

            {/* --- FOOTER FIXO --- */}
            <footer className="relative z-10 px-8 py-6 border-t border-slate-100 bg-white/50 backdrop-blur-md flex items-center justify-between shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Globe size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Global Cluster: BR-SA1</span>
                    </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Build <span className="text-slate-900 font-black italic">v2.0.8-stable</span>
                </p>
            </footer>

            {/* --- CSS ADICIONAL PARA O SCROLL --- */}
            <style jsx global>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 20px;
                }
                .scrollbar-thin:hover::-webkit-scrollbar-thumb {
                    background: #d9f99d;
                }
            `}</style>
        </div>
    );
}