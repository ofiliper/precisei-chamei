"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, MapPin, Loader2, Search, Navigation, ChevronDown, ChevronUp } from "lucide-react";
import usePublicServices from "@/hooks/usePublicServices";

export default function Header() {

    const publicServiceHook = usePublicServices();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Agora 'location' guarda apenas o texto para exibição
    const [locationDisplay, setLocationDisplay] = useState("Sua localização");
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Estados para o formulário
    const [cep, setCep] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [addressDetails, setAddressDetails] = useState({
        logradouro: "",
        numero: "",
        bairro: "",
        localidade: "",
        uf: ""
    });

    const cepInputRef = useRef<HTMLInputElement>(null);
    const numberInputRef = useRef<HTMLInputElement>(null);

    // 1. Recupera do LocalStorage
    useEffect(() => {
        const savedData = localStorage.getItem("user_location_data");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.address) {
                    setLocationDisplay(parsed.address);
                }
            } catch (e) {
                setLocationDisplay(savedData);
            }
        }
    }, []);

    useEffect(() => {
        if (isModalOpen && cepInputRef.current) {
            setTimeout(() => cepInputRef.current?.focus(), 100);
        }
        if (!isModalOpen) {
            setShowDetails(false);
        }
    }, [isModalOpen]);

    // --- FUNÇÃO DE SALVAMENTO ---
    const saveLocationData = (address: string, lat: number, lng: number) => {
        const dataToSave = {
            address,
            lat,
            lng
        };

        localStorage.setItem("user_location_data", JSON.stringify(dataToSave));
        setLocationDisplay(address);
        setIsModalOpen(false);
    };

    // --- LÓGICA DE CEP (ViaCEP) ---
    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 8) value = value.slice(0, 8);
        const formattedCpf = value.replace(/^(\d{5})(\d)/, "$1-$2");
        setCep(formattedCpf);

        if (value.length === 8) {
            setLoadingLocation(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setAddressDetails(prev => ({
                        ...prev,
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        localidade: data.localidade,
                        uf: data.uf
                    }));
                    setShowDetails(true);
                    setTimeout(() => numberInputRef.current?.focus(), 100);
                } else {
                    alert("CEP não encontrado.");
                }
            } catch (error) {
                console.error("Erro ViaCEP", error);
            } finally {
                setLoadingLocation(false);
            }
        }
    };

    // --- SALVAR MANUALMENTE ---
    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();

        const { logradouro, numero, bairro, localidade, uf } = addressDetails;

        if (!localidade || !uf) {
            alert("Preencha cidade e estado.");
            return;
        }

        let fullAddress = "";
        if (logradouro) fullAddress += `${logradouro}`;
        if (numero) fullAddress += `, ${numero}`;
        if (bairro) fullAddress += ` - ${bairro}`;
        fullAddress += fullAddress ? `, ${localidade} - ${uf}` : `${localidade} - ${uf}`;

        setLoadingLocation(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/map?address=${encodeURIComponent(fullAddress)}`
            );
            const data = await res.json();

            if (data.ok) {
                // Ajuste conforme o retorno do seu backend
                const lat = data.data.lat || data.data.geometry?.location?.lat;
                const lng = data.data.lng || data.data.geometry?.location?.lng;

                saveLocationData(fullAddress, lat, lng);
                publicServiceHook.fetchServices();
            } else {
                alert("Não foi possível encontrar as coordenadas deste endereço.");
            }
        } catch (error) {
            console.error("Erro ao geocodificar manual:", error);
            alert("Erro ao validar endereço.");
        } finally {
            setLoadingLocation(false);
        }
    };

    // --- LÓGICA DE GPS ---
    const handleGetLocation = () => {
        setLoadingLocation(true);
        if (!navigator.geolocation) {
            alert("Geolocalização não suportada.");
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/map?address=${latitude},${longitude}`
                    );
                    const data = await res.json();

                    if (data.ok) {
                        saveLocationData(data.data.formattedAddress, latitude, longitude);
                        publicServiceHook.fetchServices();

                    } else {
                        alert("Endereço não encontrado.");
                    }
                } catch (error) {
                    console.error("Erro API Google:", error);
                } finally {
                    setLoadingLocation(false);
                }
            },
            (error) => {
                console.error("Erro GPS:", error);
                setLoadingLocation(false);
                alert("Permissão de localização negada.");
            }
        );
    };

    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-[1100px] w-full mx-auto px-4 py-4 flex justify-between items-center">

                    <div className="flex items-center gap-6">
                        <a href="/"><img src="precisei-chamei.svg" className="w-[70px] md:w-[100px]" alt="Logo" /></a>

                        <div className="hidden md:block">
                            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 border border-slate-200 rounded-full px-4 py-2 hover:border-emerald-200 transition bg-slate-50 active:scale-95">
                                <MapPin size={18} className="text-emerald-600" />
                                <span className="truncate max-w-[150px] font-medium">{locationDisplay}</span>
                            </button>
                        </div>
                    </div>

                    {/* --- DESKTOP NAV REINSERIDA AQUI --- */}
                    <div className="hidden md:flex items-center gap-6">
                        <a href="/auth/cadastrar" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition">
                            Divulgue seu negócio
                        </a>
                        <a href="/auth/login" className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] hover:bg-emerald-600 text-white px-6 py-2 rounded-md font-semibold transition shadow-md shadow-emerald-200">
                            Entrar
                        </a>
                    </div>

                    <button className="md:hidden text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Dropdown... */}
                <div className={`md:hidden bg-white border-t border-slate-100 absolute w-full left-0 top-full shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-4 flex flex-col gap-4">
                        <button onClick={() => { setIsMenuOpen(false); setIsModalOpen(true); }} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between w-full text-left active:bg-slate-100">
                            <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                                <MapPin size={16} className="text-emerald-600" /> {locationDisplay}
                            </span>
                            <span className="text-xs text-emerald-600 font-bold underline">Alterar</span>
                        </button>

                        {/* --- MOBILE NAV REINSERIDA AQUI --- */}
                        <a href="/auth/cadastrar" className="text-base font-medium text-slate-600 hover:text-emerald-600">
                            Divulgue seu negócio
                        </a>
                        <a href="/auth/login" className="bg-gradient-to-r from-[#2080B3] to-[#40A56A] text-white text-center py-3 rounded-md font-semibold">
                            Entrar
                        </a>
                    </div>
                </div>
            </header>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>

                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                            <h3 className="font-semibold text-slate-800">Definir localização</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full p-1 transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <button
                                onClick={handleGetLocation}
                                disabled={loadingLocation}
                                className="w-full flex items-center justify-center gap-3 bg-emerald-50 text-emerald-700 font-semibold py-3 rounded-lg hover:bg-emerald-100 transition border border-emerald-100 disabled:opacity-50 mb-6"
                            >
                                {loadingLocation ? <Loader2 size={20} className="animate-spin" /> : <Navigation size={20} className="fill-current" />}
                                Usar localização atual
                            </button>

                            <div className="relative flex items-center mb-6">
                                <div className="flex-grow h-px bg-slate-200"></div>
                                <span className="px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">Ou informe o CEP</span>
                                <div className="flex-grow h-px bg-slate-200"></div>
                            </div>

                            <form onSubmit={handleSaveAddress} className="space-y-4">
                                <div className="relative">
                                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">CEP</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            ref={cepInputRef}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={9}
                                            placeholder="00000-000"
                                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition font-medium tracking-wide"
                                            value={cep}
                                            onChange={handleCepChange}
                                        />
                                        {loadingLocation && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Loader2 size={18} className="animate-spin text-emerald-600" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {!showDetails && cep.length < 8 && (
                                    <button
                                        type="button"
                                        onClick={() => setShowDetails(true)}
                                        className="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1"
                                    >
                                        Não sei o CEP / Preencher manualmente <ChevronDown size={14} />
                                    </button>
                                )}

                                {showDetails && (
                                    <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="col-span-2">
                                                <label className="text-xs text-slate-500 block mb-1">Cidade</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-emerald-500 outline-none bg-slate-50"
                                                    value={addressDetails.localidade}
                                                    onChange={e => setAddressDetails({ ...addressDetails, localidade: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1">UF</label>
                                                <input
                                                    type="text"
                                                    required
                                                    maxLength={2}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-emerald-500 outline-none bg-slate-50 uppercase"
                                                    value={addressDetails.uf}
                                                    onChange={e => setAddressDetails({ ...addressDetails, uf: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs text-slate-500 block mb-1">Rua / Logradouro</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-emerald-500 outline-none"
                                                placeholder="Av. Paulista"
                                                value={addressDetails.logradouro}
                                                onChange={e => setAddressDetails({ ...addressDetails, logradouro: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="col-span-1">
                                                <label className="text-xs text-slate-500 block mb-1">Número</label>
                                                <input
                                                    ref={numberInputRef}
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-emerald-500 outline-none"
                                                    placeholder="123"
                                                    value={addressDetails.numero}
                                                    onChange={e => setAddressDetails({ ...addressDetails, numero: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-xs text-slate-500 block mb-1">Bairro</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-emerald-500 outline-none"
                                                    value={addressDetails.bairro}
                                                    onChange={e => setAddressDetails({ ...addressDetails, bairro: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowDetails(false)}
                                            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 mt-2"
                                        >
                                            <ChevronUp size={12} /> Menos opções
                                        </button>
                                    </div>
                                )}

                                {(showDetails || cep.length === 9) && (
                                    <button
                                        type="submit"
                                        disabled={loadingLocation}
                                        className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition shadow-md shadow-emerald-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
                                    >
                                        {loadingLocation ? <Loader2 size={24} className="animate-spin" /> : "Confirmar Endereço"}
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}