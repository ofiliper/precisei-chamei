import "./dashboard-container-style.css"
import QuestionChat from "../QuestionChat/QuestionChat"
import { Bell, Menu, X, CogIcon, LogOut, LogOutIcon, Search, MessageSquare, Calendar, Settings, Home, Users, FileText, BarChart2, HelpCircle, ChevronDown } from "lucide-react"
import { useStore } from "zustand"
import { sidebarStore } from "@/store/sidebar/sidebar-store"
import { usePathname } from "next/navigation"
import { Cookies } from "react-cookie"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import useVerador from "@/hooks/useVereador"
import { Toaster } from "@/components/ui/toaster"
import { vereadorStore } from "@/store/vereador/vereador-store"
import { Skeleton } from "@/components/ui/skeleton"
import { twMerge } from "tailwind-merge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardContainer({ children }: { children: React.ReactElement }) {
    const cookies = new Cookies();
    const sidebar = useStore(sidebarStore);
    const vereador = useStore(vereadorStore);
    const { menu } = sidebar.data;
    const { role, vereador: vereadorInfo, fetching } = vereador.data;
    const vereadorHook = useVerador();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        vereadorHook.fetchVereadorInfo({ id: cookies.get('vereador') })
            .catch(() => {
                window.location.href = '/dashboard'
            });
    }, []);

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        cookies.remove('userid');
        window.location.href = '/auth/login';
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50">
                <div className="max-w-[1600px] mx-auto">
                    <div className="flex items-center justify-between px-4 lg:px-8 h-16 lg:h-20">
                        <div className="flex items-center gap-6">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden hover:bg-gray-100 rounded-full"
                                onClick={toggleSidebar}
                            >
                                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>

                            <Link href="/dashboard" className="flex items-center">
                                <img src="/images/vesoft.svg" alt="Logo" className="h-8 lg:h-10 w-auto transition-all" />
                            </Link>
                        </div>

                        {/* Global Search - Desktop */}
                        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                            <div className="relative w-full group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    type="search"
                                    placeholder="Pesquisar em qualquer lugar..."
                                    className="w-full pl-11 pr-4 py-2 bg-gray-50/50 border-0 ring-1 ring-gray-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all"
                                />
                                <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-400 opacity-100 transition-opacity group-focus-within:opacity-0">
                                    <span className="text-xs">/</span>
                                </kbd>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 lg:gap-6">
                            {/* Quick Actions */}
                            <div className="hidden md:flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative hover:bg-gray-100 rounded-full h-10 w-10 transition-all"
                                >
                                    <Bell className="h-5 w-5 text-gray-700" />
                                    <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-gray-100 rounded-full h-10 w-10 transition-all"
                                >
                                    <MessageSquare className="h-5 w-5 text-gray-700" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-gray-100 rounded-full h-10 w-10 transition-all"
                                >
                                    <Calendar className="h-5 w-5 text-gray-700" />
                                </Button>
                            </div>

                            {/* Search Toggle - Mobile */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden hover:bg-gray-100 rounded-full"
                                onClick={toggleSearch}
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            {/* User Menu */}
                            {!fetching && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-3 px-2 py-7 rounded-xl hover:bg-gray-100 transition-all">
                                            <div className="hidden sm:flex flex-col items-end">
                                                <span className="font-medium text-sm text-gray-900">{vereadorInfo?.name}</span>
                                                <span className="text-xs text-gray-500">Vereador</span>
                                            </div>
                                            <Avatar className="h-9 w-9 ring-2 ring-purple-100 transition-all">
                                                <AvatarImage src={vereadorInfo?.avatar || 'https://www.angradosreis.rj.leg.br/atividade-legislativa/legislaturas/legislatura-2017/leo_marmoraria.png'} />
                                                <AvatarFallback>VR</AvatarFallback>
                                            </Avatar>
                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 mt-2 p-2">
                                        <DropdownMenuLabel className="px-2 py-1.5 text-sm font-normal text-gray-500">Minha Conta</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="my-1.5" />
                                        <DropdownMenuItem className="rounded-lg cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Configurações</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Sair</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isSearchOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-4 border-t border-gray-200/50">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    type="search"
                                    placeholder="Pesquisar..."
                                    className="w-full pl-11 pr-4 py-2 bg-gray-50/50 border-0 ring-1 ring-gray-200/50 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="pt-16 lg:pt-20 flex min-h-screen">
                {/* Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                        onClick={toggleSidebar}
                    />
                )}

                {/* Sidebar */}
                <aside className={`fixed left-0 top-16 lg:top-20 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 overflow-y-auto transition-transform duration-300 z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                    <div className="flex flex-col h-full p-4 lg:p-6">
                        <nav className="space-y-1.5">
                            {menu.map((item: any, index: number) => {
                                if (fetching) return (
                                    <Skeleton key={index} className="h-12 rounded-xl" />
                                )
                                if (item.roles.includes(role)) {
                                    return (
                                        <Link
                                            key={index}
                                            href={item.path}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={twMerge(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                                pathname === item.path
                                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                                    : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
                                            )}
                                        >
                                            {<item.icon className="h-5 w-5 flex-shrink-0" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    )
                                }
                            })}
                        </nav>

                        {/* Help Card */}
                        <div className="mt-auto mb-6">
                            <div className="p-6 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-2xl border border-purple-100 backdrop-blur-xl">
                                <div className="p-3 bg-purple-600 rounded-xl w-fit mb-4">
                                    <HelpCircle className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Precisa de ajuda?</h4>
                                <p className="text-sm text-gray-600 mb-4">Nossa equipe está disponível 24/7 para te ajudar</p>
                                <Button className="w-full bg-white hover:bg-gray-50 text-purple-600 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                                    Falar com Suporte
                                </Button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="w-full lg:ml-72 p-4 lg:p-8">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1 min-w-0">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Toaster />
        </div>
    )
}