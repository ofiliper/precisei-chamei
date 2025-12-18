'use client';

import { useEffect, useState } from "react";
import DashboardContainer from "@/components/shared/Dashboard/Dashboard";
import { ChevronLeft, ChevronRight, Edit3, Trash2, AlertTriangle, X, Eye, MousePointerClick, ImageOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useServices from "@/hooks/useServices";
import { useStore } from "zustand";
import { serviceListStore } from "@/store/services/service-list-store";

export default function DashboardLayout() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // 1. Novo estado para armazenar o serviço que será excluído
    const [serviceToDelete, setServiceToDelete] = useState<any>(null);

    const servicesHook = useServices();
    const services = useStore(serviceListStore);

    // 2. Função atualizada para excluir de verdade
    const handleConfirmDelete = async () => {
        if (!serviceToDelete) return;

        // Chama a função de delete do hook passando o ID (assumindo que seja _id ou id)
        await servicesHook.deleteService(serviceToDelete._id || serviceToDelete.id);

        // Atualiza a lista após excluir
        await servicesHook.fetchServices();

        console.log("Serviço excluído!");
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);
    };

    useEffect(() => {
        servicesHook.fetchServices();
    }, [])

    // Variantes de animação
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
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-4xl mx-auto pb-10"
                >
                    {/* Seção Serviços */}
                    <div className="max-w-6xl">
                        <div className="flex flex-col sm:flex-row justify-between items-end mb-6 border-b border-gray-200 pb-4">
                            <div>
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-2xl font-bold text-gray-800 mb-2"
                                >
                                    Serviços
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
                            <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead>
                                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Serviço</th>
                                                <th className="p-5 text-xs font-bold text-gray-500 text-center uppercase tracking-wider">Visualizações</th>
                                                <th className="p-5 text-xs font-bold text-gray-500 text-center uppercase tracking-wider">Cliques</th>
                                                <th className="p-5 text-xs font-bold text-gray-500 text-center uppercase tracking-wider">Atualização</th>
                                                <th className="p-5 text-xs font-bold text-gray-500 text-right uppercase tracking-wider">Ações</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {/* 2. Ternário Principal de Renderização da Lista */}

                                            {
                                                services.data.services &&
                                                    services.data.services.length > 0 ? (
                                                    services.data.services.map((serv, key) => (
                                                        <tr
                                                            key={key}
                                                            className="group hover:bg-gray-50/80 transition-all duration-200"
                                                        >
                                                            <td className="p-5">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="relative w-12 h-12 flex-shrink-0 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                                                        {/* 3. Ternário de Imagem: Se tem imagem, mostra IMG, senão mostra Ícone */}
                                                                        {serv.image ? (
                                                                            <img
                                                                                src={serv.image}
                                                                                alt={serv.name}
                                                                                className="object-cover w-full h-full"
                                                                            />
                                                                        ) : (
                                                                            <ImageOff size={20} className="text-gray-400" />
                                                                        )}
                                                                    </div>

                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-gray-900 text-base group-hover:text-emerald-600 transition-colors">
                                                                            {serv.name}
                                                                        </span>
                                                                        {/* <span className="text-xs text-gray-400">
                                                                            {serv.id_category || `ID: ${serv.id?.slice(0, 6) || "..."}`}
                                                                        </span> */}
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="p-5 text-center align-middle">
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                                    <Eye size={14} /> {serv.views || 0}
                                                                </span>
                                                            </td>

                                                            <td className="p-5 text-center align-middle">
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                                    <MousePointerClick size={14} /> {serv.clicks || 0}
                                                                </span>
                                                            </td>

                                                            <td className="p-5 text-center text-sm text-gray-500 whitespace-nowrap">
                                                                {new Date(serv.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                                                            </td>

                                                            <td className="p-5">
                                                                <div className="flex items-center justify-end gap-3">
                                                                    <motion.a
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        href={`/dashboard/servicos/${serv.id}`}
                                                                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                                        title="Editar"
                                                                    >
                                                                        <Edit3 size={18} strokeWidth={2} />
                                                                    </motion.a>

                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        onClick={() => {
                                                                            setServiceToDelete(serv);
                                                                            setIsDeleteModalOpen(true);
                                                                        }}
                                                                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                                        title="Excluir"
                                                                    >
                                                                        <Trash2 size={18} strokeWidth={2} />
                                                                    </motion.button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    /* Caso Falso do Ternário Principal (Empty State) */
                                                    <tr>
                                                        <td colSpan={5} className="p-12 text-center">
                                                            <div className="flex flex-col items-center justify-center text-gray-400 animate-in fade-in duration-500">
                                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                                                                    <ImageOff size={32} opacity={0.5} />
                                                                </div>
                                                                <p className="text-lg font-medium text-gray-900">Nenhum serviço encontrado</p>
                                                                <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                                                                    Você ainda não cadastrou nenhum serviço.
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                        </tbody>
                                    </table>
                                </div>
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

            {/* --- MODAL DE EXCLUSÃO --- */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                            onClick={() => setIsDeleteModalOpen(false)}
                        />

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
                                {/* 4. Mostramos o nome dinâmico do serviço */}
                                <p className="text-gray-500 mb-8 leading-relaxed">
                                    Tem certeza que deseja remover o serviço <span className="font-semibold text-gray-700">"{serviceToDelete?.name}"</span>? <br />
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