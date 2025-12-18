import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Search, Wrench, BarChart3, Star, User, LogOut, X, Image, HelpCircle } from 'lucide-react';

export default function DashboardHeaderSearchbar() {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    
    // Novo estado para controlar a visibilidade no mobile
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const sidebarOptions = [
        { label: 'Meus serviços', icon: Wrench, href: '/dashboard' },
        { label: 'Galeria', icon: Image, href: '/dashboard/galeria' },
        // { label: 'Métricas', icon: BarChart3, href: '/metricas' },
        // { label: 'Assinaturas', icon: Star, href: '/assinaturas' },
        { label: 'Meus dados', icon: User, href: '/dashboard/meus-dados' },
        { label: 'Perguntas frequentes', icon: HelpCircle, href: '/dashboard/faq' },
    ];

    const filteredOptions = sidebarOptions.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
    );

    // Fecha ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
                setActiveIndex(-1);
                // No mobile, se clicar fora, fecha a barra de pesquisa também
                setIsMobileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClear = () => {
        if (query === '' && isMobileOpen) {
            // Se já estiver vazio e for mobile, fecha a barra
            setIsMobileOpen(false);
        } else {
            setQuery('');
            setShowDropdown(false);
            setActiveIndex(-1);
            inputRef.current?.focus();
        }
    };

    const handleOpenMobile = () => {
        setIsMobileOpen(true);
        // Delay pequeno para garantir que o elemento foi renderizado antes do focus
        setTimeout(() => {
            inputRef.current?.focus();
        }, 50);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setShowDropdown(true);
        setActiveIndex(-1);
    };

    const handleFocus = () => {
        if (query.length > 0) setShowDropdown(true);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setShowDropdown(false);
            setIsMobileOpen(false); // Fecha mobile ao dar ESC
            inputRef.current?.blur();
            return;
        }

        if (!showDropdown || filteredOptions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && filteredOptions[activeIndex]) {
                window.location.href = filteredOptions[activeIndex].href;
                setShowDropdown(false);
            }
        }
    };

    return (
        <div className="relative font-sans" ref={searchRef}>
            
            {/* --- TRIGGER MOBILE (Lupa isolada) --- */}
            {/* Só aparece no mobile (md:hidden) e quando a barra está fechada */}
            {!isMobileOpen && (
                <button 
                    onClick={handleOpenMobile}
                    className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                >
                    <Search size={22} />
                </button>
            )}

            {/* --- BARRA DE PESQUISA --- */}
            {/* Lógica de classes:
               - Mobile Fechado: 'hidden'
               - Mobile Aberto: 'flex absolute...' (Sobrepõe o header)
               - Desktop: 'md:flex md:relative md:w-96' (Sempre visível e fixo)
            */}
            <div className={`
                items-center bg-white rounded-xl shadow-sm border transition-all duration-200 ease-in-out
                ${isMobileOpen 
                    ? 'flex absolute -top-3 -right-2 w-[calc(100vw-2rem)] z-50 p-1 animate-in fade-in slide-in-from-right-5' // Estilo Mobile Aberto
                    : 'hidden md:flex md:relative md:w-96 md:p-0' // Estilo Mobile Fechado / Desktop
                }
                ${showDropdown 
                    ? 'border-lime-500 ring-4 ring-lime-500/10 rounded-b-none' 
                    : 'border-gray-200 hover:border-lime-300 focus-within:border-lime-500 focus-within:ring-4 focus-within:ring-lime-500/10'
                }
            `}>
                {/* Ícone de busca dentro da barra */}
                <div className="pl-4 py-2.5">
                    <Search 
                        className={`flex-shrink-0 transition-colors ${showDropdown ? 'text-lime-500' : 'text-gray-400'}`} 
                        size={20} 
                    />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    placeholder="O que você procura?"
                    className="bg-transparent outline-none text-gray-700 w-full text-sm placeholder:text-gray-400 px-3 py-2.5"
                    value={query}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                />

                {/* Botão limpar/fechar */}
                <div className="pr-2">
                    <button
                        onClick={handleClear}
                        // No mobile sempre mostra o X para poder fechar a barra
                        className={`
                            p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-all duration-200
                            ${query.length > 0 || isMobileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}
                        `}
                        aria-label="Limpar ou Fechar"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* --- DROPDOWN (Lista de resultados) --- */}
            {/* Renderização condicional idêntica para mobile e desktop */}
            {showDropdown && query.length > 0 && (
                <div className={`
                    bg-white rounded-b-xl shadow-xl border-x border-b border-gray-100 overflow-hidden max-h-[300px] overflow-y-auto 
                    ${isMobileOpen ? 'absolute top-[calc(100%-0.5rem)] -right-2 w-[calc(100vw-2rem)] z-50' : 'absolute top-full left-0 w-full z-50'}
                `}>
                    {filteredOptions.length > 0 ? (
                        <ul className="py-2">
                            {filteredOptions.map((option, index) => {
                                const Icon = option.icon;
                                const isActive = index === activeIndex;
                                
                                return (
                                    <li key={index}>
                                        <a
                                            href={option.href}
                                            className={`
                                                flex items-center px-4 py-3 text-sm transition-all cursor-pointer relative
                                                ${isActive ? 'bg-lime-50 text-lime-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                            `}
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setIsMobileOpen(false);
                                            }}
                                            onMouseEnter={() => setActiveIndex(index)}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-lime-500 rounded-r-full" />
                                            )}
                                            
                                            <Icon
                                                size={18}
                                                className={`mr-3 transition-colors ${isActive ? 'text-lime-600' : 'text-lime-500/70'}`}
                                            />
                                            <span className="font-medium">{option.label}</span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="px-4 py-6 text-center">
                            <p className="text-sm text-gray-500">Nenhum resultado para "<span className="font-medium text-gray-800">{query}</span>"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}