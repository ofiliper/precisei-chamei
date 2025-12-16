'use client';

import DashboardContainer from "@/components/shared/Dashboard/Dashboard";
import { Camera, Save, Lock, User, Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function MeusDados() {

    // Variantes de animação para orquestrar a entrada dos elementos
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
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
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto pb-10"
            >

                {/* Cabeçalho da Página */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Meus Dados</h1>
                    <p className="text-gray-500 mt-1">Gerencie suas informações pessoais e segurança da conta.</p>
                </motion.div>

                <div className="space-y-6">

                    {/* CARD 1: Informações Pessoais */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <User className="text-lime-600" size={24} />
                            <h2 className="text-xl font-bold text-slate-800">Perfil Público</h2>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">

                            {/* Área da Foto de Perfil */}
                            <div className="flex flex-col items-center gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="relative group cursor-pointer"
                                >
                                    <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-md overflow-hidden">
                                        <img
                                            src="https://github.com/shadcn.png"
                                            alt="Foto de perfil"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Camera className="text-white drop-shadow-md" size={24} />
                                    </div>
                                </motion.div>
                                <button className="text-sm text-lime-600 font-bold cursor-pointer hover:underline hover:text-lime-700 transition-colors">
                                    Alterar foto
                                </button>
                            </div>

                            {/* Formulário de Dados */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Nome Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <motion.input
                                            whileFocus={{ scale: 1.01, borderColor: "#65a30d" }} // lime-600
                                            type="text"
                                            defaultValue="Everton Lemos"
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-lime-500/10 outline-none transition-all text-slate-700 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <motion.input
                                            whileFocus={{ scale: 1.01, borderColor: "#65a30d" }}
                                            type="email"
                                            defaultValue="contato@preciseichamei.com.br"
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-lime-500/10 outline-none transition-all text-slate-700 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 flex justify-end mt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.03, backgroundColor: "#334155" }} // slate-700
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-slate-200"
                                    >
                                        <Save size={18} />
                                        Salvar Alterações
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* CARD 2: Segurança (Senha) */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <ShieldCheck className="text-lime-600" size={24} />
                            <h2 className="text-xl font-bold text-slate-800">Segurança</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Senha Atual</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <motion.input
                                        whileFocus={{ scale: 1.01, borderColor: "#65a30d" }}
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-lime-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Nova Senha</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <motion.input
                                        whileFocus={{ scale: 1.01, borderColor: "#65a30d" }}
                                        type="password"
                                        placeholder="No mínimo 8 caracteres"
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-lime-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Confirmar Nova Senha</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <motion.input
                                        whileFocus={{ scale: 1.01, borderColor: "#65a30d" }}
                                        type="password"
                                        placeholder="Repita a nova senha"
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-lime-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-3 flex justify-end mt-2">
                                <motion.button
                                    whileHover={{ scale: 1.03, backgroundColor: "#4d7c0f" }} // lime-700
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 bg-lime-500 text-slate-900 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-lime-200"
                                >
                                    <Save size={18} />
                                    Atualizar Senha
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </DashboardContainer>
    )
}