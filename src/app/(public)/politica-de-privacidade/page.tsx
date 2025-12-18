'use client'

import Link from "next/link";
import { ArrowLeft, Lock, Eye, Shield, Cookie, Database, Mail } from "lucide-react";
import Header from "@/components/layout/home/Header";
import Footer from "@/components/layout/home/Footer";

export default function PoliticaDePrivacidade() {
    return (
        <main className="min-h-screen font-sans text-slate-600 bg-gray-50">
            {/* HEADER */}
            <Header />

            {/* HERO SECTION COMPACTA */}
            <section className="pt-24 pb-20 px-4 text-center bg-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="bg-emerald-100 text-emerald-700 p-2 rounded-full">
                        <Lock size={24} />
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                    Política de Privacidade
                </h1>
                <p className="text-slate-400 text-sm">
                    Última atualização: 17 de Dezembro de 2025
                </p>
            </section>

            {/* CONTEÚDO DO DOCUMENTO */}
            <section className="container mx-auto px-4 max-w-4xl -mt-10 mb-20 relative z-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">

                    {/* Botão Voltar */}
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                            <ArrowLeft size={16} />
                            Voltar para o início
                        </Link>
                    </div>

                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">

                        <div className="mb-10">
                            <p className="text-lg text-slate-500 mb-6">
                                Sua privacidade é fundamental para nós. Esta política descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais ao utilizar nossa plataforma.
                            </p>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Database className="text-emerald-500" size={20} />
                                1. Coleta de Informações
                            </h2>
                            <p className="mb-4">
                                Coletamos informações que você nos fornece diretamente, como:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <li><strong>Dados de Cadastro:</strong> Nome, e-mail, telefone, CPF/CNPJ e senha.</li>
                                <li><strong>Dados de Serviço:</strong> Endereço para a realização do serviço e detalhes do pedido.</li>
                                <li><strong>Dados Financeiros:</strong> Informações de pagamento para processar transações (processados de forma segura por terceiros).</li>
                            </ul>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Eye className="text-emerald-500" size={20} />
                                2. Uso das Informações
                            </h2>
                            <p className="mb-4">Utilizamos seus dados para as seguintes finalidades:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                <li>Conectar clientes a prestadores de serviços próximos.</li>
                                <li>Processar pagamentos e emitir recibos.</li>
                                <li>Melhorar a funcionalidade e segurança da plataforma.</li>
                                <li>Enviar comunicações importantes sobre seus pedidos ou atualizações de serviço.</li>
                            </ul>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Shield className="text-emerald-500" size={20} />
                                3. Compartilhamento e Segurança
                            </h2>
                            <p className="mb-4">
                                Não vendemos suas informações pessoais. Compartilhamos dados apenas quando estritamente necessário para a prestação do serviço (ex: compartilhar o endereço do cliente com o prestador contratado).
                            </p>
                            <p className="mb-4">
                                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração ou destruição.
                            </p>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Cookie className="text-emerald-500" size={20} />
                                4. Cookies e Tecnologias
                            </h2>
                            <p className="mb-4">
                                Utilizamos cookies para melhorar sua experiência de navegação, lembrar suas preferências e analisar o tráfego do site. Você pode gerenciar as preferências de cookies nas configurações do seu navegador.
                            </p>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                5. Seus Direitos (LGPD)
                            </h2>
                            <p className="mb-4">
                                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
                            </p>
                            <ul className="grid md:grid-cols-2 gap-4 mt-4">
                                <li className="bg-white border border-gray-200 p-4 rounded-lg text-sm">Acessar seus dados armazenados.</li>
                                <li className="bg-white border border-gray-200 p-4 rounded-lg text-sm">Corrigir dados incompletos ou inexatos.</li>
                                <li className="bg-white border border-gray-200 p-4 rounded-lg text-sm">Solicitar a exclusão de seus dados.</li>
                                <li className="bg-white border border-gray-200 p-4 rounded-lg text-sm">Revogar consentimento a qualquer momento.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                6. Encarregado de Dados (DPO)
                            </h2>
                            <p className="mb-6">
                                Para exercer seus direitos ou tirar dúvidas sobre como tratamos seus dados, entre em contato com nosso Encarregado de Proteção de Dados.
                            </p>

                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-3 rounded-full shadow-sm text-emerald-600">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">Canal de Privacidade</p>
                                        <p className="text-sm text-slate-500">contato@preciseichamei.com.br</p>
                                    </div>
                                </div>
                                <button className="w-full md:w-auto bg-white border border-gray-200 text-slate-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm">
                                    Entrar em contato
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="text-center mt-8 text-sm text-slate-400">
                    <p>© 2025 Precisei Chamei. Todos os direitos reservados.</p>
                </div>
            </section>

            <Footer />
        </main>
    );
}