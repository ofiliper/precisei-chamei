'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DashboardContainer from "@/components/shared/Dashboard/Dashboard";
import {
    Trash2, Plus, Save, Upload, MapPin,
    Facebook, Instagram, Youtube, Twitter, Image as ImageIcon, Camera,
    ChevronDown, Check, Search as SearchIcon, X, Loader2, UploadCloud
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import 'react-quill/dist/quill.snow.css';

// Hooks
import useServices from '@/hooks/useServices';
import useCategory from '@/hooks/useCategory';
import useImages from '@/hooks/useImages';
import { useStore } from 'zustand';
import { categoryStore } from '@/store/category/category-store';
import ImageGallery from '@/components/shared/ImageGallery';
import { serviceStore } from '@/store/services/services-store';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// --- Interfaces ---
interface CategoryItem {
    id: string | number;
    name: string;
}

interface ImageItem {
    id: string;
    path: string;
    name?: string;
}

// Tipo para controlar quem chamou o modal
type ModalContext = 'COVER' | 'PROFILE' | 'GALLERY' | null;

export default function Servicos() {
    // --- Hooks ---
    const { fetchServices, createService } = useServices();
    const { fetchCategories } = useCategory();

    // --- Estados de Dados do Formulário ---
    const service = useStore(serviceStore);

    const [serviceId, setServiceId] = useState<string | null>(null);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');

    // Imagens
    const [capaUrl, setCapaUrl] = useState("https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=2000&auto=format&fit=crop");
    const [perfilUrl, setPerfilUrl] = useState("https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop");
    const [galeriaUrls, setGaleriaUrls] = useState<string[]>([]); // Lista de fotos do serviço

    // --- Estados de UI ---
    const [showStickyFooter, setShowStickyFooter] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Controle do Modal de Galeria
    const [modalContext, setModalContext] = useState<ModalContext>(null); // Se != null, modal está aberto

    // Refs
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);

    // Endereço
    const [address, setAddress] = useState({
        cep: '', logradouro: '', bairro: '', localidade: '', uf: ''
    });

    // Categorias
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryList = useStore(categoryStore);
    const [selectedCategory, setSelectedCategory] = useState<any>({});
    const [categorySearch, setCategorySearch] = useState('');

    // --- 1. Carregamento Inicial ---
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);

            // Carrega Categorias
            const catResponse = await fetchCategories();
            if (catResponse.ok && Array.isArray(catResponse.data)) {
                setCategories(catResponse.data);
            }

            // Carrega Serviço Existente (Simulação)
            const servResponse = await fetchServices();
            if (servResponse && servResponse.ok && Array.isArray(servResponse.data) && servResponse.data.length > 0) {
                const existing = servResponse.data[0];
                setServiceId(existing.id);
                setTitulo(existing.title || '');
                setDescricao(existing.description || '');
                // Se o backend retornar esses campos, atualize aqui:
                // setCapaUrl(existing.image || capaUrl);
                // setPerfilUrl(existing.thumbnail || perfilUrl);
                // setGaleriaUrls(existing.gallery || []);
                // setSelectedCategory(existing.category || null);
            }

            setIsLoading(false);
        };

        loadInitialData();
    }, []);

    // --- Handlers Auxiliares ---

    // Scroll Sticky Footer
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            setShowStickyFooter(scrollContainerRef.current.scrollTop > 100);
        }
    };

    // Fechar dropdown categorias ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [categoryRef]);

    // Busca CEP
    // Função separada (pode ficar fora do return, junto com os outros handlers)
    const fetchAddressData = async (cepNumbers: string) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);
            const data = await response.json();

            if (!data.erro) {
                // Pega o estado ATUAL do zustand para não perder dados digitados nesse meio tempo
                const currentContent = service.data.content || {};
                const currentAddress = currentContent.address || {};

                const newData = {
                    ...currentContent,
                    address: {
                        ...currentAddress,
                        // Preenche os campos com o retorno da API
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf,
                        // Mantém o cep que já estava (ou formate se preferir)
                        cep: currentAddress.cep
                    }
                };

                // Atualiza o store de uma vez
                service.fnOnChange("content", newData);
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
    };


    // --- Lógica do Modal de Imagem ---

    // Função chamada quando o usuário clica em uma imagem no Modal
    const handleImageSelectedInModal = (url: string) => {
        if (modalContext === 'COVER') {
            setCapaUrl(url);
        } else if (modalContext === 'PROFILE') {
            setPerfilUrl(url);
        } else if (modalContext === 'GALLERY') {
            // Adiciona ao array de galeria se não existir
            if (!galeriaUrls.includes(url)) {
                setGaleriaUrls(prev => [...prev, url]);
            }
        }
        setModalContext(null); // Fecha modal
    };

    // Remove imagem da galeria (lista pequena)
    const removeGalleryImage = (indexToRemove: number) => {
        setGaleriaUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    // --- Salvar ---
    const handleSave = async () => {
        setIsSaving(true);
        const payload = {
            // id: serviceId,
            name: titulo,
            id_category: selectedCategory?.id,
            content: {
                content: service.data.content.content,
                address: service.data.content.address,
                images: service.data.content.images,
                social_media: service.data.content.social_media,
            },
            image: capaUrl,        // Capa
            thumbnail: perfilUrl,  // Perfil
        };

        await createService(payload);
        setIsSaving(false);
    };

    // Filtro Categorias
    const filteredCategories = categoryList.data.rows!.length > 0
        ? categoryList.data.rows!.filter((cat) => ({
            name: cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
            id: cat.id
        })
        )
        : []

    // Animações
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="h-[calc(100vh-1rem)] overflow-y-auto pb-40 px-6 md:px-10 scroll-smooth relative"
        >
            <style jsx global>{`
                    .quill-custom .ql-toolbar { border-color: #f3f4f6; border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; background-color: #f9fafb; }
                    .quill-custom .ql-container { border-color: #f3f4f6; border-bottom-left-radius: 0.75rem; border-bottom-right-radius: 0.75rem; background-color: white; font-family: inherit; font-size: 0.875rem; }
                    .quill-custom .ql-editor { min-height: 120px; color: #334155; }
                `}</style>

            <motion.div
                initial="hidden" animate="visible"
                className="max-w-5xl mx-auto pt-8"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Serviço</h1>
                        <p className="text-gray-500 mt-1">Edite as informações do seu serviço</p>
                    </div>
                    <motion.button
                        onClick={handleSave} disabled={isSaving}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSaving ? 'Salvando...' : 'Salvar agora'}
                    </motion.button>
                </motion.div>

                <div className="space-y-10">
                    {/* SEÇÃO 1: Imagens (Capa e Perfil) */}
                    <motion.div variants={itemVariants} className="relative mb-24 bg-white rounded-2xl p-1 shadow-sm">

                        {/* CAPA */}
                        <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden group bg-gray-100">
                            <img src={capaUrl} alt="Capa" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <motion.button
                                    onClick={() => setModalContext('COVER')} // Abre modal contexto CAPA
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-slate-700 hover:bg-white shadow-lg"
                                >
                                    <Upload size={16} /> Alterar Capa
                                </motion.button>
                            </div>
                        </div>

                        {/* PERFIL (THUMBNAIL) */}
                        <div className="absolute -bottom-16 left-8 md:left-12 z-10">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative group w-32 h-32 md:w-40 md:h-40 rounded-2xl border-[6px] border-white shadow-xl bg-white overflow-hidden"
                            >
                                <img src={perfilUrl} alt="Thumbnail" className="w-full h-full object-cover" />

                                {/* Overlay de Edição */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <div className="flex gap-2">
                                        <motion.button
                                            onClick={() => setModalContext('PROFILE')} // Abre modal contexto PERFIL
                                            whileHover={{ scale: 1.1 }}
                                            className="p-2 bg-white rounded-full text-slate-800"
                                        >
                                            <Camera size={18} />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Campos de Texto e Categoria */}
                    <motion.div variants={itemVariants} className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Título do serviço</label>
                            <motion.input whileFocus={{ scale: 1.01 }} type="text" value={service.data.name} onChange={(e) => service.fnOnChange("name", e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-700 font-medium" placeholder="Ex: Manicure e Pedicure" />
                        </div>

                        {/* Select Categoria */}
                        <div className="space-y-2" ref={categoryRef}>
                            <label className="text-sm font-bold text-slate-700">Categoria</label>
                            <div className="relative">
                                <motion.button whileTap={{ scale: 0.99 }} onClick={() => setIsCategoryOpen(!isCategoryOpen)} className={`w-full px-4 py-3 bg-white border rounded-xl flex items-center justify-between text-left transition-all outline-none ${isCategoryOpen ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-gray-100 hover:border-gray-300'}`}>
                                    <span className={`font-medium ${selectedCategory ? 'text-slate-700' : 'text-gray-400'}`}>{selectedCategory ? selectedCategory.name : "Selecione uma categoria"}</span>
                                    <motion.div animate={{ rotate: isCategoryOpen ? 180 : 0 }}><ChevronDown size={18} className="text-gray-400" /></motion.div>
                                </motion.button>

                                <AnimatePresence>
                                    {isCategoryOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                                            <div className="p-2 border-b border-gray-100">
                                                <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg"><SearchIcon size={16} className="text-gray-400 mr-2" /><input autoFocus type="text" placeholder="Buscar..." className="bg-transparent w-full text-sm outline-none text-slate-700" value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} /></div>
                                            </div>
                                            <ul className="max-h-60 overflow-y-auto p-1">
                                                {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
                                                    <motion.li key={cat.id} whileHover={{ backgroundColor: "rgb(249 250 251)" }} onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false); setCategorySearch(''); }} className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer ${selectedCategory?.id === cat.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600'}`}>
                                                        {cat.name}
                                                        {selectedCategory?.id === cat.id && <Check size={16} className="text-emerald-600" />}
                                                    </motion.li>
                                                )) : <li className="px-3 py-4 text-center text-sm text-gray-400">Nenhuma categoria encontrada.</li>}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Descrição</label>
                            <div className="quill-custom">
                                <ReactQuill
                                    theme="snow"
                                    // Proteção contra null/undefined
                                    value={service.data.content?.content || ''}
                                    onChange={(val) => {
                                        // val é a string HTML direta

                                        // 1. Pegamos o objeto content atual (com address, social_media, etc)
                                        const currentData = service.data.content || {};

                                        // 2. Criamos um novo objeto mantendo o resto e atualizando só o texto
                                        const newData = {
                                            ...currentData,
                                            content: val
                                        };

                                        // 3. Enviamos para o store
                                        service.fnOnChange("content", newData);
                                    }}
                                    placeholder="Descreva os detalhes..."
                                    modules={{
                                        toolbar: [
                                            ['bold', 'italic', 'underline'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['clean']
                                        ]
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    <hr className="border-gray-100" />

                    {/* Endereço (Mantendo a lógica existente) */}
                    <motion.div variants={itemVariants}>
                        <div className="flex items-center gap-2 mb-6"><MapPin className="text-emerald-600" size={24} /><h2 className="text-xl font-bold text-slate-800">Endereço</h2></div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-4 space-y-2"><label className="text-sm font-bold text-slate-700">CEP</label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    type="text"
                                    name="cep"
                                    placeholder="00000-000"
                                    maxLength={9} // 8 números + 1 traço
                                    value={service.data.content.address?.cep || ''}

                                    onChange={(e) => {
                                        const rawValue = e.target.value;

                                        // 1. Atualiza o estado visualmente (para o usuário ver o que digita)
                                        const currentContent = service.data.content || {};
                                        const currentAddress = currentContent.address || {};

                                        const newData = {
                                            ...currentContent,
                                            address: {
                                                ...currentAddress,
                                                cep: rawValue
                                            }
                                        };
                                        service.fnOnChange("content", newData);

                                        // 2. Limpa para pegar só números
                                        const cepOnlyNumbers = rawValue.replace(/\D/g, '');

                                        // 3. Só chama a API se tiver EXATAMENTE 8 números
                                        if (cepOnlyNumbers.length === 8) {
                                            fetchAddressData(cepOnlyNumbers);
                                        }
                                    }}
                                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>
                            <div className="md:col-span-8 space-y-2"><label className="text-sm font-bold text-slate-700">Rua</label><motion.input whileFocus={{ scale: 1.01 }} type="text" name="logradouro" value={service.data.content.address?.street || ''} onChange={(e) => {
                                const newData = { ...service.data.content }
                                newData.address = {
                                    ...newData.address,
                                    street: e.target.value
                                }
                                service.fnOnChange("content", newData);


                            }} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" /></div>
                            <div className="md:col-span-12 space-y-2"><label className="text-sm font-bold text-slate-700">Bairro</label><motion.input whileFocus={{ scale: 1.01 }} type="text" name="bairro" value={service.data.content.address?.neighborhood || ''} onChange={(e) => {
                                const newData = { ...service.data.content }
                                newData.address = {
                                    ...newData.address,
                                    neighborhood: e.target.value
                                }
                                service.fnOnChange("content", newData);


                            }} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" /></div>
                            <div className="md:col-span-8 space-y-2"><label className="text-sm font-bold text-slate-700">Cidade</label><motion.input whileFocus={{ scale: 1.01 }} type="text" name="localidade" value={service.data.content.address?.city || ''} onChange={(e) => {
                                const newData = { ...service.data.content }
                                newData.address = {
                                    ...newData.address,
                                    city: e.target.value
                                }
                                service.fnOnChange("content", newData);


                            }} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" /></div>
                            <div className="md:col-span-4 space-y-2"><label className="text-sm font-bold text-slate-700">UF</label><motion.input whileFocus={{ scale: 1.01 }} type="text" name="uf" value={service.data.content.address?.state || ''} onChange={(e) => {
                                const newData = { ...service.data.content }
                                newData.address = {
                                    ...newData.address,
                                    state: e.target.value
                                }
                                service.fnOnChange("content", newData);


                            }} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" /></div>
                        </div>
                    </motion.div>

                    <hr className="border-gray-100" />

                    {/* SEÇÃO GALERIA DE FOTOS */}
                    <motion.div variants={itemVariants}>
                        <div className="flex items-center gap-2 mb-6">
                            <ImageIcon className="text-emerald-600" size={24} />
                            <h2 className="text-xl font-bold text-slate-800">Galeria de fotos</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Botão Adicionar */}
                            <motion.button
                                onClick={() => setModalContext('GALLERY')} // Abre modal contexto GALERIA
                                whileHover={{ scale: 1.02, backgroundColor: "rgb(236 253 245)", borderColor: "rgb(167 243 208)", color: "rgb(5 150 105)" }}
                                whileTap={{ scale: 0.95 }}
                                className="aspect-square bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400 transition-all border-2 border-dashed border-gray-200"
                            >
                                <Plus size={32} />
                                <span className="text-sm font-bold mt-2">Adicionar</span>
                            </motion.button>

                            {/* Lista Dinâmica da Galeria */}
                            <AnimatePresence>
                                {galeriaUrls.map((url, idx) => (
                                    <motion.div
                                        key={`${url}-${idx}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ y: -5 }}
                                        className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm bg-gray-100 border border-gray-100"
                                    >
                                        <img src={url} className="w-full h-full object-cover" alt={`Galeria ${idx}`} />
                                        <motion.button
                                            onClick={() => removeGalleryImage(idx)}
                                            whileHover={{ scale: 1.1 }}
                                            className="absolute top-2 right-2 p-2 bg-white/90 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-white"
                                        >
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <hr className="border-gray-100" />

                    {/* Redes Sociais */}
                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Redes sociais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                            {[
                                { label: 'Facebook', key: 'facebook', icon: Facebook, color: 'text-blue-600' },
                                { label: 'Instagram', key: 'instagram', icon: Instagram, color: 'text-pink-600' },
                                { label: 'YouTube', key: 'youtube', icon: Youtube, color: 'text-red-600' },
                                { label: 'X (Twitter)', key: 'x', icon: Twitter, color: 'text-slate-900' }
                            ].map((social, index) => (
                                <div key={index} className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">{social.label}</label>
                                    <div className="relative">
                                        {/* Ícone (Apenas visual) */}
                                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${social.color}`}>
                                            <social.icon size={20} />
                                        </div>

                                        {/* Input (Onde a lógica deve acontecer) */}
                                        <motion.input
                                            whileFocus={{ scale: 1.01 }}
                                            type="text"
                                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                            placeholder={`Link do seu ${social.label}`}

                                            // 1. O valor deve vir do store
                                            // Usamos ?. e || '' para evitar erros se for undefined
                                            value={service.data.content?.social_media?.[social.key] || ''}

                                            // 2. O evento de mudança
                                            onChange={(e) => {
                                                const currentContent = service.data.content || {};
                                                const currentSocial = currentContent.social_media || {};

                                                const newData = {
                                                    ...currentContent,
                                                    social_media: {
                                                        ...currentSocial,
                                                        [social.key]: e.target.value
                                                    }
                                                };

                                                service.fnOnChange("content", newData);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Footer Fixo */}
            <AnimatePresence>
                {showStickyFooter && (
                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-6 right-6 md:right-10 z-50">
                        <div className="bg-white/90 backdrop-blur-md border border-gray-200 p-4 rounded-2xl shadow-2xl flex items-center gap-6">
                            <motion.button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                Salvar alterações
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MODAL DE GALERIA --- */}
            <AnimatePresence>
                {modalContext !== null && (
                    <GalleryModal
                        context={modalContext}
                        onClose={() => setModalContext(null)}
                        onSelect={handleImageSelectedInModal}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

// --- SUB-COMPONENTE: MODAL DE GALERIA ---
function GalleryModal({ onClose, onSelect, context }: { onClose: () => void, onSelect: (url: string) => void, context: ModalContext }) {
    const { fetchImages, uploadImage } = useImages();
    const [images, setImages] = useState<ImageItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const BASE_IMAGE_URL = "";

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setIsLoading(true);
        const response = await fetchImages();
        if (response && response.ok && Array.isArray(response.data)) setImages(response.data);
        setIsLoading(false);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setIsUploading(true);
        await Promise.all(Array.from(files).map(async (file) => await uploadImage({ image: file })));
        if (fileInputRef.current) fileInputRef.current.value = "";
        await loadData();
        setIsUploading(false);
    };

    const getImageUrl = (path: string) => (!path ? '' : path.startsWith('http') ? path : `${BASE_IMAGE_URL}${path}`);

    // Título dinâmico do Modal
    const getTitle = () => {
        if (context === 'COVER') return 'Alterar Imagem de Capa';
        if (context === 'PROFILE') return 'Alterar Imagem de Perfil';
        if (context === 'GALLERY') return 'Adicionar à Galeria';
        return 'Selecionar Imagem';
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{getTitle()}</h2>
                        <p className="text-sm text-gray-500">Escolha uma imagem da sua biblioteca.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-500" /></button>
                </div>
                <div className='px-6 overflow-scroll'>
                    <ImageGallery showTitle={false} />
                </div>
                {/* <div className="p-4 px-6 flex justify-end border-b border-gray-100">
                    <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleUpload} />
                    <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                        {isUploading ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />} Fazer Upload
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                    {isLoading ? <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-emerald-600" size={32} /></div> : images.length === 0 ? <div className="text-center text-gray-400 py-20">Nenhuma imagem encontrada.</div> : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img) => (
                                <motion.div key={img.id} whileHover={{ scale: 1.02 }} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-emerald-500 transition-all" onClick={() => onSelect(getImageUrl(img.path))}>
                                    <img src={getImageUrl(img.path)} className="w-full h-full object-cover" alt="Galeria" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center"><span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">Selecionar</span></div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div> */}
            </motion.div>
        </div>
    );
}