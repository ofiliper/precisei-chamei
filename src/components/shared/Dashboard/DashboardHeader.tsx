import { ChevronDown, Edit3, Loader2, LogOut, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Cookies } from "react-cookie";
import { useStore } from "zustand";

// Ajuste o caminho do import conforme sua estrutura de pastas
import DashboardHeaderSearchbar from "./DashboardHeaderSearchbar";
import { toast } from "@/hooks/use-toast";
import { workspaceStore } from "@/store/workspace/workspace-store";

export default function DashboardHeader({
    sidebarCallback: setIsSidebarOpen
}: { sidebarCallback: (arg: boolean) => void }) {
    const cookies = new Cookies();
    const router = useRouter();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Obtendo dados do store
    const workspace = useStore(workspaceStore);

    // Fecha o dropdown do usuário ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Função de Logout extraída para limpeza do JSX
    const handleLogout = () => {
        try {
            cookies.remove('userid', { path: '/' });
            router.push('/auth/login');
            toast({
                title: 'Logout realizado com sucesso',
                description: 'Você foi deslogado da sua conta.',
                variant: 'default',
            });
        } catch (error) {
            toast({
                title: 'Erro ao fazer logout',
                description: 'Não foi possível sair da sua conta. Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    return (
        // [ADAPTAÇÃO] relative: Necessário para a barra de pesquisa mobile se posicionar absolutamente dentro do header
        // [ADAPTAÇÃO] flex-row: Mantém itens alinhados horizontalmente mesmo no mobile
        <header className="relative bg-[#f5f6f3] border border-white/50 rounded-[2rem] p-4 md:px-8 md:py-3 shadow-sm flex flex-row justify-between items-center gap-4">

            {/* --- ÁREA ESQUERDA: Menu Mobile e Barra de Pesquisa --- */}
            <div className="flex items-center gap-3 md:gap-6 flex-1">
                {/* Botão Menu (Apenas Mobile) */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 bg-white hover:bg-gray-50 rounded-lg text-gray-600 shadow-sm border border-gray-100 transition-colors"
                >
                    <Menu size={24} />
                </button>

                {/* Componente de Pesquisa Responsivo */}
                {/* Ele gerencia seu próprio tamanho (w-full no mobile open, w-96 no desktop) */}
                <DashboardHeaderSearchbar />
            </div>

            {/* --- ÁREA DIREITA: Perfil do Usuário --- */}
            <div className="relative flex-shrink-0" ref={dropdownRef}>

                {
                    workspace.data.fetching
                        ? <div className="flex items-center justify-center w-full h-full min-h-[40px]">
                            <Loader2 className="animate-spin text-lime-500" size={24} />
                            <span className="sr-only">Carregando...</span> {/* Acessibilidade */}
                        </div>
                        : <button
                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                            className={`
                        flex items-center gap-3 p-1.5 pr-3 rounded-xl transition-all duration-200
                        ${isUserDropdownOpen ? 'bg-white shadow-sm ring-2 ring-gray-100' : 'hover:bg-white/60 hover:shadow-sm'}
                    `}
                        >
                            {/* Texto do Perfil (Escondido em telas muito pequenas) */}
                            <div className="hidden sm:block text-right mr-1">
                                <p className="font-bold text-gray-800 text-sm leading-tight">
                                    {workspace.data?.user?.name || 'Usuário'}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    {workspace.data?.user?.email || ''}
                                </p>
                            </div>

                            {/* Avatar */}
                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-orange-100 overflow-hidden border-2 border-white shadow-sm ring-1 ring-orange-100">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(workspace.data?.user?.name || 'U')}&background=fed7aa&color=9a3412&bold=true`}
                                    alt="Avatar"
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            <ChevronDown
                                size={16}
                                className={`text-gray-400 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                }


                {/* --- DROPDOWN MENU --- */}
                {isUserDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-40 animate-in fade-in slide-in-from-top-2 origin-top-right">

                        {/* Cabeçalho do Dropdown (Mobile apenas, já que o nome fica oculto no header) */}
                        <div className="px-5 py-4 border-b border-gray-50 mb-2 bg-gray-50/50 sm:hidden">
                            <p className="font-bold text-gray-800 text-sm">{workspace.data?.user?.name}</p>
                            <p className="text-gray-400 text-xs truncate">{workspace.data?.user?.email}</p>
                        </div>

                        <a
                            href="/dashboard/meus-dados"
                            className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-600 text-sm font-medium transition-colors"
                        >
                            <Edit3 size={16} className="text-gray-400" />
                            Editar meus dados
                        </a>

                        <div className="h-px bg-gray-100 my-1 mx-4" />

                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-5 py-3 hover:bg-red-50 flex items-center gap-3 text-red-500 text-sm font-medium transition-colors"
                        >
                            <LogOut size={16} />
                            Sair da conta
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}