'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import useAuth from '@/hooks/useAuth'; 
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
  const { fetchSignup } = useAuth();
  
  // Estados de UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 
  const [loading, setLoading] = useState(false);

  // Dados do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const router = useRouter();
  const { toast } = useToast();

  // --- MÁSCARA DE TELEFONE ---
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // 1. Remove tudo que não é número
    value = value.replace(/\D/g, ""); 
    
    // 2. Limita a 11 dígitos (DDD + 9 dígitos)
    if (value.length > 11) value = value.slice(0, 11);

    // 3. Aplica a formatação (XX) XXXXX-XXXX
    value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    
    setPhone(value);
  };

  const handleRegister = async () => {
    // Validações
    if (!name || !email || !password || !phone) {
        toast({ title: "Campos obrigatórios", description: "Preencha todos os campos.", variant: "destructive" });
        return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Senhas diferentes", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }

    if (phone.length < 15) { // (XX) XXXXX-XXXX tem 15 caracteres
        toast({ title: "Telefone inválido", description: "Digite um número válido com DDD.", variant: "destructive" });
        return;
    }

    setLoading(true);

    try {
        const response = await fetchSignup({ name, email, phone, password });

        // LÓGICA CORRIGIDA:
        // O seu hook useAuth retorna { ok: false, ... } quando dá erro.
        // Se a resposta existir e a propriedade 'ok' for estritamente false, houve erro.
        if (response && response.ok === false) {
            setLoading(false);
            return; // O toast de erro já foi disparado pelo hook, apenas paramos aqui.
        }

        // Se passou do check acima, o cadastro foi aceito pela API.
        setLoading(false);
        setIsSuccess(true); // Troca a tela para sucesso

    } catch (error) {
        console.error(error);
        setLoading(false);
        // Fallback caso algo inesperado aconteça fora do hook
        toast({ title: "Erro", description: "Ocorreu um erro inesperado.", variant: "destructive" });
    }
  }

  // Variantes de Animação
  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50 font-sans">
      <Toaster />
      
      {/* Lado Esquerdo - Conteúdo */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-12 lg:w-[40%] lg:px-20 xl:px-24 py-10 relative overflow-hidden">

        {/* Logo Fixa */}
        <div className="absolute top-10 left-8 sm:left-12 lg:left-20 xl:left-24 mb-8">
            <img src="/precisei-chamei.svg" alt="Logo Precisei Chamei" className="h-10 w-auto" />
        </div>
        
        <div className="mt-16 w-full">
            <AnimatePresence mode="wait">
                {!isSuccess ? (
                    // --- TELA 1: FORMULÁRIO ---
                    <motion.div
                        key="form"
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-800">Crie sua conta</h1>
                            <p className="mt-2 text-sm text-slate-500">Preencha seus dados para começar.</p>
                        </div>

                        <form className="w-full space-y-4">
                            {/* Nome */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600">Nome Completo</label>
                                <input type="text" placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600">E-mail</label>
                                <input type="email" placeholder="email@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                            </div>

                            {/* Telefone com MÁSCARA */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600">WhatsApp</label>
                                <input 
                                    type="text" 
                                    placeholder="(00) 00000-0000" 
                                    value={phone} 
                                    onChange={handlePhoneChange} // Chama a função da máscara
                                    maxLength={15}
                                    className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                                />
                            </div>

                            {/* Senha */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600">Senha</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} placeholder="**********" value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar Senha */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600">Confirmar Senha</label>
                                <div className="relative">
                                    <input type={showConfirmPassword ? 'text' : 'password'} placeholder="**********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button onClick={handleRegister} type="button" disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 rounded bg-[#2E8B57] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#257045] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-200">
                                    {loading ? <><Loader2 className="animate-spin" size={20} /> Criando conta...</> : "Cadastrar"}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                            <p className="text-sm text-slate-600">
                                Já possui uma conta? <a href="/auth/login" className="font-medium text-slate-800 hover:underline hover:text-emerald-600">Faça login.</a>
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    // --- TELA 2: SUCESSO ---
                    <motion.div
                        key="success"
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center justify-center text-center h-full py-10"
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-sm"
                        >
                            <Mail className="text-emerald-600 w-10 h-10" />
                        </motion.div>

                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Cadastro Realizado!</h2>
                        
                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm w-full max-w-sm mb-6">
                            <p className="text-slate-500 text-sm mb-2">Enviamos um email de confirmação para:</p>
                            <p className="text-slate-800 font-semibold text-lg break-all">{email}</p>
                        </div>

                        <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-xs">
                            Para sua segurança, clique no link que enviamos para ativar sua conta antes de fazer login.
                        </p>

                        <button 
                            onClick={() => router.push('/auth/login')}
                            className="w-full max-w-sm flex items-center justify-center gap-2 rounded bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-900 group shadow-lg shadow-slate-200"
                        >
                            Ir para o Login
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <p className="mt-8 text-xs text-slate-400">
                            Não recebeu? Verifique sua caixa de Spam.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* Lado Direito - VÍDEO (Mantido) */}
      <div className="relative hidden w-[70%] lg:block">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover grayscale" src="/videos/video.mp4">
            Seu navegador não suporta a tag de vídeo.
          </video>
          <div className="absolute inset-0 bg-green-900/90 mix-blend-multiply"></div>
        </div>
        <div className="absolute inset-0 z-10 bg-lime-500/90 mix-blend-multiply"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-lime-700/80 to-transparent"></div>
        <div className="relative z-20 flex h-full flex-col justify-end p-16 pb-24 text-white">
          <h2 className="max-w-lg text-4xl font-bold leading-tight drop-shadow-md">
            Junte-se à plataforma que conecta quem precisa a quem resolve.
          </h2>
        </div>
      </div>

    </div>
  );
}