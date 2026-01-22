'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DashboardContainer from "@/components/shared/Dashboard/Dashboard";
import {
    Trash2, Plus, Save, Upload, MapPin,
    Facebook, Instagram, Youtube, Image as ImageIcon, Camera,
    ChevronDown, Check, Search as SearchIcon, X, Loader2, Trash, Phone // Adicionado Phone
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
import { useRouter } from 'next/navigation';
import { workspaceStore } from '@/store/workspace/workspace-store';
import { subcategoryStore } from '@/store/subcategory/subcategory-store';

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

export default function Servicos({ action = 'create' }: { action?: string }) {
    // --- Hooks ---
    const { createService, updateService } = useServices();
    const subcategoryHook = useCategory();
    const { fetchCategories } = useCategory();
    const workspace = useStore(workspaceStore);

    // --- Estados de Dados do Formulário ---
    const service = useStore(serviceStore);
    const subcategory = useStore(subcategoryStore);

    // Imagens
    const [showStickyFooter, setShowStickyFooter] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Controle do Modal de Galeria
    const [modalContext, setModalContext] = useState<ModalContext>(null);

    // Refs
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);
    const subcategoryRef = useRef<HTMLDivElement>(null);

    // Categorias
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

    // Subcategorias
    const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState<CategoryItem | null>(null);

    const [categorySearch, setCategorySearch] = useState('');
    const [subcategorySearch, setSubcategorySearch] = useState('');
    const categoryList = useStore(categoryStore);
    const router = useRouter();

    // --- 1. Carregamento Inicial (Logic Core) ---
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);

            // 1. Busca TODAS as categorias para preencher o primeiro dropdown
            const catResponse = await fetchCategories();

            // Verifica se a busca deu certo
            if (catResponse?.data?.ok && Array.isArray(catResponse.data.data)) {

                // 2. Identifica qual categoria está salva no serviço (ID vindo do service.data)
                const category = catResponse.data.data.find((item: any) => item.id === service.data.id_category);

                if (category) {
                    // Define visualmente a categoria selecionada
                    setSelectedCategory(category);

                    // 3. ESSENCIAL: Busca as SUBCATEGORIAS relativas a essa categoria IMEDIATAMENTE
                    const subResponse = await subcategoryHook.fetchSubcategories(category.id);

                    // 4. Identifica qual subcategoria está salva
                    if (service.data.id_subcategory && subResponse?.data?.ok) {
                        const subList = Array.isArray(subResponse.data.data) ? subResponse.data.data : [];
                        const activeSub = subList.find((sub: any) => sub.id === service.data.id_subcategory);

                        subcategory.fnOnChange("Subcategories", subResponse.data.data.Subcategories);
                        const dataFind = subResponse.data.data.Subcategories.find((item: any) => item.id === service.data.id_subcategory)
                        setSelectedSubcategory(dataFind || null);
                    } else {
                        setSelectedSubcategory(null);
                    }
                }
            }

            setIsLoading(false);
        };

        loadInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [service.data.id]);

    // --- Handlers Auxiliares ---

    // Scroll Sticky Footer
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            setShowStickyFooter(scrollContainerRef.current.scrollTop > 100);
        }
    };

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
            if (subcategoryRef.current && !subcategoryRef.current.contains(event.target as Node)) {
                setIsSubcategoryOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Busca CEP
    const fetchAddressData = async (cepNumbers: string) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);
            const data = await response.json();

            if (!data.erro) {
                const currentContent = service.data.address || {};
                const newData = {
                    ...currentContent,
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf,
                    cep: data.cep
                };
                service.fnOnChange("address", newData);
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
    };

    // Máscara de Whatsapp
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.replace(/\D/g, ""); // Remove tudo o que não é dígito
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); // Coloca parênteses em volta dos dois primeiros dígitos
        value = value.replace(/(\d)(\d{4})$/, "$1-$2"); // Coloca hífen entre o quarto e o quinto dígitos
        service.fnOnChange("whatsapp", value.slice(0, 15)); // Salva no estado principal (limitando caracteres)
    };

    // --- Salvar ---
    const handleSave = async () => {
        setIsSaving(true);

        const payload = {
            name: service.data.name,
            id_category: selectedCategory?.id,
            id_subcategory: selectedSubcategory?.id,
            whatsapp: service.data.whatsapp, // INCLUÍDO AQUI
            content: {
                content: service.data.content.content,
                social_media: service.data.content.social_media,
            },
            address: service.data.address,
            gallery: service.data.gallery,
            cover_image: service.data.cover_image,
            logo_image: service.data.logo_image,
        };

        if (action === 'create') {
            await createService(payload).then((data) => {
                //@ts-ignore
                if (data.data!.ok) router.push("/dashboard");
            });
        } else {
            await updateService(service.data.id, payload).then((data) => {
                //@ts-ignore
                if (data.data!.ok) router.push("/dashboard");
            });
        }
        setIsSaving(false);
    };

    // Filtros de busca locais
    const filteredCategories = categoryList.data.rows?.length
        ? categoryList.data.rows.filter((cat) => cat.name.toLowerCase().includes(categorySearch.toLowerCase()))
        : [];

    const filteredSubcategories = subcategory.data.Subcategories?.length
        ? subcategory.data.Subcategories.filter((cat) => cat.name.toLowerCase().includes(subcategorySearch.toLowerCase()))
        : [];

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // Verificação de Limite da Galeria
    const isGalleryFull = (service.data.gallery?.length || 0) >= 5;

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
                            <img src={service.data.cover_image
                                ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${workspace.data.id}/${service.data.cover_image}`
                                : "https://placehold.co/800x400/f1f5f9/cbd5e1?text=Adicionar+Capa"
                            } alt="Capa" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <motion.button
                                    onClick={() => setModalContext('COVER')}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-slate-700 hover:bg-white shadow-lg"
                                >
                                    <Upload size={16} /> Alterar Capa
                                </motion.button>
                                <motion.button
                                    onClick={() => service.fnOnChange("cover_image", null)}
                                    whileHover={{ scale: 1.1 }}
                                    className="p-2 bg-white/90 text-rose-500 rounded-lg hover:bg-white shadow-lg"
                                >
                                    <Trash size={16} />
                                </motion.button>
                            </div>
                        </div>

                        {/* PERFIL (THUMBNAIL) */}
                        <div className="absolute -bottom-16 left-8 md:left-12 z-10">
                            <motion.div whileHover={{ scale: 1.02 }} className="relative group w-32 h-32 md:w-40 md:h-40 rounded-2xl border-[6px] border-white shadow-xl bg-white overflow-hidden">
                                <img src={service.data.logo_image
                                    ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${workspace.data.id}/${service.data.logo_image}`
                                    : "https://placehold.co/400x400/f1f5f9/cbd5e1?text=Logo"
                                } alt="Thumbnail" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <div className="flex gap-2">
                                        <motion.button onClick={() => setModalContext('PROFILE')} whileHover={{ scale: 1.1 }} className="p-2 bg-white rounded-full text-slate-800">
                                            <Camera size={18} />
                                        </motion.button>
                                        <motion.button onClick={() => service.fnOnChange("logo_image", null)} whileHover={{ scale: 1.1 }} className="p-2 bg-white rounded-full text-rose-500">
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Campos de Texto e Categoria */}
                    <motion.div variants={itemVariants} className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Título do serviço</label>
                            <motion.input whileFocus={{ scale: 1.01 }} type="text" value={service.data.name} onChange={(e) => service.fnOnChange("name", e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-700 font-medium" placeholder="Ex: Manicure e Pedicure" />
                        </div>

                        {/* Select Categoria */}
                        <div className="space-y-2" ref={categoryRef}>
                            <label className="text-sm font-bold text-slate-700">Categoria</label>
                            <div className="relative">
                                <motion.button whileTap={{ scale: 0.99 }} onClick={() => setIsCategoryOpen(!isCategoryOpen)} className={`w-full px-4 py-3 bg-white border rounded-xl flex items-center justify-between text-left transition-all outline-none ${isCategoryOpen ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-gray-100 hover:border-gray-300'}`}>
                                    <span className={`font-medium ${selectedCategory ? 'text-slate-700' : 'text-gray-400'}`}>
                                        {selectedCategory?.name || "Selecione uma categoria"}
                                    </span>
                                    <motion.div animate={{ rotate: isCategoryOpen ? 180 : 0 }}><ChevronDown size={18} className="text-gray-400" /></motion.div>
                                </motion.button>

                                <AnimatePresence>
                                    {isCategoryOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                                            <div className="p-2 border-b border-gray-100">
                                                <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                                                    <SearchIcon size={16} className="text-gray-400 mr-2" />
                                                    <input autoFocus type="text" placeholder="Buscar..." className="bg-transparent w-full text-sm outline-none text-slate-700" value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} />
                                                </div>
                                            </div>
                                            <ul className="max-h-60 overflow-y-auto p-1">
                                                {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
                                                    <motion.li
                                                        key={cat.id}
                                                        whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                                                        onClick={async () => {
                                                            setSelectedSubcategory(null);
                                                            await subcategoryHook.fetchSubcategories(cat.id);
                                                            setSelectedCategory(cat);
                                                            setIsCategoryOpen(false);
                                                            setCategorySearch('');
                                                        }}
                                                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer ${selectedCategory?.id === cat.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600'}`}
                                                    >
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

                        {/* Select Subcategoria */}
                        <div className="space-y-2" ref={subcategoryRef}>
                            <label className="text-sm font-bold text-slate-700">Subcategoria</label>
                            <div className="relative">
                                <motion.button
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => selectedCategory && setIsSubcategoryOpen(!isSubcategoryOpen)}
                                    className={`w-full px-4 py-3 bg-white border rounded-xl flex items-center justify-between text-left transition-all outline-none ${isSubcategoryOpen ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-gray-100 hover:border-gray-300'} ${!selectedCategory ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                                >
                                    <span className={`font-medium ${selectedSubcategory ? 'text-slate-700' : 'text-gray-400'}`}>
                                        {selectedSubcategory?.name || "Selecione uma subcategoria"}
                                    </span>
                                    <motion.div animate={{ rotate: isSubcategoryOpen ? 180 : 0 }}><ChevronDown size={18} className="text-gray-400" /></motion.div>
                                </motion.button>

                                <AnimatePresence>
                                    {isSubcategoryOpen && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                                            <div className="p-2 border-b border-gray-100">
                                                <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                                                    <SearchIcon size={16} className="text-gray-400 mr-2" />
                                                    <input autoFocus type="text" placeholder="Buscar..." className="bg-transparent w-full text-sm outline-none text-slate-700" value={subcategorySearch} onChange={(e) => setSubcategorySearch(e.target.value)} />
                                                </div>
                                            </div>
                                            <ul className="max-h-60 overflow-y-auto p-1">
                                                {filteredSubcategories.length > 0 ? filteredSubcategories.map((cat) => (
                                                    <motion.li
                                                        key={cat.id}
                                                        whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                                                        onClick={() => {
                                                            setSelectedSubcategory(cat);
                                                            setIsSubcategoryOpen(false);
                                                            setSubcategorySearch('');
                                                        }}
                                                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer ${selectedSubcategory?.id === cat.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600'}`}
                                                    >
                                                        {cat.name}
                                                        {selectedSubcategory?.id === cat.id && <Check size={16} className="text-emerald-600" />}
                                                    </motion.li>
                                                )) : <li className="px-3 py-4 text-center text-sm text-gray-400">Nenhuma subcategoria encontrada.</li>}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Descrição - Ocupa 2 colunas */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Descrição</label>
                            <div className="quill-custom">
                                <ReactQuill
                                    theme="snow"
                                    value={service.data.content?.content || ''}
                                    onChange={(val) => {
                                        const currentData = service.data.content || {};
                                        service.fnOnChange("content", { ...currentData, content: val });
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

                        {/* WhatsApp - Ocupa 1 coluna (lado da descrição) */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">WhatsApp</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                                    <Phone size={20} />
                                </div>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    type="text"
                                    maxLength={15}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-slate-700"
                                    placeholder="(00) 00000-0000"
                                    value={service.data.whatsapp || ''}
                                    onChange={handlePhoneChange}
                                />
                            </div>
                            <p className="text-xs text-gray-400">Número para contato direto.</p>
                        </div>
                    </motion.div>

                    <hr className="border-gray-100" />

                    {/* Endereço */}
                    <motion.div variants={itemVariants}>
                        <div className="flex items-center gap-2 mb-6"><MapPin className="text-emerald-600" size={24} /><h2 className="text-xl font-bold text-slate-800">Endereço</h2></div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-4 space-y-2">
                                <label className="text-sm font-bold text-slate-700">CEP</label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }} type="text" name="cep" placeholder="00000-000" maxLength={9}
                                    value={service.data.address?.cep || ''}
                                    onChange={(e) => {
                                        const rawValue = e.target.value;
                                        const currentAddress = service.data.address || {};
                                        service.fnOnChange("address", { ...currentAddress, cep: rawValue });
                                        const cepOnlyNumbers = rawValue.replace(/\D/g, '');
                                        if (cepOnlyNumbers.length === 8) fetchAddressData(cepOnlyNumbers);
                                    }}
                                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>
                            <div className="md:col-span-8 space-y-2"><label className="text-sm font-bold text-slate-700">Rua</label><motion.input whileFocus={{ scale: 1.01 }} type="text" value={service.data.address?.street || ''} onChange={(e) => service.fnOnChange("address", { ...service.data.address, street: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" /></div>
                            <div className="md:col-span-8 space-y-2"><label className="text-sm font-bold text-slate-700">Bairro</label><motion.input whileFocus={{ scale: 1.01 }} type="text" value={service.data.address?.neighborhood || ''} onChange={(e) => service.fnOnChange("address", { ...service.data.address, neighborhood: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" /></div>
                            <div className="md:col-span-4 space-y-2"><label className="text-sm font-bold text-slate-700">Número</label><motion.input whileFocus={{ scale: 1.01 }} type="text" value={service.data.address?.number || ''} onChange={(e) => service.fnOnChange("address", { ...service.data.address, number: ~~e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" /></div>
                            <div className="md:col-span-8 space-y-2"><label className="text-sm font-bold text-slate-700">Cidade</label><motion.input whileFocus={{ scale: 1.01 }} type="text" value={service.data.address?.city || ''} onChange={(e) => service.fnOnChange("address", { ...service.data.address, city: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" /></div>
                            <div className="md:col-span-4 space-y-2"><label className="text-sm font-bold text-slate-700">UF</label><motion.input whileFocus={{ scale: 1.01 }} type="text" value={service.data.address?.state || ''} onChange={(e) => service.fnOnChange("address", { ...service.data.address, state: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-colors" /></div>
                        </div>
                    </motion.div>

                    <hr className="border-gray-100" />

                    {/* SEÇÃO GALERIA DE FOTOS */}
                    <motion.div variants={itemVariants}>
                        <div className="flex items-center gap-2 mb-6">
                            <ImageIcon className="text-emerald-600" size={24} />
                            <h2 className="text-xl font-bold text-slate-800">Galeria de fotos</h2>
                            {isGalleryFull && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold ml-2">Máximo atingido</span>}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <motion.button
                                onClick={() => !isGalleryFull && setModalContext('GALLERY')}
                                disabled={isGalleryFull}
                                whileHover={!isGalleryFull ? { scale: 1.02, backgroundColor: "rgb(236 253 245)", borderColor: "rgb(167 243 208)", color: "rgb(5 150 105)" } : {}}
                                whileTap={!isGalleryFull ? { scale: 0.95 } : {}}
                                className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border-2 border-dashed ${isGalleryFull ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed' : 'bg-gray-50 border-gray-200 text-gray-400 cursor-pointer'}`}
                            >
                                <Plus size={32} />
                                <span className="text-sm font-bold mt-2">
                                    {isGalleryFull ? 'Limite (5)' : 'Adicionar'}
                                </span>
                            </motion.button>

                            <AnimatePresence>
                                {service.data.gallery.map((url, idx) => (
                                    <motion.div
                                        key={`${url}-${idx}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ y: -5 }}
                                        className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm bg-gray-100 border border-gray-100"
                                    >
                                        <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${workspace.data.id}/${url}`} className="w-full h-full object-cover" alt={`Galeria ${idx}`} />
                                        <motion.button
                                            onClick={() => {
                                                const newData = [...service.data.gallery];
                                                newData.splice(idx, 1);
                                                service.fnOnChange("gallery", newData);
                                            }}
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
                                            placeholder={`Link do seu ${social.label}`}
                                            value={service.data.content?.social_media?.[social.key] || ''}
                                            onChange={(e) => {
                                                const currentContent = service.data.content || {};
                                                const currentSocial = currentContent.social_media || {};
                                                service.fnOnChange("content", {
                                                    ...currentContent,
                                                    social_media: { ...currentSocial, [social.key]: e.target.value }
                                                });
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
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

// --- SUB-COMPONENTE: MODAL DE GALERIA ---
function GalleryModal({ onClose, context }: { onClose: () => void, context: string }) {
    const { fetchImages } = useImages();
    const [images, setImages] = useState<ImageItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const service = useStore(serviceStore)

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const response = await fetchImages();
            if (response && response.ok && Array.isArray(response.data)) setImages(response.data);
            setIsLoading(false);
        };
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                <div className='px-6 overflow-scroll h-full'>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="animate-spin text-emerald-600" size={32} />
                        </div>
                    ) : (
                        <ImageGallery
                            callback={(img) => {
                                if (context === 'COVER') {
                                    service.fnOnChange("cover_image", img.path);
                                    onClose();
                                    return;
                                };
                                if (context === 'PROFILE') {
                                    service.fnOnChange("logo_image", img.path);
                                    onClose();
                                    return;
                                };
                                if (context === 'GALLERY') {
                                    // Dupla verificação no modal, embora o botão principal já esteja desabilitado
                                    if (service.data.gallery.length < 5) {
                                        service.fnOnChange("gallery", [...service.data.gallery, img.path]);
                                    }
                                    onClose();
                                    return;
                                };
                            }}
                            showDetails={false}
                            showTitle={false} />
                    )}
                </div>
            </motion.div>
        </div>
    );
}