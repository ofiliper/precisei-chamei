'use client';

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle2, KeyRound } from "lucide-react";
import useAuth from "@/hooks/useAuth"; // Ajuste o caminho se necessário
import { toast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
    const { fetchForgot } = useAuth();

    // Estados
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast({
                title: "Campo obrigatório",
                description: "Por favor, digite seu e-mail.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        // Chama a função do seu hook useAuth
        const response = await fetchForgot({ email });

        setIsLoading(false);

        if (response && response.ok) {
            setIsSuccess(true);
        }
        // O tratamento de erro (toast) já é feito dentro do seu useAuth, 
        // mas se a resposta vier com ok:false, o form permanece para tentativa
    };

    // Variantes de animação
    const fadeVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f4f7] p-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo ou Brand (Opcional) */}
                <div className="text-center mb-8">
                    <img src="/precisei-chamei.svg" className="w-[90px] mx-auto" />
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden relative min-h-[400px]">
                    <div className="p-8 h-full flex flex-col justify-center">

                        <AnimatePresence mode="wait">
                            {!isSuccess ? (
                                // --- ESTADO 1: FORMULÁRIO ---
                                <motion.div
                                    key="form"
                                    variants={fadeVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 mx-auto text-[#319795]">
                                        <KeyRound size={24} />
                                    </div>

                                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                                        Esqueceu a senha?
                                    </h2>
                                    <p className="text-center text-gray-500 mb-8 text-sm">
                                        Não se preocupe, vamos te ajudar. Digite seu e-mail abaixo para receber as instruções.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-gray-700 ml-1">
                                                E-mail cadastrado
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <Mail size={18} />
                                                </div>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    placeholder="exemplo@preciseichamei.com.br"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#319795]/20 focus:border-[#319795] transition-all text-gray-700 placeholder:text-gray-400"
                                                    autoComplete="email"
                                                />
                                            </div>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={isLoading}
                                            type="submit"
                                            className="w-full bg-[#319795] hover:bg-[#287e7c] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20} />
                                                    Enviando...
                                                </>
                                            ) : (
                                                "Enviar link de recuperação"
                                            )}
                                        </motion.button>
                                    </form>
                                </motion.div>

                            ) : (
                                // --- ESTADO 2: SUCESSO ---
                                <motion.div
                                    key="success"
                                    variants={fadeVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="text-center py-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                        className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 mx-auto text-green-500"
                                    >
                                        <CheckCircle2 size={40} />
                                    </motion.div>

                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                        Verifique seu e-mail
                                    </h2>

                                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                                        Enviamos um link de recuperação para <br />
                                        <span className="font-semibold text-gray-800">{email}</span>.
                                        <br /><br />
                                        Clique no link para criar uma nova senha.
                                    </p>

                                    <div className="p-4 bg-gray-50 rounded-xl mb-6 text-xs text-gray-400">
                                        Não recebeu? Verifique sua caixa de spam ou tente novamente em alguns minutos.
                                    </div>

                                    {/* Botão opcional para reenviar, se sua API suportar, ou apenas voltar */}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Rodapé do Card (Link de Voltar) */}
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#319795] transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Voltar para o Login
                            </Link>
                        </div>

                    </div>

                    {/* Barra decorativa no topo */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#319795] to-[#40A56A]" />
                </div>

                {/* Copyright Footer */}
                <p className="text-center text-gray-400 text-xs mt-8">
                    &copy; {new Date().getFullYear()} Precisei Chamei. Todos os direitos reservados.
                </p>
            </motion.div>
        </div>
    );
}