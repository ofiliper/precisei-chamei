'use client';

import React, { useState, useEffect, Suspense } from 'react'; // Importe Suspense
import { ArrowLeft, Mail, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// 1. Componente interno que usa useSearchParams
function ForgotPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const authHook = useAuth(); // Instanciando o hook aqui dentro

    const emailParam = searchParams.get('e');
    const tokenParam = searchParams.get('t');
    const isResetMode = !!(emailParam && tokenParam);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [emailParam]);

    const handleRecover = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // await authHook.fetchForgotPassword({ email }) 
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSubmitted(true);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Não foi possível enviar o email. Tente novamente.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Senhas não coincidem",
                description: "Por favor, verifique se a confirmação da senha está igual.",
            });
            return;
        }
        if (password.length < 6) {
            toast({
                variant: "destructive",
                title: "Senha muito curta",
                description: "A senha deve ter no mínimo 6 caracteres.",
            });
            return;
        }
        setLoading(true);
        try {
            await authHook.fetchChangePassword({ email, token: tokenParam as string, password });
            // await new Promise(resolve => setTimeout(resolve, 1500)); // Remover se usar a API real acima
            setIsSubmitted(true);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Erro ao redefinir",
                description: "Token inválido ou expirado.",
            });
        } finally {
            setLoading(false);
        }
    };

    // ... (Retorna o JSX do formulário, igual ao seu código anterior)
    return (
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            {/* Logo Centralizada */}
            <div className="mb-8 flex justify-center">
                <img src="/precisei-chamei.svg" alt="Logo Precisei Chamei" className="h-10 w-auto" />
            </div>

            {isSubmitted ? (
                <div className="text-center animate-in fade-in zoom-in duration-300">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-slate-800">
                        {isResetMode ? "Senha alterada!" : "Verifique seu e-mail"}
                    </h2>
                    <p className="mb-8 text-slate-600">
                        {isResetMode
                            ? "Sua senha foi redefinida com sucesso. Agora você pode fazer login com suas novas credenciais."
                            : <>Enviamos um link de recuperação para <span className="font-medium text-slate-800">{email}</span>. Verifique sua caixa de entrada.</>
                        }
                    </p>
                    <button onClick={() => router.push('/auth/login')} className="w-full rounded bg-[#2E8B57] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#257045]">
                        Voltar para o Login
                    </button>
                    {!isResetMode && (
                        <button onClick={() => setIsSubmitted(false)} className="mt-4 text-sm text-slate-500 hover:text-emerald-600">
                            Tentar outro e-mail
                        </button>
                    )}
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isResetMode ? "Criar nova senha" : "Esqueceu a senha?"}
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            {isResetMode
                                ? "Digite e confirme sua nova senha abaixo."
                                : "Não se preocupe! Digite seu e-mail abaixo e enviaremos as instruções."
                            }
                        </p>
                    </div>

                    {isResetMode ? (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600">Nova Senha</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18} /></div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded border border-gray-200 bg-white pl-10 pr-10 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600">Confirmar Senha</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18} /></div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full rounded bg-[#2E8B57] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#257045] disabled:opacity-70 disabled:cursor-not-allowed">
                                {loading ? "Redefinindo..." : "Redefinir Senha"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRecover} className="space-y-6">
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-sm font-medium text-slate-600">E-mail cadastrado</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={18} /></div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="email@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-gray-300 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full rounded bg-[#2E8B57] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#257045] disabled:opacity-70 disabled:cursor-not-allowed">
                                {loading ? "Enviando..." : "Enviar link de recuperação"}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 border-t border-gray-100 pt-6 text-center">
                        <a href="/auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600">
                            <ArrowLeft size={16} />
                            Voltar para o login
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

// 2. Componente Principal (Página) que envolve com Suspense
export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 font-sans">
            <Toaster />
            <Suspense fallback={<div className="text-center p-4">Carregando...</div>}>
                <ForgotPasswordContent />
            </Suspense>
        </div>
    );
}