'use client';

import React, { useEffect, useState } from 'react';
import DashboardContainer from "@/components/shared/Dashboard/Dashboard";
import { Save, Lock, User, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import useUsers from '@/hooks/useUser';
import { userStore } from '@/store/users/user-store';
import { useToast } from '@/hooks/use-toast';
import { useStore } from 'zustand';

export default function MeusDados() {
    const { toast } = useToast();

    // Hooks de API
    const { fetchUser, fetchUpdateUser } = useUsers();

    // Dados da Store Global
    // Acessando o estado global diretamente
    const storedName = useStore(userStore);
    
    // Destruturando para facilitar o uso, mas mantendo a referência 'storedName' para o onChange conforme pedido
    const { name, email } = storedName.data;

    // Estados Locais (apenas para senhas e loading, pois não são globais)
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    // 1. Carregar dados ao montar a tela
    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handler: Salvar Perfil
    const handleSaveProfile = async () => {
        // Usa o valor direto da store ('name')
        if (!name?.trim()) return;

        setLoadingProfile(true);
        // Envia o nome que está na store para a API
        await fetchUpdateUser({ name });
        setLoadingProfile(false);
    };

    // Handler: Salvar Senha
    const handleSavePassword = async () => {
        const { new: newPass, confirm } = passwordData;

        if (!newPass || !confirm) {
            toast({ title: "Atenção", description: "Preencha os campos de senha.", variant: "destructive" });
            return;
        }
        if (newPass.length < 8) {
            toast({ title: "Senha curta", description: "A senha deve ter no mínimo 8 caracteres.", variant: "destructive" });
            return;
        }
        if (newPass !== confirm) {
            toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
            return;
        }

        setLoadingPassword(true);
        const response = await fetchUpdateUser({ password: newPass });

        // Limpa campos se sucesso
        if (response?.data?.ok) {
            setPasswordData({ current: '', new: '', confirm: '' });
        }
        setLoadingPassword(false);
    };

    // Variantes de animação
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

    return (
        <DashboardContainer>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto pb-10">

                <motion.div variants={itemVariants} className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Meus Dados</h1>
                    <p className="text-gray-500 mt-1">Gerencie suas informações.</p>
                </motion.div>

                <div className="space-y-6">
                    {/* CARD 1: Perfil */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <User className="text-lime-600" size={24} />
                            <h2 className="text-xl font-bold text-slate-800">Perfil Público</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        // Valor vindo direto da Store
                                        value={name || ''} 
                                        // Atualiza direto na Store
                                        onChange={(e) => storedName.fnOnChange('name', e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-lime-500/10 outline-none transition-all text-slate-700 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={email || ''}
                                        disabled
                                        className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none text-slate-500 font-medium cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 flex justify-end mt-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSaveProfile}
                                    disabled={loadingProfile}
                                    className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200 disabled:opacity-70"
                                >
                                    {loadingProfile ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {loadingProfile ? 'Salvando...' : 'Salvar Alterações'}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* CARD 2: Segurança */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <ShieldCheck className="text-lime-600" size={24} />
                            <h2 className="text-xl font-bold text-slate-800">Segurança</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Nova Senha</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Mínimo 8 caracteres"
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-lime-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Confirmar Senha</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Repita a senha"
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-lime-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Botão de senha */}
                            <div className="flex items-end justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSavePassword}
                                    disabled={loadingPassword}
                                    className="flex items-center justify-center gap-2 bg-lime-500 text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-lime-600 transition-colors shadow-lg shadow-lime-200 disabled:opacity-70 w-full"
                                >
                                    {loadingPassword ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {loadingPassword ? 'Atualizando...' : 'Atualizar Senha'}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </DashboardContainer>
    )
}