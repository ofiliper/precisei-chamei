'use client'

import Link from "next/link";
import { ArrowLeft, FileText, ShieldCheck, AlertCircle, HelpCircle } from "lucide-react";
import Header from "@/components/layout/home/Header";
import Footer from "@/components/layout/home/Footer";

export default function TermosDeUso() {
    return (
        <main className="min-h-screen font-sans text-slate-600 bg-gray-50">
            {/* HEADER */}
            <Header />

            {/* HERO SECTION COMPACTA */}
            <section className="pt-24 pb-20 px-4 text-center bg-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="bg-emerald-100 text-emerald-700 p-2 rounded-full">
                        <FileText size={24} />
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                    Termos de Uso
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

                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                1. Introdução
                            </h2>
                            <p className="mb-4">
                                Bem-vindo à nossa plataforma. Ao acessar ou usar nossos serviços, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, você não deve usar nossos serviços.
                            </p>
                            <p>
                                Nossa plataforma conecta clientes que buscam serviços específicos ("Clientes") a profissionais qualificados ("Prestadores"). Nós atuamos como intermediários para facilitar essa conexão.
                            </p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                2. Contas de Usuário
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                <li>Você deve ter pelo menos 18 anos de idade para usar este serviço.</li>
                                <li>Você é responsável por manter a confidencialidade da sua conta e senha.</li>
                                <li>Todas as informações fornecidas no cadastro devem ser precisas e atualizadas.</li>
                                <li>A plataforma se reserva o direito de suspender ou encerrar contas que violem nossas políticas.</li>
                            </ul>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                3. Responsabilidades
                            </h2>
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-4">
                                <div className="flex gap-3">
                                    <AlertCircle className="text-blue-500 flex-shrink-0" size={20} />
                                    <div>
                                        <h4 className="font-bold text-blue-700 text-sm mb-1">Nota Importante</h4>
                                        <p className="text-blue-600 text-sm">
                                            A plataforma não realiza os serviços. Nós fornecemos a tecnologia para conectar as partes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="mb-2"><strong>Para Clientes:</strong> Você concorda em tratar os prestadores com respeito, fornecer um ambiente seguro (se o serviço for domiciliar) e realizar os pagamentos conforme acordado.</p>
                            <p><strong>Para Prestadores:</strong> Você garante que possui todas as licenças, certificações e habilidades necessárias para realizar os serviços oferecidos.</p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                4. Pagamentos e Taxas
                            </h2>
                            <p className="mb-4">
                                Os pagamentos pelos serviços podem ser processados através da nossa plataforma ou diretamente ao prestador, dependendo da configuração do serviço. A plataforma pode cobrar uma taxa de serviço ou comissão pelo uso da tecnologia, a qual será claramente apresentada antes da confirmação do pedido.
                            </p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                5. Privacidade e Dados
                            </h2>
                            <p className="mb-4">
                                Sua privacidade é importante para nós. O uso de seus dados pessoais é regido pela nossa <Link href="/privacidade" className="text-emerald-600 hover:underline">Política de Privacidade</Link>. Ao usar o serviço, você consente com a coleta e uso de informações conforme descrito na política.
                            </p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                6. Cancelamento e Reembolso
                            </h2>
                            <p className="mb-4">
                                As políticas de cancelamento são definidas por cada prestador ou, em casos padronizados, pela plataforma. Cancelamentos de última hora podem estar sujeitos a taxas. Reembolsos são avaliados caso a caso pela nossa equipe de suporte.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                7. Contato
                            </h2>
                            <p className="mb-4">
                                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através do nosso canal de suporte.
                            </p>
                            <div className="flex items-center gap-3 mt-6">
                                <button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-200 transition flex items-center gap-2">
                                    <HelpCircle size={18} />
                                    Central de Ajuda
                                </button>
                                <button className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
                                    Fale Conosco
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Link Rápido */}
                <div className="text-center mt-8 text-sm text-slate-400">
                    <p>Ao continuar usando a plataforma, você concorda com estes termos.</p>
                </div>
            </section>

            <Footer />
        </main>
    );
}