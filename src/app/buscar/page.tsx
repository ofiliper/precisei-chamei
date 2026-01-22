'use client'

import { MapPin, Frown, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/home/Header";
import Footer from "@/components/layout/home/Footer";
import SmartSearch from "@/components/shared/SmartSearch";
import { useEffect, Suspense } from "react"; // Adicionado Suspense
import { useSearchParams, useRouter } from "next/navigation";
import useCategory from "@/hooks/useCategory";
import usePublicServices from "@/hooks/usePublicServices";
import { useStore } from "zustand";
import { publicServiceListStore } from "@/store/services/public-service-list.store";

const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

// 1. O componente lógico agora se chama SearchContent
function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hookCategory = useCategory();
    const publicServiceHook = usePublicServices();
    const publicServicesList = useStore(publicServiceListStore);

    const category = searchParams.get('category') || "";
    const subcategory = searchParams.get('subcategory') || "";
    const queryPageSize = Number(searchParams.get('page_size')) || 20;
    const currentPage = Number(searchParams.get('current_page')) || 1;

    const { services = [], fetching = false, meta = { page: 1, total_pages: 0 } } = publicServicesList.data;

    useEffect(() => {
        hookCategory.fetchCategories();
        publicServiceHook.fetchServices({
            id_category: category,
            id_subcategory: subcategory,
            page_size: queryPageSize,
            current_page: currentPage
        });
        // Scroll para o topo ao trocar de página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [category, subcategory, queryPageSize, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > meta.total_pages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('current_page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    // Lógica para gerar os números das páginas (mostra até 5 páginas ao redor da atual)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, meta.page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(meta.total_pages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <main className="min-h-screen font-sans text-slate-600 bg-gray-50">
            <Header />

            <section className="pt-16 md:pt-20 pb-40 px-6 text-center bg-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                    Tudo pra facilitar seu dia a dia
                </h1>
                <p className="text-slate-400 text-sm mb-8">
                    O que você precisa está aqui. Peça e receba onde estiver.
                </p>
                <div className="max-w-3xl mx-auto bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <SmartSearch />
                </div>
            </section>

            {/* Grid com espaçamento lateral controlado via container e px-6 */}
            <section className="py-8 container mx-auto px-6 max-w-7xl -mt-[140px]">
                <h3 className="text-center text-slate-500 text-sm font-medium mb-8 uppercase tracking-wide">
                    {
                        services.length > 0
                            ? (
                                <>Serviços disponíveis</>
                            )
                            : (
                                <>Nada encontrado</>
                            )
                    }
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px]">
                    {fetching ? (
                        Array.from({ length: queryPageSize }).map((_, i) => <SkeletonCard key={i} />)
                    ) : services.length > 0 ? (
                        services.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                imageColor={index % 2 === 0 ? "bg-orange-100" : "bg-blue-100"}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                            <Frown className="w-12 h-12 text-gray-300 mb-4" />
                            <h4 className="text-slate-700 font-semibold">Nenhum serviço encontrado</h4>
                        </div>
                    )}
                </div>

                {/* PAGINAÇÃO NUMÉRICA */}
                {!fetching && meta.total_pages > 1 && (
                    <div className="flex flex-col md:flex-row items-center justify-between mt-12 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs text-slate-400">
                            Mostrando página <b>{meta.page}</b> de {meta.total_pages}
                        </span>

                        <div className="flex items-center gap-1 sm:gap-2">
                            <button
                                onClick={() => handlePageChange(meta.page - 1)}
                                disabled={meta.page === 1}
                                className="p-2 rounded-lg border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition text-slate-500"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {getPageNumbers().map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition ${meta.page === pageNum
                                            ? 'bg-emerald-500 text-white shadow-md'
                                            : 'border border-gray-50 text-slate-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(meta.page + 1)}
                                disabled={meta.page === meta.total_pages}
                                className="p-2 rounded-lg border border-gray-100 disabled:opacity-30 hover:bg-gray-50 transition text-slate-500"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}

// 2. Componente padrão que faz o encapsulamento no Suspense
export default function App() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}

function ServiceCard({ service, imageColor }: { service: any, imageColor: string }) {
    const description = stripHtml(service.content?.content || "Sem descrição disponível.");
    const locationText = `${service.Address?.street || service.Address?.neighborhood || service.Address?.city || "Localização não informada"}`;
    const distance = service.distance;

    return (
        <a
            href={`servico/${service.id}`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group relative"
        >
            <div className={`w-full h-48 ${imageColor} relative overflow-hidden`}>
                <img
                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${service.id_workspace}/${service.logo_image}`}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />

                {/* Badge de Distância em KM */}
                {distance && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                        <MapPin size={10} fill="white" />
                        {distance}
                    </div>
                )}

                <div className="absolute top-3 left-3 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-600 text-[9px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                        {service.Category?.name || "Geral"}
                    </span>
                    <span className="bg-white/90 backdrop-blur-sm text-slate-600 text-[9px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                        {service.Subcategory?.name || "Geral"}
                    </span>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {service.name}
                </h3>

                <p className="text-slate-400 text-[11px] leading-relaxed mb-4 line-clamp-3 flex-1">
                    {description}
                </p>

                <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                        <MapPin size={12} className="text-emerald-500/60" />
                        <span className="truncate max-w-[140px] capitalize">{locationText}</span>
                    </div>

                    <span className="text-emerald-500 text-[9px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver detalhes
                    </span>
                </div>
            </div>
        </a>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 flex flex-col h-[360px] animate-pulse">
            <div className="w-full h-48 bg-gray-200"></div>
            <div className="p-4 flex flex-col flex-1 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-full bg-gray-100 rounded"></div>
                <div className="h-3 w-full bg-gray-100 rounded"></div>
                <div className="mt-auto h-3 w-1/2 bg-gray-50 rounded"></div>
            </div>
        </div>
    );
}