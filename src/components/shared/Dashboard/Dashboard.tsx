'use client';

import React, { useState } from 'react';

import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { Toaster } from '@/components/ui/toaster';


export default function DashboardContainer({ children }: { children: React.ReactNode }) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#fff] p-4 md:p-6 font-sans text-gray-800 overflow-y-hidden">
            <Toaster />
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)} />
            )}
            <div className="flex flex-col md:flex-row gap-6 relative overflow-y-hidden">
                <DashboardSidebar
                    isSidebarOpen={isSidebarOpen}
                    sidebarCallback={setIsSidebarOpen} />
                {/* --- COLUNA DA DIREITA (Header + Main) --- */}
                <div className="flex-1 flex flex-col gap-6">
                    <DashboardHeader
                        sidebarCallback={setIsSidebarOpen} />
                    {/* --- BLOCO 3: MAIN CONTENT --- */}
                    <main
                        className="max-h-[80%] bg-[#f5f6f3] border border-white/50 rounded-[2.5rem] p-6 md:p-10 shadow-sm flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}