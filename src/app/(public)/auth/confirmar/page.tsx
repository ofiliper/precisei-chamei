'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react'; // 1. Importe useRef
import { useSearchParams, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Cookies } from 'react-cookie';

function ConfirmContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { verificationAcc } = useAuth();
    const cookies = new Cookies();

    // Estados
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Estamos validando seus dados...');
    const [countdown, setCountdown] = useState(5);

    // 2. Trava para garantir execução única
    const hasFetched = useRef(false);

    useEffect(() => {
        const email = searchParams.get('e');
        const token = searchParams.get('t');

        if (!email || !token) {
            router.push('/auth/login');
            return;
        }

        // 3. Se já executou, para aqui imediatamente
        if (hasFetched.current) return;
        hasFetched.current = true;

        let isMounted = true;

        const verifyAccount = async () => {
            try {
                const response = await verificationAcc({ email, token });

                if (!isMounted) return;

                // Verifica se a resposta foi bem sucedida
                if (response && (response.ok === true || response.status === 200)) {
                    
                    if (response.data) {
                        cookies.set('userid', response.data.data.token, { path: '/' });
                        if (response.data.data.workspace?.id) {
                            cookies.set('workspace', response.data.data.workspace.id, { path: '/' });
                        }
                    }

                    setStatus('success');
                    
                } else {
                    // Opcional: Se o backend retornar erro específico de "já confirmado", 
                    // você pode tratar como sucesso aqui também.
                    setStatus('error');
                    setMessage(response?.message || 'Link inválido ou expirado.');
                }
            } catch (error) {
                if (!isMounted) return;
                setStatus('error');
                setMessage('Erro ao conectar com o servidor.');
            }
        };

        verifyAccount();

        return () => { isMounted = false; };
        
    // Removi verificationAcc das dependências para evitar loop se a função não for memoizada
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, router]); 

    // ... (restante do código: useEffect do timer e o return visual permanecem iguais)
    
    // Lógica do Timer de Redirecionamento
    useEffect(() => {
        if (status === 'success') {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                router.push('/dashboard');
            }
        }
    }, [status, countdown, router]);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 w-full max-w-md text-center relative overflow-hidden"
        >
            <div className={`absolute top-0 left-0 w-full h-2 ${
                status === 'loading' ? 'bg-gray-200' :
                status === 'success' ? 'bg-[#2E8B57]' : 'bg-red-500'
            }`} />

            {status === 'loading' && (
                <div className="flex flex-col items-center py-8">
                    <Loader2 className="w-16 h-16 text-[#2E8B57] animate-spin mb-6" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Validando...</h2>
                    <p className="text-slate-500">Aguarde enquanto confirmamos sua conta.</p>
                </div>
            )}

            {status === 'success' && (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center py-4"
                >
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-[#2E8B57]">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Conta Confirmada!</h2>
                    <p className="text-slate-500 mb-6">
                        Login realizado com sucesso. <br/>
                        Bem-vindo ao <strong>Precisei Chamei</strong>.
                    </p>
                    
                    <div className="bg-gray-50 rounded-xl py-3 px-6 mb-6 border border-gray-100">
                        <span className="text-sm text-gray-400">Redirecionando em</span>
                        <div className="text-3xl font-bold text-[#2E8B57]">{countdown}s</div>
                    </div>

                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-[#2E8B57] hover:bg-[#257045] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
                    >
                        Acessar agora
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            )}

            {status === 'error' && (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center py-4"
                >
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
                        <XCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Falha na Verificação</h2>
                    <p className="text-slate-500 mb-8 max-w-xs">
                        {message}
                    </p>

                    <div className="flex flex-col gap-3 w-full">
                        <button 
                            onClick={() => window.location.reload()} 
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all"
                        >
                            Tentar Novamente
                        </button>
                        <button 
                            onClick={() => router.push('/auth/login')}
                            className="text-sm text-gray-400 hover:text-gray-600 mt-2"
                        >
                            Voltar para o Login
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

// O restante do arquivo (ConfirmAccountPage) permanece igual
export default function ConfirmAccountPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans relative">
            <div className="absolute top-10 flex justify-center w-full">
                 <img src="/precisei-chamei.svg" alt="Precisei Chamei" className="h-12 w-auto opacity-90" />
            </div>

            <Suspense fallback={
                <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin text-[#2E8B57] mb-2" />
                    <span className="text-slate-500 text-sm">Carregando...</span>
                </div>
            }>
                <ConfirmContent />
            </Suspense>
        </div>
    );
}