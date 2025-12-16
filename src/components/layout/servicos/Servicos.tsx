'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DashboardContainer from "@/components/shared/Dashboard/Dashboard";
import { 
    Trash2, Plus, Save, Upload, MapPin, 
    Facebook, Instagram, Youtube, Twitter, Image as ImageIcon, Camera,
    ChevronDown, Check, Search as SearchIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function Servicos() {
    const [showStickyFooter, setShowStickyFooter] = useState(false);
    const [descricao, setDescricao] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    // -- Lógica do Select Customizado --
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categorySearch, setCategorySearch] = useState('');
    const categoryRef = useRef<HTMLDivElement>(null);

    const categoriesList = [
        "Beleza e Estética", "Saúde e Bem-estar", "Serviços Domésticos",
        "Assistência Técnica", "Aulas e Cursos", "Eventos e Festas",
        "Moda e Design", "Consultoria", "Transporte"
    ];

    const filteredCategories = categoriesList.filter(cat => 
        cat.toLowerCase().includes(categorySearch.toLowerCase())
    );

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [categoryRef]);

    // -- Lógica de Endereço (ViaCEP) --
    const [address, setAddress] = useState({
        cep: '', logradouro: '', bairro: '', localidade: '', uf: ''
    });

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const scrollTop = scrollContainerRef.current.scrollTop;
            setShowStickyFooter(scrollTop > 100);
        }
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let cep = e.target.value.replace(/\D/g, '');
        setAddress(prev => ({ ...prev, cep: e.target.value }));

        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setAddress(prev => ({
                        ...prev,
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        localidade: data.localidade,
                        uf: data.uf
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            }
        }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    // Variantes de Animação
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <DashboardContainer>
            <div 
                ref={scrollContainerRef} 
                onScroll={handleScroll} 
                className="h-[calc(100vh-1rem)] overflow-y-auto pb-40 px-6 md:px-10 scroll-smooth relative"
            >
                <style jsx global>{`
                    .quill-custom .ql-toolbar {
                        border-color: #f3f4f6;
                        border-top-left-radius: 0.75rem;
                        border-top-right-radius: 0.75rem;
                        background-color: #f9fafb;
                    }
                    .quill-custom .ql-container {
                        border-color: #f3f4f6;
                        border-bottom-left-radius: 0.75rem;
                        border-bottom-right-radius: 0.75rem;
                        background-color: white;
                        font-family: inherit;
                        font-size: 0.875rem;
                    }
                    .quill-custom .ql-editor {
                        min-height: 120px;
                        color: #334155;
                    }
                `}</style>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-5xl mx-auto pt-8"
                >
                    
                    {/* Cabeçalho Superior */}
                    <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Serviço</h1>
                            <p className="text-gray-500 mt-1">Edite as informações do seu serviço</p>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                        >
                            <Save size={18} />
                            Salvar agora
                        </motion.button>
                    </motion.div>

                    <div className="space-y-10">
                        
                        {/* SEÇÃO 1: Imagens */}
                        <motion.div variants={itemVariants} className="relative mb-24 bg-white rounded-2xl p-1 shadow-sm">
                            <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden group bg-gray-100">
                                <img 
                                    src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=2000&auto=format&fit=crop" 
                                    alt="Capa" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors shadow-lg">
                                        <Upload size={16} /> Alterar Capa
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.05 }} className="p-2 bg-rose-500/90 backdrop-blur-sm rounded-lg text-white hover:bg-rose-600 transition-colors shadow-lg">
                                        <Trash2 size={16} />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="absolute -bottom-16 left-8 md:left-12 z-10">
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="relative group w-32 h-32 md:w-40 md:h-40 rounded-2xl border-[6px] border-white shadow-xl bg-white overflow-hidden"
                                >
                                    <img 
                                        src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop" 
                                        alt="Thumbnail" 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <div className="flex gap-2">
                                            <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-white rounded-full text-slate-800">
                                                <Camera size={18} />
                                            </motion.button>
                                            <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-rose-500 rounded-full text-white">
                                                <Trash2 size={18} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Formulário Geral */}
                        <motion.div variants={itemVariants} className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Título do serviço</label>
                                <motion.input 
                                    whileFocus={{ scale: 1.01 }}
                                    type="text" 
                                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-700 font-medium"
                                    placeholder="Ex: Manicure e Pedicure Profissional"
                                />
                            </div>

                            {/* SELECT CUSTOMIZADO DE CATEGORIA */}
                            <div className="space-y-2" ref={categoryRef}>
                                <label className="text-sm font-bold text-slate-700">Categoria</label>
                                <div className="relative">
                                    <motion.button 
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                        className={`
                                            w-full px-4 py-3 bg-white border rounded-xl flex items-center justify-between
                                            text-left transition-all outline-none
                                            ${isCategoryOpen 
                                                ? 'border-emerald-500 ring-4 ring-emerald-500/10' 
                                                : 'border-gray-100 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <span className={`font-medium ${selectedCategory ? 'text-slate-700' : 'text-gray-400'}`}>
                                            {selectedCategory || "Selecione uma categoria"}
                                        </span>
                                        <motion.div animate={{ rotate: isCategoryOpen ? 180 : 0 }}>
                                            <ChevronDown size={18} className="text-gray-400" />
                                        </motion.div>
                                    </motion.button>

                                    {/* Dropdown com Animação */}
                                    <AnimatePresence>
                                        {isCategoryOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20"
                                            >
                                                <div className="p-2 border-b border-gray-100">
                                                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                                                        <SearchIcon size={16} className="text-gray-400 mr-2" />
                                                        <input 
                                                            autoFocus
                                                            type="text"
                                                            placeholder="Buscar categoria..."
                                                            className="bg-transparent w-full text-sm outline-none text-slate-700"
                                                            value={categorySearch}
                                                            onChange={(e) => setCategorySearch(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <ul className="max-h-60 overflow-y-auto p-1">
                                                    {filteredCategories.length > 0 ? (
                                                        filteredCategories.map((cat, idx) => (
                                                            <motion.li 
                                                                key={idx}
                                                                whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                                                                onClick={() => {
                                                                    setSelectedCategory(cat);
                                                                    setIsCategoryOpen(false);
                                                                    setCategorySearch('');
                                                                }}
                                                                className={`
                                                                    flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors
                                                                    ${selectedCategory === cat ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600'}
                                                                `}
                                                            >
                                                                {cat}
                                                                {selectedCategory === cat && <Check size={16} className="text-emerald-600" />}
                                                            </motion.li>
                                                        ))
                                                    ) : (
                                                        <li className="px-3 py-4 text-center text-sm text-gray-400">
                                                            Nenhuma categoria encontrada.
                                                        </li>
                                                    )}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-slate-700">Descrição detalhada</label>
                                <div className="quill-custom">
                                    <ReactQuill 
                                        theme="snow" 
                                        value={descricao} 
                                        onChange={setDescricao}
                                        placeholder="Descreva os detalhes, diferenciais e o que está incluso no seu serviço..."
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline'],
                                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                ['clean']
                                            ]
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <hr className="border-gray-100" />

                        {/* SEÇÃO ENDEREÇO */}
                        <motion.div variants={itemVariants}>
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin className="text-emerald-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800">Endereço de atendimento</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                <div className="md:col-span-4 space-y-2">
                                    <label className="text-sm font-bold text-slate-700">CEP</label>
                                    <motion.input whileFocus={{ scale: 1.01 }}
                                        type="text" name="cep" value={address.cep} onChange={handleCepChange} maxLength={9}
                                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" 
                                        placeholder="00000-000" 
                                    />
                                </div>
                                <div className="md:col-span-8 space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Rua</label>
                                    <motion.input whileFocus={{ scale: 1.01 }}
                                        type="text" name="logradouro" value={address.logradouro} onChange={handleAddressChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" 
                                    />
                                </div>
                                <div className="md:col-span-12 space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Bairro</label>
                                    <motion.input whileFocus={{ scale: 1.01 }}
                                        type="text" name="bairro" value={address.bairro} onChange={handleAddressChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" 
                                    />
                                </div>
                                <div className="md:col-span-8 space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Cidade</label>
                                    <motion.input whileFocus={{ scale: 1.01 }}
                                        type="text" name="localidade" value={address.localidade} onChange={handleAddressChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" 
                                    />
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <label className="text-sm font-bold text-slate-700">UF</label>
                                    <motion.input whileFocus={{ scale: 1.01 }}
                                        type="text" name="uf" value={address.uf} onChange={handleAddressChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" 
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <hr className="border-gray-100" />

                        {/* Galeria */}
                        <motion.div variants={itemVariants}>
                            <div className="flex items-center gap-2 mb-6">
                                <ImageIcon className="text-emerald-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800">Galeria de fotos</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <motion.button 
                                    whileHover={{ scale: 1.02, backgroundColor: "rgb(236 253 245)", borderColor: "rgb(167 243 208)", color: "rgb(5 150 105)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="aspect-square bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400 transition-all border-2 border-dashed border-gray-200"
                                >
                                    <Plus size={32} />
                                    <span className="text-sm font-bold mt-2">Adicionar</span>
                                </motion.button>
                                {[1, 2, 3].map((_, idx) => (
                                    <motion.div 
                                        key={idx} 
                                        whileHover={{ y: -5 }}
                                        className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm bg-gray-100"
                                    >
                                        <img src={`https://images.unsplash.com/photo-${idx === 0 ? '1519014816548-bf5fe059e98b' : idx === 1 ? '1604654894610-df63bc536371' : '1516975080664-ed2fc6a32937'}?q=80&w=400`} className="w-full h-full object-cover" alt="" />
                                        <motion.button 
                                            whileHover={{ scale: 1.1 }}
                                            className="absolute top-2 right-2 p-2 bg-white/90 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-white"
                                        >
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <hr className="border-gray-100" />

                        {/* Redes Sociais */}
                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Redes sociais</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                                {[
                                    { label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
                                    { label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
                                    { label: 'YouTube', icon: Youtube, color: 'text-red-600' },
                                    { label: 'X (Twitter)', icon: Twitter, color: 'text-slate-900' }
                                ].map((social, index) => (
                                    <div key={index} className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">{social.label}</label>
                                        <div className="relative">
                                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${social.color}`}>
                                                <social.icon size={20} />
                                            </div>
                                            <motion.input 
                                                whileFocus={{ scale: 1.01 }}
                                                type="text" 
                                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* BARRA INFERIOR FIXA */}
                <AnimatePresence>
                    {showStickyFooter && (
                        <motion.div 
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed bottom-6 right-6 md:right-10 z-50"
                        >
                            <div className="bg-white/90 backdrop-blur-md border border-gray-200 p-4 rounded-2xl shadow-2xl flex items-center gap-6">
                                <span className="text-sm text-gray-500 hidden md:block animate-pulse">
                                    Alterações não salvas...
                                </span>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Salvar alterações
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardContainer>
    )
}