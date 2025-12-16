import { useState, useRef, useEffect } from 'react';
import { Search, Wrench, BarChart3, Star, User, LogOut, X } from 'lucide-react';

export default function DashboardHeaderSearchbar() {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // Ref para detectar cliques fora do componente
    const searchRef = useRef(null);
    // Ref para focar no input ao limpar
    const inputRef = useRef(null);

    const sidebarOptions = [
        { label: 'Meus serviços', icon: Wrench, href: '/servicos' },
        { label: 'Métricas', icon: BarChart3, href: '/metricas' },
        { label: 'Assinaturas', icon: Star, href: '/assinaturas' },
        { label: 'Meus dados', icon: User, href: '/perfil' },
        { label: 'Logout', icon: LogOut, href: '/logout' },
    ];

    const filteredOptions = sidebarOptions.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
    );

    // Lógica para fechar o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: any) {
            //@ts-ignore
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    // Função para limpar o texto
    const handleClear = () => {
        setQuery('');
        setShowDropdown(false);
        //@ts-ignore
        inputRef.current?.focus();
    };

    // Função ao digitar
    const handleChange = (e) => {
        setQuery(e.target.value);
        setShowDropdown(true);
    };

    // Função ao clicar no input (reabre o dropdown se tiver texto)
    const handleFocus = () => {
        if (query.length > 0) setShowDropdown(true);
    };

    return (
        <div className="relative w-full md:w-96 z-50"  ref={searchRef}>

            {/* Input Wrapper */}
            <div className="flex items-center bg-white px-4 py-3 rounded-xl w-full shadow-sm border border-transparent focus-within:border-gray-200 transition-all">
                <Search className="text-gray-400 mr-3 flex-shrink-0" size={20} />

                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Pesquisar..."
                    className="bg-transparent outline-none text-gray-600 w-full text-sm"
                    value={query}
                    onChange={handleChange}
                    onFocus={handleFocus}
                />

                {/* Botão X para limpar (só aparece se tiver texto) */}
                {query.length > 0 && (
                    <button
                        onClick={handleClear}
                        className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Dropdown (Só aparece se showDropdown for true E houver texto) */}
            {showDropdown && query.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        <ul>
                            {filteredOptions.map((option, index) => {
                                const Icon = option.icon;
                                return (
                                    <li key={index}>
                                        <a
                                            href={option.href}
                                            className="flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer group"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <Icon
                                                size={18}
                                                // Cor alterada para lime-500 (verde)
                                                className="mr-3 text-lime-500 group-hover:text-lime-600 transition-colors"
                                            />
                                            {option.label}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-400 text-center">
                            Nenhum resultado encontrado.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}