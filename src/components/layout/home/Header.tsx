"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-[1100px] w-full mx-auto px-4 py-4 flex justify-between items-center">
                
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <a href="/">
                        <img 
                            src="precisei-chamei.svg" 
                            className="w-[70px] md:w-[100px]" 
                            alt="Logo Precisei Chamei" 
                        />
                    </a>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <a href="/auth/cadastrar" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition">
                        Divulgue seu negócio
                    </a>
                    <a href="/auth/login" className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] hover:bg-emerald-600 text-white px-6 py-2 rounded-md font-semibold transition shadow-md shadow-emerald-200">
                        Entrar
                    </a>
                </div>

                {/* Mobile Menu Toggle com Animação */}
                <button 
                    className="md:hidden text-slate-600 focus:outline-none relative w-10 h-10 flex items-center justify-center z-50"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {/* Ícone Menu (Hamburguer): Gira e desaparece quando aberto */}
                    <span 
                        className={`absolute transition-all duration-300 transform ${
                            isMenuOpen ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'
                        }`}
                    >
                        <Menu size={24} />
                    </span>

                    {/* Ícone X (Fechar): Gira oposto e aparece quando aberto */}
                    <span 
                        className={`absolute transition-all duration-300 transform ${
                            isMenuOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'
                        }`}
                    >
                        <X size={24} />
                    </span>
                </button>
            </div>

            {/* Mobile Dropdown com transição de altura */}
            <div 
                className={`md:hidden bg-white border-t border-slate-100 absolute w-full left-0 top-full shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="p-4 flex flex-col gap-4">
                    <a 
                        href="/auth/cadastrar" 
                        className="text-base font-medium text-slate-600 hover:text-emerald-600 transition py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Divulgue seu negócio
                    </a>
                    <a 
                        href="/auth/login" 
                        className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] text-white text-center py-3 rounded-md font-semibold transition shadow-sm"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Entrar
                    </a>
                </div>
            </div>
        </header>
    );
}