'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // <--- 1. Importar useRouter
import { ChevronDown, Check, Search as SearchIcon, Layers, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from 'zustand';
import { categoryStore } from '@/store/category/category-store';
import useCategory from '@/hooks/useCategory';
import { subcategoryStore } from '@/store/subcategory/subcategory-store';

export default function SearchBarSelectsOnly() {
    const router = useRouter(); // <--- 2. Instanciar o router
    const categoryList = useStore(categoryStore);
    const subcategoryList = useStore(subcategoryStore);
    const categoryHook = useCategory();

    // --- ESTADOS ---
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [selectedCat, setSelectedCat] = useState<any>({});
    const [searchCat, setSearchCat] = useState("");

    const [isSubOpen, setIsSubOpen] = useState(false);
    const [selectedSub, setSelectedSub] = useState<any>({});
    const [searchSub, setSearchSub] = useState("");

    const catRef = useRef<HTMLDivElement>(null);
    const subRef = useRef<HTMLDivElement>(null);

    // Fecha ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (catRef.current && !catRef.current.contains(event.target as Node)) {
                setIsCatOpen(false);
            }
            if (subRef.current && !subRef.current.contains(event.target as Node)) {
                setIsSubOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- FUNÇÃO DE BUSCA (REDIRECIONAMENTO) ---
    const handleSearch = () => {
        const catId = selectedCat.id || '';
        const subId = selectedSub.id || '';

        // Monta a URL: /buscar?categoria=1&subcategoria=5
        router.push(`/buscar?category=${catId}&subcategory=${subId}`);
    };

    // --- FILTRO CATEGORIAS ---
    const filteredCategories = categoryList.data.rows?.filter((cat) =>
        cat.name.toLowerCase().includes(searchCat.toLowerCase())
    ) || [];

    // --- FILTRO SUBCATEGORIAS ---
    const subCategoriesData = subcategoryList.data?.Subcategories || [];
    const filteredSubCategories = subCategoriesData.filter((sub: any) => {
        const matchesSearch = sub.name.toLowerCase().includes(searchSub.toLowerCase());
        const matchesCategory = sub.id_category === selectedCat.id;
        return matchesSearch && matchesCategory;
    });

    return (
        // Adicionei pr-2 para dar espaço ao botão na direita
        <div className="flex items-center w-full max-w-3xl bg-white rounded-xl border border-slate-200 shadow-sm relative h-14 pr-2">

            {/* SEÇÃO 1: CATEGORIA */}
            <div className="flex-1 relative h-full border-r border-slate-100" ref={catRef}>
                <div
                    className="flex items-center justify-between h-full px-4 cursor-pointer hover:bg-slate-50 transition-colors rounded-l-xl"
                    onClick={() => {
                        setIsCatOpen(!isCatOpen);
                        setIsSubOpen(false);
                    }}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`p-2 rounded-lg ${selectedCat.name ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Layers size={18} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Categoria</span>
                            <span className={`text-sm font-medium truncate ${selectedCat.name ? 'text-slate-800' : 'text-slate-400'}`}>
                                {selectedCat.name || "Selecione..."}
                            </span>
                        </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isCatOpen ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                    {isCatOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-[110%] left-0 w-full min-w-[250px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
                        >
                            <div className="p-2 border-b border-gray-100 bg-slate-50">
                                <div className="flex items-center px-3 py-2 bg-white border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                    <SearchIcon size={14} className="text-gray-400 mr-2" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Buscar categoria..."
                                        className="bg-transparent w-full text-sm outline-none text-slate-700 placeholder:text-slate-400"
                                        value={searchCat}
                                        onChange={(e) => setSearchCat(e.target.value)}
                                    />
                                </div>
                            </div>

                            <ul className="max-h-60 overflow-y-auto p-1">
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((cat) => (
                                        <li
                                            key={cat.id}
                                            onClick={() => {
                                                setSelectedCat({ id: cat.id, name: cat.name });
                                                setSelectedSub({});
                                                setIsCatOpen(false);
                                                setSearchCat('');
                                                categoryHook.fetchSubcategories(cat.id);
                                                setTimeout(() => setIsSubOpen(true), 150);
                                            }}
                                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors mb-1 ${selectedCat.id === cat.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {cat.name}
                                            {selectedCat.id === cat.id && <Check size={16} className="text-blue-600" />}
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-4 text-center text-xs text-slate-400">Nenhuma categoria encontrada</li>
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* SEÇÃO 2: SUBCATEGORIA */}
            <div className="flex-1 relative h-full" ref={subRef}>
                <div
                    className={`flex items-center justify-between h-full px-4 transition-colors ${!selectedCat.id ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-50'}`}
                    onClick={() => {
                        if (selectedCat.id) {
                            setIsSubOpen(!isSubOpen);
                            setIsCatOpen(false);
                        }
                    }}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`p-2 rounded-lg ${selectedSub.name ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Tag size={18} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Serviço</span>
                            <span className={`text-sm font-medium truncate ${selectedSub.name ? 'text-slate-800' : 'text-slate-400'}`}>
                                {selectedSub.name || (selectedCat.id ? "Escolha o serviço..." : "Selecione a categoria antes")}
                            </span>
                        </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isSubOpen ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                    {isSubOpen && selectedCat.id && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-[110%] left-0 w-full min-w-[250px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
                        >
                            <div className="p-2 border-b border-gray-100 bg-slate-50">
                                <div className="flex items-center px-3 py-2 bg-white border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                    <SearchIcon size={14} className="text-gray-400 mr-2" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder={`Buscar em ${selectedCat.name}...`}
                                        className="bg-transparent w-full text-sm outline-none text-slate-700 placeholder:text-slate-400"
                                        value={searchSub}
                                        onChange={(e) => setSearchSub(e.target.value)}
                                    />
                                </div>
                            </div>

                            <ul className="max-h-60 overflow-y-auto p-1">
                                {filteredSubCategories.length > 0 ? (
                                    filteredSubCategories.map((sub: any) => (
                                        <li
                                            key={sub.id}
                                            onClick={() => {
                                                setSelectedSub({ id: sub.id, name: sub.name });
                                                setIsSubOpen(false);
                                                setSearchSub('');
                                            }}
                                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors mb-1 ${selectedSub.id === sub.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {sub.name}
                                            {selectedSub.id === sub.id && <Check size={16} className="text-emerald-600" />}
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-4 text-center text-xs text-slate-400">
                                        Nenhuma subcategoria encontrada
                                    </li>
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* SEÇÃO 3: BOTÃO DE BUSCA (Movido para fora da subcategoria para melhor layout) */}
            <div className="pl-2">
                <button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md text-sm whitespace-nowrap"
                >
                    Buscar
                </button>
            </div>

        </div>
    );
}