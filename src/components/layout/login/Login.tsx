'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  // 1. Instanciar o hook no topo
  const { fetchLogin } = useAuth(); 
  const { toast } = useToast();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Função de Login ajustada
  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault(); // Previne o recarregamento da página

    if (!email || !password) {
        toast({
            title: "Campos obrigatórios",
            description: "Por favor, preencha e-mail e senha.",
            variant: "destructive"
        });
        return;
    }

    setLoading(true);

    // Chama o método do hook
    const response = await fetchLogin({ email, password });

    setLoading(false);

    // Verifica se houve sucesso (baseado no retorno do seu hook useAuth)
    if (response && response.ok !== false) {
        // O hook já salva o cookie e exibe o toast de sucesso
        router.push('/dashboard');
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50 font-sans">
      <Toaster />
      
      {/* Lado Esquerdo - Formulário */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-12 lg:w-[40%] lg:px-20 xl:px-24">

        {/* Logo */}
        <div className="mb-12 flex items-center gap-2">
          <div className="text-xl font-bold text-slate-700">
            <img src="/precisei-chamei.svg" alt="Logo Precisei Chamei" className="h-10 w-auto" />
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Que bom te ver novamente!
          </h1>
          <p className="mt-2 text-sm text-slate-500">
             Faça login para gerenciar seus serviços.
          </p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-5">
          {/* Input Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-slate-600">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-gray-300 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Input Senha */}
          <div className="space-y-1">
            <label htmlFor="senha" className="text-sm font-medium text-slate-600">
              Senha
            </label>
            <div className="relative">
              <input
                id="senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-gray-300 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-between pt-2">
            <a href="/auth/esqueci" className="text-sm text-slate-600 hover:text-emerald-600 transition-colors">
              Esqueceu a senha?
            </a>
            
            <button
                type="submit" // Mudado para submit para funcionar com ENTER
                disabled={loading}
                className="inline-flex items-center justify-center rounded bg-[#2E8B57] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#257045] disabled:cursor-not-allowed disabled:bg-emerald-400 min-w-[140px]"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Entrando...
                    </>
                ) : (
                    "Acessar conta"
                )}
            </button>
          </div>
        </form>

        {/* Rodapé do Form */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-slate-600">
            Não tem uma conta?{' '}
            <a href="/auth/cadastrar" className="font-medium text-slate-800 hover:underline hover:text-emerald-600">
              Cadastre-se.
            </a>
          </p>
        </div>
      </div>

      {/* Lado Direito - VÍDEO com Overlay */}
      <div className="relative hidden w-[70%] lg:block">

        {/* Camada do Vídeo de Fundo */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover grayscale"
            src="/videos/video.mp4"
          >
            Seu navegador não suporta a tag de vídeo.
          </video>
          <div className="absolute inset-0 bg-green-900/90 mix-blend-multiply"></div>
        </div>

        {/* Overlay Verde */}
        <div className="absolute inset-0 z-10 bg-lime-500/90 mix-blend-multiply"></div>

        {/* Gradiente adicional */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-lime-700/80 to-transparent"></div>

        {/* Texto sobre o vídeo */}
        <div className="relative z-20 flex h-full flex-col justify-end p-16 pb-24 text-white">
          <h2 className="max-w-lg text-4xl font-bold leading-tight drop-shadow-md">
            Divulgue seu negócio de forma fácil, rápida e sem complicação.
          </h2>
        </div>
      </div>

    </div>
  );
}