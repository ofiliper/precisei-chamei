'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, MapPin, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from 'zustand';
import { categoryStore } from '@/store/category/category-store';

// Lista de Categorias Demo
const categorias = [
    "Saúde e Beleza",
    "Mecânica",
    "Reformas",
    "Assistência Técnica",
    "Aulas",
    "Consultoria",
    "Eventos",
    "Moda",
    "Transporte",
    "Veterinário"
];

export default function SearchBarCaprichado() {
    // Estados
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>({});
    const [categorySearch, setCategorySearch] = useState(""); // Busca interna do dropdown
    const categoryList = useStore(categoryStore);

    // Ref para fechar ao clicar fora
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fecha o dropdown se clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Lógica de Filtro
    const filteredCategories = categoryList.data.rows!.length > 0
        ? categoryList.data.rows!.filter((cat) => ({
            name: cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
            id: cat.id
        })
        )
        : []

    return (


        <div className="flex items-center relative md:w-[200px] border-b md:border-b-0 md:border-r border-slate-100" ref={wrapperRef}>

            {/* O Botão Visível (Trigger) */}
            <div
                className="flex items-center justify-between h-8 cursor-pointer hover:bg-slate-50 transition-colors rounded-l-xl group w-full"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
                <span className={`text-sm font-medium truncate flex-1 ${selectedCategory.name ? 'text-slate-800' : 'text-slate-500'}`}>
                    {selectedCategory.name || "Selecionar Categoria"}
                </span>

                <div className={`p-1.5 rounded-md mr-3 transition-colors ${selectedCategory.name ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* === O DROPDOWN (O SEU CÓDIGO ENTRA AQUI) === */}
            <AnimatePresence>
                {isCategoryOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-[110%] left-0 w-full bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                    >

                        {/* --- SEU CÓDIGO DE BUSCA INTERNA --- */}
                        <div className="p-2 border-b border-gray-100">
                            <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                <SearchIcon size={16} className="text-gray-400 mr-2" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Buscar categoria..."
                                    className="bg-transparent w-full text-sm outline-none text-slate-700 placeholder:text-slate-400"
                                    value={categorySearch}
                                    onChange={(e) => setCategorySearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* --- SEU CÓDIGO DE LISTA --- */}
                        <ul className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((cat, idx) => (
                                    <motion.li
                                        key={idx}
                                        whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                                        onClick={() => {
                                            setSelectedCategory({id: cat.id, name: cat.name});
                                            setIsCategoryOpen(false);
                                            setCategorySearch('');
                                        }}
                                        className={`
                                    flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors mb-1
                                    ${selectedCategory.id === cat.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600'}
                                `}
                                    >
                                        {cat.name}
                                        {selectedCategory.id === cat.id && <Check size={16} className="text-emerald-600" />}
                                    </motion.li>
                                ))
                            ) : (
                                <li className="px-3 py-8 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
                                    <span className="text-xs">Nenhuma categoria encontrada</span>
                                </li>
                            )}
                        </ul>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>


    );
}