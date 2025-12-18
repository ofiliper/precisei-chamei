'use client'

import React, { useState, useRef } from 'react';
import {
    MapPin,
    Instagram,
    Facebook,
    Youtube,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    Menu,
    X,
    User,
    Search
} from 'lucide-react';

import Footer from '@/components/layout/home/Footer';
import Header from '@/components/layout/home/Header';

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const scrollRef = useRef(null);

    // Dados mockados para simular o conteúdo da imagem
    const prestador = {
        nome: "Selina Manicure",
        categoria: "Saúde e beleza",
        distancia: "3km",
        endereco: "R. Japoranga - Curicica",
        descricao: [
            "Sou especialista em alongamento de unhas, fibra de vidro e nail art. Tenho mais de 5 anos de experiência transformando a autoestima das minhas clientes através do cuidado com as unhas. Utilizo apenas produtos de primeira linha e materiais 100% esterilizados.",
            "Meu estúdio oferece um ambiente aconchegante e climatizado para você relaxar enquanto se cuida. Trabalho com horários agendados para garantir um atendimento exclusivo e sem pressa.",
            "Ofereço também serviços de spa dos pés e plástica dos pés. Venha conhecer meu trabalho e tomar um café conosco!"
        ],
        fotos: [
            "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1632922267756-9b71242b1592?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1599693359686-ca35286be62f?auto=format&fit=crop&q=80&w=800"
        ]
    };

    const scroll = (direction: string) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                //@ts-ignore
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                //@ts-ignore
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

            <Header />

            {/* --- HERO IMAGE --- */}
            <div className="w-full h-64 md:h-80 relative bg-gray-300">
                <img
                    src="https://images.unsplash.com/photo-1600067642646-6085a11394c4?auto=format&fit=crop&q=80&w=2000"
                    alt="Capa Manicure"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* --- MAIN CONTENT CONTAINER --- */}
            <main className="container w-[990px] mx-auto px-4 md:px-8 pb-12">

                {/* Profile Header Block */}
                <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-start gap-6">

                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white">
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
                                alt="Foto de Perfil"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Header Info */}
                    <div className="mt-4 md:mt-20 flex-1 w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{prestador.nome}</h1>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {prestador.distancia} • {prestador.endereco}
                                    </span>
                                    <span className="px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold bg-white">
                                        {prestador.categoria}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded shadow-sm font-medium flex items-center justify-center gap-2 transition">
                                <MessageCircle className="w-5 h-5" />
                                Entrar em contato
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- DESCRIPTION --- */}
                <section className="mb-12 max-w-4xl">
                    <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                        {prestador.descricao.map((paragrafo, index) => (
                            <p key={index}>{paragrafo}</p>
                        ))}
                    </div>
                </section>

                {/* --- GALLERY CAROUSEL --- */}
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
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {prestador.fotos.map((foto, index) => (
                            <div key={index} className="flex-none w-72 md:w-80 h-56 rounded-lg overflow-hidden shadow-sm snap-start">
                                <img src={foto} alt={`Trabalho ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- MIDDLE CTA --- */}
                <section className="flex flex-col items-center justify-center gap-6 mb-16 py-8 border-t border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700">Minhas redes</h3>
                    <div className="flex gap-6">
                        <a href="#" className="p-3 bg-white rounded-full shadow-sm hover:text-pink-600 hover:shadow-md transition">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="#" className="p-3 bg-white rounded-full shadow-sm hover:text-blue-600 hover:shadow-md transition">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="#" className="p-3 bg-white rounded-full shadow-sm hover:text-red-600 hover:shadow-md transition">
                            <Youtube className="w-6 h-6" />
                        </a>
                    </div>
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded shadow-md font-medium transition">
                        Entrar em contato
                    </button>
                </section>

                {/* --- MAP SECTION --- */}
               

            </main>

            <Footer />
        </div>
    );
};

export default App;