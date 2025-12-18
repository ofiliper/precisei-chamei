'use client';

import { useState, useEffect, useRef } from "react";
import DashboardContainer from "@/components/shared/Dashboard/Dashboard";
import { UploadCloud, Trash2, X, AlertTriangle, Loader2, Image as ImageIcon, Calendar, FileText, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useImages from "@/hooks/useImages";
import { imageLibraryStore } from "@/store/image-library/image-library-store"; // Importe direto da store criada

interface ImageItem {
    id: string;
    id_workspace?: string;
    name: string | null;
    path: string;
    createdAt: string;
    updatedAt: string;
}

export default function ImageGallery({ showTitle = true }: { showTitle?: boolean }) {

    const { fetchImages, uploadImage, deleteImage } = useImages();

    // --- Hook da Store (Zustand) ---
    const store = imageLibraryStore();
    const { data: storeData, fnOnChange } = store;

    // --- Estados Locais (Apenas UI) ---
    const [isUploading, setIsUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
    const [isDeleteConfirmMode, setIsDeleteConfirmMode] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Carregar imagens ao montar
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        // Atualiza loading na store
        fnOnChange('fetching', true);

        const response = await fetchImages();

        if (response && response.ok && Array.isArray(response.data)) {
            // Atualiza a lista na store
            fnOnChange('images', response.data);
        }

        // Finaliza loading na store
        fnOnChange('fetching', false);
    };

    // 2. Upload
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);

        const uploadPromises = Array.from(files).map(async (file) => {
            // --- MUDANÇA AQUI ---
            // Não usamos new FormData(). Criamos um objeto simples.
            // A chave 'image' deve ser o nome do campo que o backend espera.
            const payload = {
                image: file
            };

            return await uploadImage(payload);
        });

        await Promise.all(uploadPromises);

        if (fileInputRef.current) fileInputRef.current.value = "";
        await loadData();
        setIsUploading(false);
    };

    // 3. Exclusão via Sidebar
    const handleDelete = async () => {
        if (!selectedImage) return;

        setIsDeleting(true);

        const response = await deleteImage(selectedImage.id);

        if (response && response.ok) {
            // Removemos localmente da store para evitar refetch desnecessário
            // Cast 'as any' usado aqui porque a tipagem da sua store (IProps) 
            // difere ligeiramente do retorno da API (ImageItem).
            const currentImages = (storeData.images || []) as unknown as ImageItem[];
            const newImages = currentImages.filter((img) => img.id !== selectedImage.id);

            fnOnChange('images', newImages);
            closeSidebar();
        }

        setIsDeleting(false);
    };

    const closeSidebar = () => {
        setSelectedImage(null);
        setIsDeleteConfirmMode(false);
    };

    const getImageUrl = (path: string) => {
        if (!path) return '';
        return `${path}`;
    };

    // --- Formatação de Data Nativa ---
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Variantes de Animação
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    const sidebarVariants = {
        hidden: { x: "100%", opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
        exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } }
    };

    // Helper para tipagem no render
    const imagesList = (storeData.images || []) as unknown as ImageItem[];

    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-7xl mx-auto pb-10 relative"
            >
                {
                    <div className="hidden flex flex-col md:flex-row justify-between items-end mb-10 gap-4">

                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Galeria de Fotos</h1>
                            <p className="text-gray-500">Gerencie as imagens do seu portfólio.</p>
                        </div>

                        <div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm shadow-md transition-all ${isUploading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#2080B3] to-[#40A56A] text-white hover:shadow-lg"
                                    }`}
                            >
                                {isUploading ? (
                                    <><Loader2 className="animate-spin" size={18} /> Enviando...</>
                                ) : (
                                    <><UploadCloud size={18} /> Upload de Imagens</>
                                )}
                            </motion.button>
                        </div>
                    </div>
                }

                {/* --- GRID --- */}
                <motion.div className="bg-white rounded-[2rem] shadow-sm p-6 min-h-[400px]">
                    {storeData.fetching ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : imagesList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <ImageIcon size={32} className="opacity-50" />
                            </div>
                            <p>Nenhuma imagem encontrada.</p>
                        </div>
                    ) : (
                        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-dashed border-black/20 border-2 font-medium text-sm transition-all $ hover:shadow-lg"
                                    }`}
                            >
                                {isUploading ? (
                                    <><Loader2 className="animate-spin" size={18} /> Enviando...</>
                                ) : (
                                    <div className="flex flex-col justify-center items-center"><UploadCloud size={18} /> Upload de Imagens</div>
                                )}
                            </motion.button>
                            <AnimatePresence>
                                {imagesList.map((img) => (
                                    <motion.div
                                        layout
                                        key={img.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        onClick={() => setSelectedImage(img)}
                                        className={`group cursor-pointer relative aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-sm border-2 transition-all duration-300 ${selectedImage?.id === img.id ? 'border-[#2080B3] ring-2 ring-[#2080B3]/20' : 'border-transparent hover:border-gray-200'}`}
                                    >
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${img.id_workspace}/${img.path}`}
                                            alt={img.name || "Imagem"}
                                            className="w-full h-full object-cover"
                                        // onError={(e) => {
                                        //     e.currentTarget.style.display = 'none';
                                        //     e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                        //     e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-gray-400">Erro</span>';
                                        // }}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {selectedImage && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeSidebar}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
                        />

                        {/* Painel */}
                        <motion.div
                            variants={sidebarVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[100] border-l border-gray-100 flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800">Detalhes da Imagem</h2>
                                <button
                                    onClick={closeSidebar}
                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="w-full aspect-square bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden mb-8 shadow-inner">
                                    <img
                                        src={getImageUrl(`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${selectedImage.id_workspace}/${selectedImage.path}`)}
                                        className="w-full h-full object-contain"
                                        alt="Preview"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <FileText className="text-[#2080B3] mt-1" size={18} />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Nome do Arquivo</p>
                                            <p className="text-gray-700 text-sm break-all font-medium mt-1">
                                                {selectedImage.path}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <Calendar className="text-[#2080B3]" size={18} />
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Data de Criação</p>
                                            <p className="text-gray-700 text-sm font-medium mt-1">
                                                {formatDate(selectedImage.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">ID do Sistema</p>
                                        <code className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">{selectedImage.id}</code>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-white">
                                <AnimatePresence mode="wait">
                                    {!isDeleteConfirmMode ? (
                                        <motion.button
                                            key="btn-delete"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            onClick={() => setIsDeleteConfirmMode(true)}
                                            className="w-full py-3.5 rounded-xl border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Trash2 size={18} />
                                            Excluir Imagem
                                        </motion.button>
                                    ) : (
                                        <motion.div
                                            key="btn-confirm"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-red-800 text-sm mb-2">
                                                <AlertTriangle size={18} className="shrink-0" />
                                                <p>Tem certeza? Essa ação não pode ser desfeita.</p>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setIsDeleteConfirmMode(false)}
                                                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                                    disabled={isDeleting}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={handleDelete}
                                                    disabled={isDeleting}
                                                    className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                                                >
                                                    {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Sim, Excluir"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}