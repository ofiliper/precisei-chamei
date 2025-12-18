'use client';

import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // Estado para controlar a tela de sucesso
    const router = useRouter();

    const handleRecover = (e: React.FormEvent) => {
        e.preventDefault();
        // setLoading(true);

        // // Simulando chamada à API de recuperação
        // // Substitua por useAuth().fetchForgotPassword({ email })
        // useAuth().fetchForgotPassword({ email })
        //     .then(() => {
        //         setIsSubmitted(true);
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //         // Aqui você pode adicionar um toast de erro se quiser
        //     })
        //     .finally(() => setLoading(false));
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 font-sans">
            <Toaster />

            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100">

                {/* Logo Centralizada */}
                <div className="mb-8 flex justify-center">
                    <img src="/precisei-chamei.svg" alt="Logo Precisei Chamei" className="h-10 w-auto" />
                </div>

                {isSubmitted ? (
                    /* TELA DE SUCESSO (Pós-envio) */
                    <div className="text-center animate-in fade-in zoom-in duration-300">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                            <CheckCircle className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-slate-800">Verifique seu e-mail</h2>
                        <p className="mb-8 text-slate-600">
                            Enviamos um link de recuperação para <span className="font-medium text-slate-800">{email}</span>.
                            Verifique sua caixa de entrada (e spam).
                        </p>

                        <button
                            onClick={() => router.push('/auth/login')}
                            className="w-full rounded bg-[#2E8B57] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#257045]"
                        >
                            Voltar para o Login
                        </button>

                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="mt-4 text-sm text-slate-500 hover:text-emerald-600"
                        >
                            Tentar outro e-mail
                        </button>
                    </div>
                ) : (
                    /* FORMULÁRIO DE RECUPERAÇÃO */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold text-slate-800">Esqueceu a senha?</h1>
                            <p className="mt-2 text-sm text-slate-600">
                                Não se preocupe! Digite seu e-mail abaixo e enviaremos as instruções para redefinir sua senha.
                            </p>
                        </div>

                        <form onSubmit={handleRecover} className="space-y-6">
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-sm font-medium text-slate-600">
                                    E-mail cadastrado
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Mail size={18} />
                                    </div>
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

                            {loading ? (
                                <button
                                    type="button"
                                    disabled
                                    className="flex w-full items-center justify-center rounded bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                                >
                                    Enviando instruções...
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full rounded bg-[#2E8B57] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#257045]"
                                >
                                    Enviar link de recuperação
                                </button>
                            )}
                        </form>

                        <div className="mt-8 border-t border-gray-100 pt-6 text-center">
                            <a
                                href="/auth/login"
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
                            >
                                <ArrowLeft size={16} />
                                Voltar para o login
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}