'use client'

import { Search, MapPin, Frown, ArrowRight } from "lucide-react";
import Header from "@/components/layout/home/Header";
import Footer from "@/components/layout/home/Footer";
import SmartSearch from "@/components/shared/SmartSearch";
import { useEffect } from "react";
import useCategory from "@/hooks/useCategory";
import usePublicServices from "@/hooks/usePublicServices";
import { useStore } from "zustand";
import { publicServiceListStore } from "@/store/services/public-service-list.store";

// Função utilitária para remover HTML da descrição
const stripHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

function App() {
    const hookCategory = useCategory();
    const publicServiceHook = usePublicServices();
    const publicServicesList = useStore(publicServiceListStore);

    useEffect(() => {
        hookCategory.fetchCategories();
        publicServiceHook.fetchServices();
    }, []);

    const { services, fetching } = publicServicesList.data;

    return (
        <main className="min-h-screen font-sans text-slate-600">
            {/*HEADER */}
            <Header />

            {/* HERO SECTION */}
            <section className="pt-16 md:pt-20 pb-40 px-4 text-center bg-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                    Tudo pra facilitar seu dia a dia
                </h1>
                <p className="text-slate-400 text-sm mb-8">
                    O que você precisa está aqui. Peça e receba onde estiver.
                </p>

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto bg-white p-2 rounded-lg shadow-sm flex flex-col md:flex-row gap-2 border border-gray-100">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Pesquisar"
                            className="w-full pl-10 pr-4 py-2 outline-none text-slate-600 placeholder-gray-300 rounded-md"
                        />
                    </div>
                    <div className="w-px bg-gray-200 hidden md:block"></div>
                    <div className="flex-1">
                        <SmartSearch />
                    </div>
                    <button className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] hover:bg-emerald-600 text-white px-8 py-2 rounded-md font-medium transition">
                        Buscar
                    </button>
                </div>
            </section>

            {/* RECENT SERVICES LIST */}
            <section className="py-8 container mx-auto px-4 max-w-4xl -mt-[140px]">
                <h3 className="text-center text-slate-500 text-sm font-medium mb-8 uppercase tracking-wide">Serviços recentes</h3>

                <div className="flex flex-col gap-4 bg-white py-7 px-7 rounded-xl -mt-5 shadow-sm border border-gray-100/50 min-h-[200px]">

                    {/* LÓGICA DE EXIBIÇÃO */}
                    {fetching ? (
                        /* LOADING SKELETON */
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : services.length > 0 ? (
                        /* LISTA DE SERVIÇOS COM DADOS REAIS E IMAGENS ESTÁTICAS */
                        services.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                // Alterna as cores (par: laranja, ímpar: azul) para manter o layout anterior
                                imageColor={index % 2 === 0 ? "bg-orange-100" : "bg-blue-100"}
                            />
                        ))
                    ) : (
                        /* EMPTY STATE */
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="bg-gray-50 p-4 rounded-full mb-3">
                                <Frown className="w-10 h-10 text-gray-300" />
                            </div>
                            <h4 className="text-slate-700 font-semibold">Não há serviços disponíveis</h4>
                            <p className="text-slate-400 text-xs mt-1">Tente buscar por outra categoria ou volte mais tarde.</p>
                        </div>
                    )}
                </div>

                {/* Botão Ver Mais */}
                {!fetching && services.length > 0 && (
                    <div className="text-center mt-8">
                        <button className="text-emerald-600 text-sm font-medium border border-gray-200 bg-white px-6 py-2 rounded-full hover:bg-emerald-50 transition">
                            Ver mais serviços
                        </button>
                    </div>
                )}
            </section>

            {/* SECTIONS INFERIORES (How It Works / Advertise) - Mantidas Originais */}
            <section className="py-16 container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Como funciona?</h2>
                    <p className="text-slate-400 text-xs">O que você precisa está aqui. Peça e receba onde estiver.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                    {/* Card Prestador */}
                    <div className="rounded-2xl p-8 flex flex-col md:flex-row items-center relative overflow-hidden group bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="bg-emerald-200 rounded-full mb-6 flex items-center justify-center w-32 h-32 flex-shrink-0">
                            <img src="service.png" className="w-full" alt="Prestador" />
                        </div>
                        <div className="text-center md:text-left md:ml-6">
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Para o prestador de serviços</h3>
                            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto md:mx-0">O que você precisa está aqui. Peça e receba onde estiver.</p>
                            <button className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] text-white px-6 py-2 rounded-md text-sm font-medium hover:opacity-90 transition">Saiba mais</button>
                        </div>
                    </div>
                    {/* Card Cliente */}
                    <div className="rounded-2xl p-8 flex flex-col md:flex-row items-center relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="rounded-full mb-6 flex items-center justify-center w-32 h-32 flex-shrink-0">
                            <img src="user.png" className="w-full" alt="Cliente" />
                        </div>
                        <div className="text-center md:text-left md:ml-6">
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Para o cliente</h3>
                            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto md:mx-0">O que você precisa está aqui. Peça e receba onde estiver.</p>
                            <button className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] text-white px-6 py-2 rounded-md text-sm font-medium hover:opacity-90 transition">Saiba mais</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 container mx-auto px-4 max-w-5xl">
                <div className="relative rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-sm bg-white border border-gray-100">
                    <div className="md:w-4/12 mb-8 md:mb-0 z-10 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mb-4 leading-tight">Quer anunciar<br /> um serviço <br /> também?</h2>
                        <p className="text-slate-500 text-sm mb-6">O que você precisa está aqui.<br /> Peça e receba onde estiver.</p>
                        <button className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] text-white px-8 py-2.5 rounded-md font-medium hover:opacity-90 transition">Saiba mais</button>
                    </div>
                    <div className="md:w-8/12 flex justify-center z-10">
                        <img src="img-services.png" className="w-full" alt="Banner" />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

// --- Componentes Auxiliares ---

// 1. Card de Serviço (Dados Reais + Imagem Estática Anterior)
function ServiceCard({ service, imageColor }: { service: any, imageColor: string }) {
    // Extração dos dados
    const description = stripHtml(service.content?.content || "Sem descrição disponível.");
    const categoryName = service.Category?.name || "Geral";
    const neighborhood = service.Address?.neighborhood;
    const city = service.Address?.city;
    // Monta o texto de localização
    const locationText = neighborhood && city ? `${neighborhood} - ${city}` : (neighborhood || city || "Localização não informada");
    // Mock de distância (substitua se tiver geolocalização real)
    const distanceMock = "Aprox. 5km";

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 transition hover:shadow-md hover:border-emerald-500/20 cursor-pointer group">
            {/* Imagem do Card (ESTÁTICA, mantendo layout anterior) */}
            <div className={`w-full md:w-48 h-40 ${imageColor} rounded-lg flex-shrink-0 relative overflow-hidden`}>
                {/* Placeholder image idêntico ao original */}
                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-gray-200/50">
                    IMG
                </div>
            </div>

            {/* Conteúdo (DADOS REAIS) */}
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="inline-block bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded mb-2 uppercase tracking-wide group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            {categoryName}
                        </span>
                        <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">
                            {service.name}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2 md:w-[90%]">
                            {description}
                        </p>
                    </div>
                    <button className="hidden md:block bg-gradient-to-r from-[#2080B3] to-[#40A56A] text-white text-xs font-semibold px-4 py-2 rounded hover:opacity-90 transition w-[120px]">
                        Ver mais
                    </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 mt-auto">
                    <div className="flex items-center gap-1">
                        <MapPin size={14} className="group-hover:text-[#40A56A] transition-colors" />
                        <span>{distanceMock}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin size={14} className="group-hover:text-[#40A56A] transition-colors" />
                        <span className="capitalize line-clamp-1">{locationText}</span>
                    </div>
                </div>

                {/* Mobile Button only */}
                <button className="md:hidden mt-4 w-full bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded hover:bg-emerald-600 transition">
                    Ver mais
                </button>
            </div>
        </div>
    )
}

// 2. Skeleton Loading (Layout idêntico ao Card)
function SkeletonCard() {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 animate-pulse">
            {/* Imagem Skeleton */}
            <div className="w-full md:w-48 h-40 bg-gray-200 rounded-lg flex-shrink-0"></div>

            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-start justify-between">
                    <div className="w-full">
                        <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-2/3 bg-gray-200 rounded mb-4"></div>
                    </div>
                    <div className="hidden md:block h-8 w-[120px] bg-gray-200 rounded"></div>
                </div>

                <div className="flex items-center gap-4 mt-auto">
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>

                <div className="md:hidden mt-4 h-8 w-full bg-gray-200 rounded"></div>
            </div>
        </div>
    )
}

export default App;