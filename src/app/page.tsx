'use client'

import Image from "next/image";
import { Search, MapPin, ChevronDown, Instagram, Facebook, Youtube, ArrowRight, Menu } from "lucide-react";
import Header from "@/components/layout/home/Header";
import Footer from "@/components/layout/home/Footer";
import SmartSearch from "@/components/shared/SmartSearch";

function App() {
    return (
        <main className="min-h-screen font-sans text-slate-600">
            {/*HEADER */}
            <Header />

            {/* HERO SECTION */}
            <section className="pt-16 md:pt-20 pb-40  px-4 text-center bg-gray-100">
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
                    <SmartSearch />
                    <button className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] hover:bg-emerald-600 text-white px-8 py-2 rounded-md font-medium transition">
                        Buscar
                    </button>
                </div>
            </section>

            {/* RECENT SERVICES */}
            <section className="py-8 container mx-auto px-4 max-w-4xl -mt-[140px]">
                <h3 className="text-center text-slate-500 text-sm font-medium mb-8 uppercase tracking-wide">Serviços recentes</h3>

                <div className="flex flex-col gap-4 bg-white py-7 px-7 rounded-xl -mt-5">
                    {/* Card 1 */}
                    <ServiceCard
                        imageColor="bg-orange-100"
                        category="Saúde e beleza"
                        title="Selina Manicure"
                        desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget lacus quis neque ultricies convallis."
                        distance="2km"
                        location="R. Japocoranga - Canhembebê"
                    />
                    {/* Card 2 */}
                    <ServiceCard
                        imageColor="bg-blue-100"
                        category="Mecânica automotiva"
                        title="Oficina do Sérgio"
                        desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget lacus quis neque ultricies convallis."
                        distance="5km"
                        location="R. Japocoranga - Canhembebê"
                    />
                    {/* Card 3 (Repeat for demo) */}
                    <ServiceCard
                        imageColor="bg-orange-100"
                        category="Saúde e beleza"
                        title="Selina Manicure"
                        desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget lacus quis neque ultricies convallis."
                        distance="2km"
                        location="R. Japocoranga - Canhembebê"
                    />
                    {/* Card 4 (Repeat for demo) */}
                    <ServiceCard
                        imageColor="bg-blue-100"
                        category="Mecânica automotiva"
                        title="Oficina do Sérgio"
                        desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget lacus quis neque ultricies convallis."
                        distance="5km"
                        location="R. Japocoranga - Canhembebê"
                    />
                </div>

                <div className="text-center mt-8">
                    <button className="text-emerald-600 text-sm font-medium border border-gray-200 bg-white px-6 py-2 rounded-full hover:bg-emerald-50 transition">
                        Ver mais serviços
                    </button>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-16 container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Como funciona?</h2>
                    <p className="text-slate-400 text-xs">O que você precisa está aqui. Peça e receba onde estiver.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                    {/* Card Prestador */}
                    <div className="rounded-2xl p-8 flex flex-row items-center relative overflow-hidden group">
                        {/* Illustration Placeholder */}
                        <div className="bg-emerald-200 rounded-full mb-6 flex items-center justify-center">
                            <img src="service.png" className="w-full" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Para o prestador de serviços</h3>
                            <p className="text-slate-500 text-sm mb-6 max-w-xs">
                                O que você precisa está aqui. Peça e receba onde estiver.
                            </p>
                            <button className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-sky-700 transition">
                                Saiba mais
                            </button>
                        </div>
                    </div>

                    {/* Card Cliente */}
                    <div className="rounded-2xl p-8 flex flex-row items-center relative overflow-hidden">
                        {/* Illustration Placeholder */}
                        <div className="rounded-full mb-6 flex items-center justify-center">
                            <img src="user.png" className="w-full" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Para o cliente</h3>
                            <p className="text-slate-500 text-sm mb-6 max-w-xs">
                                O que você precisa está aqui. Peça e receba onde estiver.
                            </p>
                            <button className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-emerald-600 transition">
                                Saiba mais
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ADVERTISE SECTION */}
            <section className="py-16 container mx-auto px-4 max-w-5xl">
                <div className="relative rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-sm">

                    <div className="md:w-4/12 mb-8 md:mb-0 z-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mb-4 leading-tight">
                            Quer anunciar<br /> um serviço <br /> também?
                        </h2>
                        <p className="text-slate-500 text-sm mb-6">
                            O que você precisa está aqui.<br /> Peça e receba onde estiver.
                        </p>
                        <button className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] text-white px-8 py-2.5 rounded-md font-medium hover:bg-sky-700 transition">
                            Saiba mais
                        </button>
                    </div>

                    <div className="md:w-8/12 flex justify-center z-10">
                        <img src="img-services.png" className="w-full" />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

// Componente para o Card de Serviço (Reutilizável)
function ServiceCard({ imageColor, category, title, desc, distance, location }: any) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 transition hover:shadow-md">
            {/* Imagem do Card */}
            <div className={`w-full md:w-48 h-40 ${imageColor} rounded-lg flex-shrink-0 relative overflow-hidden`}>
                {/* Placeholder image */}
                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-gray-200">
                    IMG
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="inline-block bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded mb-2 uppercase tracking-wide">
                            {category}
                        </span>
                        <h3 className="font-bold text-lg text-slate-800 mb-1">{title}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
                            {desc}
                        </p>
                    </div>
                    <button className="hidden md:block bg-gradient-to-r from-[#2080B3] to-[#40A56A] text-white text-xs font-semibold px-4 py-2 rounded hover:bg-emerald-600 transition w-[120px]">
                        Ver mais
                    </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 mt-auto">
                    <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{location}</span>
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

export default App;