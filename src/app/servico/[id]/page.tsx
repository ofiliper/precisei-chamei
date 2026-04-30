'use client'

import React, { useRef, useEffect } from 'react';
import {
    MapPin,
    Instagram,
    Facebook,
    Youtube,
    Twitter,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    User,
    Search
} from 'lucide-react';

import Footer from '@/components/layout/home/Footer';
import Header from '@/components/layout/home/Header';
import usePublicServices from '@/hooks/usePublicServices';
import { useParams } from 'next/navigation';
import { publicServiceStore } from '@/store/services/public-service.store';
import { useStore } from 'zustand';
import { APP_CONFIG } from '@/constants/app-config';

// Remove HTML
const stripHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

const App = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const publicService = useStore(publicServiceStore);
    const servicePublicHook = usePublicServices();

    const params = useParams();
    const id = typeof params?.id === 'string' ? params.id : '';

    useEffect(() => {
        if (id) {
            servicePublicHook.fetchOneService(id);
        }
    }, [id]);

    const service = publicService.data || {};
    const isLoading = service.fetching;

    // =========================
    // ✅ FIX REAL (PARSE)
    // =========================
    let parsedContent: any = {};
    let parsedGallery: string[] = [];

    try {
        parsedContent = typeof service.content === 'string'
            ? JSON.parse(service.content)
            : service.content || {};
    } catch {
        parsedContent = {};
    }

    try {
        parsedGallery = typeof service.gallery === 'string'
            ? JSON.parse(service.gallery)
            : Array.isArray(service.gallery)
                ? service.gallery
                : [];
    } catch {
        parsedGallery = [];
    }

    // =========================
    // HELPERS
    // =========================
    const descriptionText = stripHtml(parsedContent?.content || "");
    const socialMedia = parsedContent?.social_media || {};

    const address = service.address;
    const fullAddress = address
        ? `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}`
        : "Endereço não informado";

    const scroll = (direction: string) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const createWhatsappContact = async () => {
        await servicePublicHook.fetchCreateWhatsappContact(service.id);

        const cleanPhone = service.whatsapp?.replace(/\D/g, '');

        if (!cleanPhone) return;

        window.open(
            `https://wa.me/55${cleanPhone}?text=Olá, estou interessado no seu serviço.`,
            '_blank'
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

            <Header />

            {/* --- HERO IMAGE (CAPA) --- */}
            <div className="w-full h-64 md:h-80 relative bg-gray-300">
                {service.cover_image ? (
                    <img
                        src={`${APP_CONFIG.api.production}/${service.id_workspace}/${service.cover_image}`}
                        alt={`Capa ${service.name}`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        SEM CAPA
                    </div>
                )}
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* --- MAIN CONTENT CONTAINER --- */}
            <main className="container max-w-[990px] mx-auto px-4 md:px-8 pb-12">

                {/* Profile Header Block */}
                <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-start gap-6">

                    {/* Avatar (Logo) */}
                    <div className="relative flex-shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center">
                            {service.logo_image ? (
                                <img
                                    src={`${APP_CONFIG.api.production}/${service.id_workspace}/${service.logo_image}`}
                                    alt={`Logo ${service.name}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User size={48} className="text-gray-300" />
                            )}
                        </div>
                    </div>

                    {/* Header Info */}
                    <div className="mt-4 md:mt-20 flex-1 w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{service.name}</h1>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {fullAddress}
                                    </span>
                                    <span className="px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold bg-white uppercase">
                                        {service.category?.name || "Geral"}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={createWhatsappContact}
                                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded shadow-sm font-medium flex items-center justify-center gap-2 transition">
                                <MessageCircle className="w-5 h-5" />
                                Entrar em contato
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- DESCRIPTION --- */}
                <section className="mb-12 max-w-4xl">
                    <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                        {descriptionText || "Este prestador ainda não adicionou uma descrição detalhada."}
                    </div>
                </section>

                {/* --- GALLERY CAROUSEL --- */}
                {parsedGallery.length > 0 && (
                    <section className="mb-16 relative group">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Meus Trabalhos</h2>
                            <div className="flex gap-2">
                                <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white shadow hover:bg-gray-50 border">
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white shadow hover:bg-gray-50 border">
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={scrollRef}
                            className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar scroll-smooth"
                        >
                            {parsedGallery.map((foto, index) => (
                                <div key={index} className="flex-none w-72 md:w-80 h-56 rounded-lg overflow-hidden shadow-sm snap-start bg-gray-100">
                                    <img
                                        src={`${APP_CONFIG.api.production}/${service.id_workspace}/${foto}`}
                                        alt={`Trabalho ${index + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* --- SOCIAL --- */}
                <section className="flex flex-col items-center justify-center gap-6 mb-16 py-8 border-t border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700">Minhas redes</h3>
                    <div className="flex gap-6">
                        {socialMedia.instagram && <a href={socialMedia.instagram}><Instagram /></a>}
                        {socialMedia.facebook && <a href={socialMedia.facebook}><Facebook /></a>}
                        {socialMedia.youtube && <a href={socialMedia.youtube}><Youtube /></a>}
                        {socialMedia.x && <a href={socialMedia.x}><Twitter /></a>}

                        {!socialMedia.instagram &&
                            !socialMedia.facebook &&
                            !socialMedia.youtube &&
                            !socialMedia.x && (
                                <span className="text-sm text-gray-400">
                                    Nenhuma rede social informada
                                </span>
                            )}
                    </div>

                    <button
                        onClick={createWhatsappContact}
                        className="flex gap-2 items-center bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded shadow-md font-medium transition">
                        <MessageCircle className="w-5 h-5" />
                        Entrar em contato
                    </button>
                </section>

            </main>

            <Footer />
        </div>
    );
};

export default App;