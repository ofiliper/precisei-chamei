'use client';

import { useState } from "react";
import DashboardContainer from "@/components/shared/Dashboard/Dashboard";
import { ChevronLeft, ChevronRight, Edit3, Trash2, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleConfirmDelete = () => {
        console.log("Serviço excluído!");
        setIsDeleteModalOpen(false);
    };

    // Variantes de animação para reutilização
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        },
        exit: { 
            opacity: 0, 
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    return (
        <>
            <DashboardContainer>
                {/* Envolvemos o conteúdo principal em um motion.div para entrada suave */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-4xl mx-auto pb-10"
                >
                    {/* Título */}
                    <div className="mb-10">
                        <motion.h1 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl font-bold text-gray-800 mb-2"
                        >
                            Dashboard
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-500"
                        >
                            Acompanhe as métricas de seu anúncio.
                        </motion.p>
                    </div>

                    {/* Cards de Métricas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 max-w-3xl">
                        <motion.div 
                            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                            className="bg-[#1f2d0e] rounded-[2rem] p-10 text-white min-h-[180px] flex flex-col justify-center shadow-lg relative overflow-hidden cursor-default"
                        >
                            <div className="relative z-10">
                                <p className="text-sm font-medium opacity-80 mb-3 uppercase tracking-wider">Total de visitas</p>
                                <p className="text-6xl font-semibold tracking-tight">10.242</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)" }}
                            className="bg-white rounded-[2rem] p-10 text-gray-800 min-h-[180px] flex flex-col justify-center shadow-sm relative cursor-default"
                        >
                            <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Total de cliques no link</p>
                            <p className="text-6xl font-semibold text-gray-500 tracking-tight hover:text-gray-700 transition-colors">682</p>
                        </motion.div>
                    </div>

                    {/* Seção Serviços */}
                    <div className="max-w-6xl">
                        <div className="flex flex-col sm:flex-row justify-between items-end mb-6 border-b border-gray-200 pb-4">
                            <h2 className="text-3xl font-bold text-gray-700">Serviços</h2>
                            
                            <motion.a 
                                href="/dashboard/servicos"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] text-white px-6 py-3 rounded-lg font-medium text-sm shadow-md w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-center"
                            >
                                Cadastrar serviços
                            </motion.a>
                        </div>

                        {/* Tabela */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-[2rem] shadow-sm p-4 overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr>
                                            <th className="p-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nome</th>
                                            <th className="p-6 text-xs font-semibold text-gray-400 text-center uppercase tracking-wider">Última atualização</th>
                                            <th className="p-6 text-xs font-semibold text-gray-400 text-right uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        <tr className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden p-1 shadow-sm">
                                                        <img src="https://i.pravatar.cc/150?img=30" alt="Service" className="object-cover w-full h-full rounded-xl" />
                                                    </div>
                                                    <span className="font-bold text-gray-700 text-lg">Selina Manicure</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center font-medium">20 de out.</td>
                                            <td className="p-6">
                                                <div className="flex items-center justify-end gap-6">
                                                    <motion.a 
                                                        whileHover={{ scale: 1.1, color: "#2c8b96" }}
                                                        whileTap={{ scale: 0.9 }}
                                                        href="/dashboard/servicos" 
                                                        className="flex items-center gap-2 text-sm text-gray-500 font-medium transition-colors"
                                                    >
                                                        <Edit3 size={18} />
                                                        Editar
                                                    </motion.a>
                                                    
                                                    <motion.button
                                                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => setIsDeleteModalOpen(true)}
                                                        className="text-gray-400 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginação */}
                            <div className="flex items-center justify-between mt-4 px-4 py-2 border-t border-gray-50">
                                <span className="text-xs text-gray-400">Página 1</span>
                                <div className="flex items-center gap-2">
                                    <motion.button whileTap={{ scale: 0.8 }} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-400"><ChevronLeft size={16} /></motion.button>
                                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-sm font-bold text-gray-600">1</span>
                                    <motion.button whileTap={{ scale: 0.8 }} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-400"><ChevronRight size={16} /></motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </DashboardContainer>

            {/* --- MODAL DE EXCLUSÃO (Com AnimatePresence) --- */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                            onClick={() => setIsDeleteModalOpen(false)}
                        />

                        {/* Conteúdo do Modal */}
                        <motion.div 
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 z-10"
                        >
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <motion.div 
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                    className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6"
                                >
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <AlertTriangle className="text-red-600" size={24} />
                                    </div>
                                </motion.div>

                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Excluir serviço?</h3>
                                <p className="text-gray-500 mb-8 leading-relaxed">
                                    Tem certeza que deseja remover o serviço <span className="font-semibold text-gray-700">"Selina Manicure"</span>? <br />
                                    Essa ação não poderá ser desfeita.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 w-full">
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium transition-colors"
                                    >
                                        Cancelar
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: "#b91c1c" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleConfirmDelete}
                                        className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-medium shadow-lg shadow-red-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={18} />
                                        Sim, excluir
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}